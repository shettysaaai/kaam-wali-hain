# Kaam Wali Hain? - Complete Deployment & Implementation Guide

**Build, Deploy & Launch the World's Best AI-Powered Domestic Worker Marketplace**

---

## Phase 1: Pre-Development Setup (Week 1-2)

### 1.1 Firebase Project Setup

1. **Go to Firebase Console**: https://firebase.google.com
2. **Create New Project**:
   - Project Name: `kaam-wali-hain`
   - Analytics: Enable
   - Default Location: `asia-south1` (India)
3. **Enable Services**:
   ```
   ✓ Authentication (Phone)
   ✓ Cloud Firestore
   ✓ Cloud Storage
   ✓ Cloud Functions
   ✓ Real-time Database (Chat)
   ✓ Analytics
   ✓ Hosting
   ```

### 1.2 KYC API Integration

1. **Choose KYC Provider**: Sandbox / Surepass / Perfios
2. **Sandbox Setup** (recommended for India):
   - Visit: https://www.sandbox.co.in/
   - Sign up for Business Account
   - Generate API Key
   - Add to `.env`: `KYC_API_KEY=your_key_here`
3. **Test KYC APIs**:
   ```bash
   curl -X POST https://api.sandbox.co.in/aadhaar/verify \
     -H "Authorization: Bearer YOUR_KEY" \
     -d '{"aadhaar_number": "123456789012"}'
   ```

### 1.3 Google Maps & Location Setup

1. **Enable APIs in Google Cloud Console**:
   - Google Maps API
   - Geolocation API
   - Places API
2. **Generate API Key**:
   ```
   Restrictions: Android + iOS
   Set SHA-1 fingerprints for Android signing key
   ```
3. **Add to Firebase Config**

---

## Phase 2: Backend Development (Week 2-4)

### 2.1 Deploy Firebase Security Rules

```bash
cd firebase/
firebase login
firebase init
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 2.2 Deploy Cloud Functions

```bash
cd firebase/cloud-functions/
npm install
firebase deploy --only functions:verifyAadhaar,functions:verifyPAN,functions:matchJobToBais,functions:recommendSalary
```

### 2.3 Create Firestore Collections

Manually create these collections in Firebase Console:
- `users` (Phone → User mapping)
- `bai_profiles` (Bai worker profiles)
- `jobs` (Job postings)
- `messages` (Chat messages)
- `ratings` (Reviews)
- `reports` (Dispute tracking)

### 2.4 Create Storage Buckets

```
kaam-wali-hain.appspot.com/
├── kyc-documents/  (Aadhaar, PAN proofs)
├── user-photos/    (Profile pictures)
├── id-verification/ (ID documents)
└── job-images/     (Job-related images)
```

---

## Phase 3: Flutter App Development (Week 3-6)

### 3.1 Clone & Setup Flutter Project

```bash
git clone https://github.com/yourusername/kaam-wali-hain.git
cd flutter-app

# Install dependencies
flutter pub get

# Generate code (for models, serializers, etc.)
flutter pub run build_runner build
```

### 3.2 Configure Android Build

**android/app/build.gradle**:
```gradle
android {
    compileSdkVersion 34
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}

dependencies {
    implementation 'com.google.firebase:firebase-core'
    implementation 'com.google.android.gms:play-services-location'
}
```

### 3.3 Configure iOS Build

**ios/Podfile**:
```ruby
pod 'Firebase/Core'
pod 'Firebase/Auth'
pod 'Firebase/Firestore'
pod 'GoogleMaps'

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)', 'PERMISSION_LOCATION=1']
    end
  end
end
```

### 3.4 Create Firebase Config Files

**Android**: `android/app/google-services.json`
**iOS**: `ios/Runner/GoogleService-Info.plist`

(Download from Firebase Console)

### 3.5 Key App Features to Implement

**Authentication Module**:
```dart
// lib/services/auth_service.dart
- Phone OTP login
- Firebase Auth integration
- Auto-refresh tokens
- Logout
```

**Bai Onboarding**:
```dart
// lib/screens/bai/bai_onboarding.dart
Step 1: Personal Details (Name, Gender, Photo)
Step 2: Service Selection (Cleaning, Cooking, Baby Care, Elder Care)
Step 3: KYC (Aadhaar + PAN verification)
Step 4: Review & Publish Profile
```

**Client Job Posting**:
```dart
// lib/screens/client/job_posting.dart
- Select service type
- Set hours/days/salary
- Location on map
- Confirm booking
```

**Search & Matching**:
```dart
// lib/services/job_matching_service.dart
- Get location
- Call matchJobToBais() Cloud Function
- Display top 5 matches
- Filter by rating, salary, language
```

**Chat System**:
```dart
// lib/services/chat_service.dart
- Real-time message sync
- Firestore listener
- Message timestamps
- Read receipts
```

---

## Phase 4: Testing & QA (Week 5-7)

### 4.1 Android Testing

```bash
# Build debug APK
flutter build apk --debug

