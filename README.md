# 🇮🇳 Kaam Wali Hain? - AI-Powered Domestic Worker Marketplace

**World's Best AI-Powered Broker Marketplace App** connecting verified domestic workers (Bais) with households across Mumbai.

## 🚀 Features (MVP)

### For Bais (Workers)
- ✅ Phone OTP Registration (Firebase Auth)
- ✅ Aadhaar + PAN KYC Verification (Integrated API)
- ✅ Profile Creation (Multi-step wizard)
- ✅ Service Listing (Cleaning, Cooking, Baby Care, Elderly Care)
- ✅ Job Acceptance/Rejection
- ✅ Real-time Chat & Messaging
- ✅ Rating & Reviews
- ✅ Wallet & Payment Tracking

### For Clients (Households)
- ✅ Location-Based Bai Search (Google Maps Integration)
- ✅ Filter by Service Type, Hours, Salary Range
- ✅ Verified Badge Display (Aadhaar, PAN, Phone)
- ✅ Job Posting & Booking
- ✅ In-App Chat & Direct Call
- ✅ Rating & Review System
- ✅ Payment Integration (Phase 2)

### AI & Smart Features
- ✅ AI-Powered Job-to-Bai Matching
- ✅ Smart Salary Recommendations
- ✅ Fraud Risk Scoring
- ✅ Demand Prediction for Bais
- ✅ Smart Scheduling Suggestions

### Admin Panel
- ✅ KYC Verification Dashboard
- ✅ User Management
- ✅ Dispute Resolution
- ✅ Report Analytics

---

## 📱 Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Flutter (FlutterFlow) |
| **Backend** | Firebase (Firestore, Auth, Cloud Functions) |
| **Database** | Firestore NoSQL |
| **Storage** | Firebase Storage (ID Docs, Photos) |
| **Authentication** | Firebase Phone OTP |
| **KYC APIs** | Sandbox / Surepass / Perfios (Aadhaar + PAN) |
| **Maps** | Google Maps SDK |
| **Chat** | Firestore Realtime + WebSocket |
| **Payments** | Razorpay / PhonePe API (Phase 2) |
| **Analytics** | Firebase Analytics + BigQuery |
| **Hosting** | Firebase Hosting (Web) / Google Play + App Store (Mobile) |

---

## 📁 Project Structure

```
kaam-wali-hain/
├── firebase/
│   ├── firestore-rules.json      # Firestore security rules
│   ├── storage-rules.json        # Storage security rules
│   └── cloud-functions/
│       ├── kyc-verification/     # Aadhaar/PAN verification
│       ├── job-matching/         # AI job-bai matching algorithm
│       ├── payment-processing/   # Payment handling
│       └── notifications/        # Push notifications
│
├── flutter-app/
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/
│   │   │   ├── user.dart
│   │   │   ├── bai_profile.dart
│   │   │   ├── job.dart
│   │   │   └── chat.dart
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── login_screen.dart
│   │   │   │   ├── otp_verification.dart
│   │   │   │   └── role_selection.dart
│   │   │   ├── bai/
│   │   │   │   ├── bai_onboarding.dart
│   │   │   │   ├── bai_kyc_screen.dart
│   │   │   │   ├── bai_dashboard.dart
│   │   │   │   ├── job_details.dart
│   │   │   │   └── bai_profile.dart
│   │   │   ├── client/
│   │   │   │   ├── client_home.dart
│   │   │   │   ├── search_bai.dart
│   │   │   │   ├── bai_profile_view.dart
│   │   │   │   ├── job_posting.dart
│   │   │   │   └── client_dashboard.dart
│   │   │   ├── shared/
│   │   │   │   ├── chat_screen.dart
│   │   │   │   ├── terms_screen.dart
│   │   │   │   ├── privacy_screen.dart
│   │   │   │   ├── disclaimer_screen.dart
│   │   │   │   └── splash_screen.dart
│   │   ├── services/
│   │   │   ├── firebase_service.dart
│   │   │   ├── auth_service.dart
│   │   │   ├── kyc_service.dart
│   │   │   ├── location_service.dart
│   │   │   ├── chat_service.dart
│   │   │   └── job_matching_service.dart
│   │   ├── providers/
│   │   │   ├── user_provider.dart
│   │   │   ├── job_provider.dart
│   │   │   └── chat_provider.dart
│   │   ├── widgets/
│   │   │   ├── bai_card.dart
│   │   │   ├── job_card.dart
│   │   │   ├── rating_widget.dart
│   │   │   └── verification_badge.dart
│   │   └── utils/
│   │       ├── constants.dart
│   │       ├── validators.dart
│   │       └── formatters.dart
│   ├── pubspec.yaml
│   ├── ios/
│   └── android/
│
├── web-dashboard/
│   ├── admin-panel/        # Admin KYC verification dashboard
│   ├── analytics/          # Analytics & Reports
│   └── settings/           # Platform settings
│
├── legal/
│   ├── TERMS_OF_SERVICE.md
│   ├── PRIVACY_POLICY.md
│   ├── DISCLAIMER.md
│   ├── CONDUCT_POLICY.md
│   └── KYC_DATA_POLICY.md
│
├── docs/
│   ├── SETUP_GUIDE.md
│   ├── API_INTEGRATION.md
│   ├── KYC_FLOW.md
│   ├── MATCHING_ALGORITHM.md
│   └── DEPLOYMENT.md
│
├── .github/
│   ├── workflows/
│   │   ├── flutter-build.yml
│   │   ├── firebase-deploy.yml
│   │   └── tests.yml
│   └── ISSUE_TEMPLATE/
│
├── README.md
└── LICENSE
```

