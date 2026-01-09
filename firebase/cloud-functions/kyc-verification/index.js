const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// Initialize Firestore
const db = admin.firestore();

/**
 * AADHAAR VERIFICATION FUNCTION
 * Integrates with Sandbox KYC API for Aadhaar verification
 * Request: { aadhaar_number, consent, reason }
 */
exports.verifyAadhaar = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const userId = context.auth.uid;
  const { aadhaarNumber } = data;

  if (!aadhaarNumber || aadhaarNumber.length !== 12) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid Aadhaar number');
  }

  try {
    // Call Sandbox API for Aadhaar verification
    const response = await axios.post(
      'https://api.sandbox.co.in/aadhaar/verify',
      {
        aadhaar_number: aadhaarNumber,
        consent: 'Y',
        reason: 'KYC_VERIFICATION'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.KYC_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aadhaarData = response.data;

    // Store masked Aadhaar in Firestore
    const maskedAadhaar = `****-****-${aadhaarNumber.slice(-4)}`;
    
    await db.collection('users').doc(userId).update({
      aadhaar_number_masked: maskedAadhaar,
      aadhaar_verified: aadhaarData.status === 'success',
      aadhaar_linked_phone: aadhaarData.phone || null,
      kyc_status: 'pending',
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: aadhaarData.status === 'success',
      message: 'Aadhaar verified',
      maskedNumber: maskedAadhaar
    };
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    throw new functions.https.HttpsError('internal', 'Verification failed');
  }
});

/**
 * PAN VERIFICATION FUNCTION
 * Integrates with Sandbox KYC API for PAN verification
 * Request: { pan_number }
 */
exports.verifyPAN = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const userId = context.auth.uid;
  const { panNumber } = data;

  if (!panNumber || panNumber.length !== 10) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid PAN number');
  }

  try {
    // Call Sandbox API for PAN verification
    const response = await axios.post(
      'https://api.sandbox.co.in/pan/verify',
      { pan: panNumber },
      {
        headers: {
          'Authorization': `Bearer ${process.env.KYC_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const panData = response.data;

    // Store masked PAN in Firestore
    const maskedPAN = `${panNumber.slice(0, 5)}-${panNumber.slice(5)}`;
    
    await db.collection('users').doc(userId).update({
      pan_number_masked: maskedPAN,
      pan_verified: panData.status === 'success',
      pan_holder_name: panData.name || null,
      kyc_status: panData.status === 'success' ? 'verified' : 'pending',
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: panData.status === 'success',
      message: 'PAN verified',
      maskedNumber: maskedPAN
    };
  } catch (error) {
    console.error('PAN verification error:', error);
    throw new functions.https.HttpsError('internal', 'Verification failed');
  }
});

/**
 * UPLOAD ID PHOTO
 * Stores ID document in Firebase Storage
 */
exports.uploadIdPhoto = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const userId = context.auth.uid;
  const { photoBase64, fileName } = data;

  try {
    const bucket = admin.storage().bucket();
    const filePath = `kyc-documents/${userId}/${fileName}`;
    const file = bucket.file(filePath);

    const buffer = Buffer.from(photoBase64, 'base64');
    await file.save(buffer, { contentType: 'image/jpeg' });

    // Get download URL
    const [downloadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365 // 1 year
    });

    await db.collection('users').doc(userId).update({
      id_photo_url: downloadUrl,
      id_photo_uploaded_at: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: 'Photo uploaded successfully',
      url: downloadUrl
    };
  } catch (error) {
    console.error('Photo upload error:', error);
    throw new functions.https.HttpsError('internal', 'Upload failed');
  }
});

/**
 * FRAUD RISK SCORING
 * Analyzes KYC data to assign risk score
 */
exports.calculateRiskScore = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const userId = context.auth.uid;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    let riskScore = 0;
    const riskFactors = [];

    // Aadhaar verified = -20 points (low risk)
    if (userData.aadhaar_verified) riskScore -= 20;
    else riskFactors.push('Aadhaar not verified');

    // PAN verified = -15 points (low risk)
    if (userData.pan_verified) riskScore -= 15;
    else riskFactors.push('PAN not verified');

    // ID photo uploaded = -10 points (low risk)
    if (userData.id_photo_uploaded_at) riskScore -= 10;
    else riskFactors.push('ID photo not uploaded');

    // Account age (older = lower risk)
    const accountAge = Date.now() - userData.created_at.toMillis();
    if (accountAge > 1000 * 60 * 60 * 24 * 30) riskScore -= 10;
    else riskFactors.push('New account');

    // Normalize to 0-100 scale
    riskScore = Math.max(0, Math.min(100, 50 + riskScore));

    // Store risk score
    await db.collection('users').doc(userId).update({
      fraud_risk_score: riskScore,
      risk_factors: riskFactors,
      risk_calculated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      riskScore,
      riskFactors,
      riskLevel: riskScore < 30 ? 'low' : riskScore < 70 ? 'medium' : 'high'
    };
  } catch (error) {
    console.error('Risk calculation error:', error);
    throw new functions.https.HttpsError('internal', 'Risk calculation failed');
  }
});