# Run on physical device
adb install -r build/app/outputs/flutter-apk/app-debug.apk

# Run automated tests
flutter test
```

### 4.2 iOS Testing

```bash
# Build for iOS
flutter build ios --debug

# Run on simulator
flutter run -d "iPhone 14"

# Build for real device
flutter build ipa
```

### 4.3 Test Scenarios

**Bai User Flow**:
- [ ] Sign up with phone OTP
- [ ] Complete KYC (Aadhaar + PAN)
- [ ] Upload profile photo
- [ ] Select services & areas
- [ ] Go online, receive job notifications
- [ ] Accept/reject jobs
- [ ] Complete job, get rated

**Client User Flow**:
- [ ] Sign up with phone OTP
- [ ] Post a job
- [ ] View matched Bais (by AI)
- [ ] Chat with Bai
- [ ] Confirm booking
- [ ] Rate after completion

### 4.4 Critical Bug Testing

- [ ] KYC verification errors
- [ ] Location accuracy (GPS)
- [ ] Real-time chat sync (Firestore)
- [ ] Payment failures (Phase 2)
- [ ] Offline data caching
- [ ] Notification delivery

---

## Phase 5: Play Store & App Store Submission (Week 7-8)

### 5.1 Google Play Store

**Prepare**:
1. Create signing key:
```bash
keytool -genkey -v -keystore ~/kaam-wali-hain-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

2. Configure signing in `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        keyAlias 'upload'
        keyPassword 'YOUR_KEY_PASSWORD'
        storeFile file('YOUR_KEYSTORE_PATH')
        storePassword 'YOUR_STORE_PASSWORD'
    }
}
```

3. Build release APK/Bundle:
```bash
flutter build appbundle
```

**Submit**:
1. Go to: https://play.google.com/console/
2. Create new app
3. Fill app details (descriptions, screenshots, privacy policy)
4. Upload bundle
5. Set pricing & distribution
6. Submit for review (~48 hours)

### 5.2 Apple App Store

**Prepare**:
1. Create Apple Developer Account ($99/year)
2. Generate certificates in Xcode
3. Update bundle ID: `com.yourdomain.kaamwalihain`
4. Build release IPA:
```bash
flutter build ipa --release
```

**Submit**:
1. Go to: https://appstoreconnect.apple.com/
2. Create app record
3. Add app details, screenshots, privacy policy
4. Upload IPA via Transporter
5. Submit for review (~24-48 hours)

---

## Phase 6: Launch & Marketing (Week 8-9)

### 6.1 Pre-Launch Checklist

- [ ] Terms of Service linked in app
- [ ] Privacy Policy accessible
- [ ] Liability Disclaimer mandatory on signup
- [ ] Analytics tracking enabled
- [ ] Crash reporting (Crashlytics) active
- [ ] Push notifications tested
- [ ] Offline mode working

### 6.2 Beta Launch (Mumbai)

1. **Internal Beta**: Friends & family (100 users)
2. **Closed Beta**: Google Play beta testing (1,000 users)
3. **Open Beta**: Full release to Play Store/App Store

### 6.3 Go-Live Day

```
✓ Monitor Firebase Dashboard
✓ Check error logs in Crashlytics
✓ Monitor Firestore usage
✓ Prepare customer support team
✓ Send launch announcement (WhatsApp, Instagram)
✓ Activate referral program (if any)
```

---

## Maintenance & Scaling (Post-Launch)

### Weekly Tasks
- [ ] Review crash reports
- [ ] Monitor KYC approval rate
- [ ] Check customer support tickets
- [ ] Analyze user engagement metrics

### Monthly Tasks
- [ ] Update prices/service offerings
- [ ] Release bug fixes & minor features
- [ ] Survey users for feedback
- [ ] Review fraud reports

### Quarterly Tasks
- [ ] Major feature releases
- [ ] Scale infrastructure (Firestore indices, Cloud Functions memory)
- [ ] Security audit
- [ ] Legal compliance review

---

## Cost Estimation

| Service | Monthly Cost (at launch) |
|---------|-------------------------|
| Firebase (Firestore) | $25-100 |
| Firebase (Functions) | $0-50 |
| Firebase (Storage) | $5-30 |
| Cloud Run (Admin API) | $0-50 |
| KYC API (Sandbox) | $100-500 |
| Google Maps | $50-200 |
| Total | **$180-930/month** |

*Costs scale with user base and transaction volume*

---

## Support & Troubleshooting

- **Firebase Console**: https://console.firebase.google.com
- **Flutter Docs**: https://flutter.dev/docs
- **GitHub Issues**: https://github.com/yourusername/kaam-wali-hain/issues
- **Community**: Flutter Discord, Reddit r/flutter

---

**Status**: Ready for Development ✓
**Last Updated**: January 2026
**Maintainer**: Your Team