---

## 🔐 Legal & Compliance

**CRITICAL DISCLAIMER**: The platform is a broker/facilitator ONLY. We are NOT liable for:
- Quality of worker performance
- Theft, damage, or loss of property
- Physical harm or injury
- Any disputes between parties
- Worker reliability or conduct

**All users must accept:**
- Terms of Service
- Privacy Policy
- Liability Disclaimer
- Conduct Policy
- KYC Data Handling Agreement

---

## 🔑 Firebase Data Models (Firestore)

### `users` Collection
```json
{
  "uid": "firebase_auth_id",
  "role": "bai" | "client" | "admin",
  "phone": "+91XXXXXXXXXX",
  "full_name": "Lakshmi Sharma",
  "gender": "Female",
  "city": "Mumbai",
  "area": "Bandra",
  "profile_photo_url": "https://storage.googleapis.com/...",
  "created_at": 1704067200000,
  "last_login_at": 1704067200000,
  "terms_accepted": true,
  "disclaimer_accepted": true,
  "kyc_status": "verified" | "pending" | "rejected"
}
```

### `bai_profiles` Collection
```json
{
  "user_id": "uid",
  "services": ["cleaning", "cooking", "baby_care"],
  "experience_years": 8,
  "min_salary": 15000,
  "availability": "part_time" | "full_time" | "live_in",
  "languages": ["Hindi", "Marathi", "English"],
  "aadhaar_number_masked": "****-****-1234",
  "aadhaar_verified": true,
  "pan_number_masked": "****-****-XYZ1",
  "pan_verified": true,
  "kyc_provider": "Sandbox",
  "rating": 4.8,
  "completed_jobs": 45,
  "is_online": false,
  "updated_at": 1704067200000
}
```

### `jobs` Collection
```json
{
  "job_id": "job_uuid",
  "client_id": "uid",
  "bai_id": "uid",
  "service_type": "cleaning",
  "hours_per_day": 4,
  "days_per_week": 5,
  "salary_offer": 18000,
  "address_short": "Bandra, Mumbai",
  "lat": 19.0596,
  "lng": 72.8295,
  "status": "open" | "matched" | "in_progress" | "completed",
  "created_at": 1704067200000,
  "start_date": 1704153600000
}
```

### `messages` Collection
```json
{
  "room_id": "uid1_uid2",
  "sender_id": "uid",
  "receiver_id": "uid",
  "message": "Hi! Interested in the job?",
  "timestamp": 1704067200000,
  "is_read": false
}
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Flutter SDK (latest)
- Firebase Account (create at firebase.google.com)
- Google Cloud Project
- KYC API Keys (Sandbox/Surepass)

### 1. Clone Repository
```bash
git clone https://github.com/shettysaaai/kaam-wali-hain.git
cd kaam-wali-hain
```

### 2. Firebase Setup
```bash
firebase init
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 3. Flutter Setup
```bash
cd flutter-app
flutter pub get
flutter run
```

### 4. Environment Variables
Create `.env` file:
```
FIREBASE_PROJECT_ID=your_project_id
KYC_API_KEY=your_kyc_api_key
GOOGLE_MAPS_API_KEY=your_maps_key
RAZORPAY_KEY=your_razorpay_key (Phase 2)
```

---

## 📊 KYC Integration Flow

1. **Bai enters Aadhaar number** → App calls KYC API (Sandbox)
2. **API validates Aadhaar** → Returns name, status, linked phone
3. **App asks for PAN** → Validates via PAN API
4. **Bai uploads ID photo** → Stored in Firebase Storage
5. **Admin reviews manually** → Marks as verified
6. **Profile goes live** → Appears in search results

---

## 🎯 AI Matching Algorithm

**Scoring Formula:**
```
Match Score = (0.4 * Distance) + (0.25 * Rating) + (0.2 * Salary Fit) + (0.15 * Language Match)

Top 3-5 matches shown to client
```

---

## 📱 Supported Platforms
- ✅ Android 8.0+
- ✅ iOS 12.0+
- ✅ Web (Admin Dashboard)

---

## 📞 Contact & Support
- Email: support@kaamwalihain.in
- WhatsApp: +91 XXXXXXXXXX
- Website: www.kaamwalihain.in

---

## 📄 License
Proprietary License - See LICENSE file

---

## 🤝 Contributing
Not accepting external contributions at this time. Internal team only.

---

**Made with 💻 + 🇮🇳 in Mumbai** | "Kaam Wali Hain?" - *Is there a Bai for my work?*
