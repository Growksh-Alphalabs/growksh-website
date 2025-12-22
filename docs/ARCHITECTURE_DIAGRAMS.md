# Architecture Diagrams - Passwordless Authentication

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Browser - React Components & State Management               │   │
│  │                                                              │   │
│  │  /signup          /login           /auth/verify-email       │   │
│  │  ┌──────────┐     ┌──────────┐     ┌──────────────────┐    │   │
│  │  │ Register │     │ Email    │     │ Email            │    │   │
│  │  │ Form     │─┐   │ OTP      │─┐   │ Verification     │    │   │
│  │  └──────────┘ │   │ Page     │ │   │ Handler          │    │   │
│  │               │   └──────────┘ │   └──────────────────┘    │   │
│  │  AuthContext.jsx  useAuth() hook            │               │   │
│  │  (Global State)     │         │             │               │   │
│  │         ▲           │         │             │               │   │
│  │         │           ▼         ▼             ▼               │   │
│  │         └─────── cognito.js (Auth Lib) ────┘               │   │
│  │                    │                                        │   │
│  └────────────────────┼────────────────────────────────────────┘   │
│                       │                                              │
│                       │ HTTPS Requests                              │
│                       │                                              │
└───────────────────────┼──────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    ┌───▼────┐    ┌─────▼────┐    ┌───▼────┐
    │ Lambda │    │  Cognito │    │ API    │
    │Signup  │    │ UserPool │    │Gateway │
    │Func    │    │          │    │(REST)  │
    └────────┘    └──────────┘    └────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                        │
┌───────────────────────┼───────────────────────────────────┐
│                  AWS SERVICES (Backend)                   │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │        AWS COGNITO USER POOL                       │  │
│  │                                                    │  │
│  │  [User Store]  [Auth Management]  [Tokens]        │  │
│  │                                                    │  │
│  │  Lambda Triggers:                                 │  │
│  │  1. PreSignUp      → auto-confirm users          │  │
│  │  2. CustomMessage  → send verification email     │  │
│  │  3. CreateChallenge → generate & send OTP        │  │
│  │  4. VerifyChallenge → validate OTP               │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│         ▲                        ▲                        │
│         │                        │                        │
│  ┌──────┴──────┐        ┌────────┴─────┐                │
│  │  DynamoDB   │        │   SES        │                │
│  │  (OTP Table)│        │(Email Sender)│                │
│  │             │        │              │                │
│  │ • email(PK) │        │ Sends:       │                │
│  │ • otp       │        │ • Verification link          │
│  │ • ttl       │        │ • OTP codes                  │
│  │ • createdAt │        │              │                │
│  │             │        │              │                │
│  │ TTL: 10min  │        │              │                │
│  │ (Auto-del)  │        │              │                │
│  └─────────────┘        └──────────────┘                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Signup Flow Sequence Diagram

```
User                 Frontend             API Gateway         Lambda           Cognito        DynamoDB    SES
 │                     │                     │                 │               │               │           │
 ├─ Fill form ────────>│                     │                 │               │               │           │
 │                     │                     │                 │               │               │           │
 │                     ├─ POST /auth/signup─>│                 │               │               │           │
 │                     │                     │                 │               │               │           │
 │                     │                     ├─ signup.js ────>│               │               │           │
 │                     │                     │                 │               │               │           │
 │                     │                     │                 ├─ Create user─>│               │           │
 │                     │                     │                 │               │               │           │
 │                     │                     │                 │<─ UserCreated─┤               │           │
 │                     │                     │                 │               │               │           │
 │                     │                     │                 ├─ Signal: PreSignUp trigger   │           │
 │                     │                     │                 │               │               │           │
 │                     │                     │                 │           [pre-sign-up.js]  │           │
 │                     │                     │                 │               │               │           │
 │                     │                     │                 │       Auto-confirm user     │           │
 │                     │                     │                 │               │               │           │
 │                     │                     │                 ├─ Signal: CustomMessage trigger           │
 │                     │                     │                 │               │               │           │
 │                     │                     │                 │        [custom-message.js] │           │
 │                     │                     │                 │               │               │           │
 │                     │                     │                 │         Generate link       │           │
 │                     │                     │                 │         with HMAC           │           │
 │                     │                     │                 │               │               │           │
 │                     │                     │                 │                            ├──send────>│
 │                     │                     │                 │                            │    email  │
 │                     │                     │                 │                            │<──sent───┤
 │                     │<─ Success response──┤<─ response ────┤                            │           │
 │                     │                     │                 │                            │           │
 │<─ Show message ────┤                     │                 │                            │           │
 │                     │                     │                 │                            │           │
 ├─ Check email ──────────────────────────────────────────────────────────────────────────────────────>│
 │                                                                                                       │
 │<──── Verification link received ────────────────────────────────────────────────────────────────────┤
 │
 └─ Click link ────────────────────────────────────────────────────────────────────────────────────────>
                                                                              (Continues in Verify Email)
```

---

## 3. Email Verification Flow Sequence Diagram

```
User          Browser         Frontend        API Gateway      Lambda              HMAC Secret
 │              │                │                │              │                    │
 │─ Click link──────────────────>│                │              │                    │
 │                                │                │              │                    │
 │                                ├─ GET /verify-email (email=...&token=...&t=...)   │
 │                                │                │              │                    │
 │                                │                ├─ verify-email.js                 │
 │                                │                │              │                    │
 │                                │                │              ├─ Verify HMAC────>│
 │                                │                │              │<──Valid or Invalid
 │                                │                │              │                    │
 │                                │                │              ├─ Check timestamp
 │                                │                │              │  (< 24 hours)
 │                                │                │              │                    │
 │                                │                │<─ response ──│                    │
 │                                │<─ redirect ────┤                                  │
 │                                │                                                   │
 │<─ Redirect to /login ─────────┤                                                   │
 │
 └─ Email verified! Proceed to login ────────────────────────────────────────────────>
```

---

## 4. Login/OTP Flow Sequence Diagram

```
User          Frontend        Cognito     CreateAuth        DynamoDB     SES        User
                              UserPool      Lambda            (OTP)
 │               │               │             │                │          │         │
 ├ Enter email──>│               │             │                │          │         │
 │               │               │             │                │          │         │
 │               ├─ initiateAuth()            │                │          │         │
 │               │ (CUSTOM_AUTH)─>│           │                │          │         │
 │               │               │             │                │          │         │
 │               │               ├─────────────>│                │          │         │
 │               │               │             │ Generate OTP   │          │         │
 │               │               │             ├─ 6 digits     │          │         │
 │               │               │             │                │          │         │
 │               │               │             ├─ Store in DB──>│          │         │
 │               │               │             │ (TTL=10min)   │          │         │
 │               │               │             │<────ack───────┤          │         │
 │               │               │             │                │          │         │
 │               │               │             ├─ Send OTP────────────────>│         │
 │               │               │             │                │          │         │
 │               │               │             │                │          ├────────>│
 │               │               │             │                │          │  Email  │
 │               │               │             │<────────────────────────────sent───│
 │               │               │             │                │          │         │
 │               │<─ Challenge ──┤             │                │          │         │
 │               │  (Session)    │             │                │          │         │
 │               │<──────────────┤             │                │          │         │
 │               │               │             │                │          │         │
 │<─ "OTP sent to email" ───────│             │                │          │         │
 │               │               │             │                │          │         │
 │  Check email & get OTP ──────────────────────────────────────────────────────────>
 │               │               │             │                │          │         │
 │<──── OTP received ────────────────────────────────────────────────────────────────│
 │               │               │             │                │          │         │
 ├─ Enter OTP──>│               │             │                │          │         │
 │               │               │             │                │          │         │
 │               ├─ verifyOTP()  │             │                │          │         │
 │               │─────────────>│ respondToChallenge()          │          │         │
 │               │               │─────────────>│                │          │         │
 │               │               │             │ Compare OTP    │          │         │
 │               │               │             ├─ vs DynamoDB──>│          │         │
 │               │               │             │<────result─────┤          │         │
 │               │               │             │                │          │         │
 │               │               │             ├─ Delete OTP ──>│          │         │
 │               │               │             │    (cleanup)   │          │         │
 │               │               │             │<────ack───────┤          │         │
 │               │               │             │                │          │         │
 │               │               │<─ Tokens ────│                │          │         │
 │               │               │ (IdToken,   │                │          │         │
 │               │               │  AccessToken)                │          │         │
 │               │<────────────────            │                │          │         │
 │               │                │             │                │          │         │
 │               ├─ Save tokens to localStorage               │          │         │
 │               │                │             │                │          │         │
 │<─ "Logged in!"────────────────│             │                │          │         │
 │               │                │             │                │          │         │
 │               └─ Redirect to home page
 │
 └─ Authenticated user! ─────────────────────────────────────────────────────────────>
```

---

## 5. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SIGNUP REGISTRATION                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

User Input                    API Request                   AWS Services
   │                             │                             │
   ├─ Name                       │                             │
   ├─ Email         ───────>  POST /auth/signup ──────>  Lambda signup()
   └─ Phone                      │                             │
                                 │                        Cognito.createUser()
                                 │                             │
                                 │                        DynamoDB
                                 │                      (Future login)
                                 │                             │
                                 │                        SES sendEmail()
                                 │                             │
                                 │                        User's Inbox
                                 │<──── Response ────────  {success, userSub}
                                 │
                          Frontend receives
                          success message

┌─────────────────────────────────────────────────────────────────────────────────┐
│                        EMAIL VERIFICATION                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

Email Link                    API Request                   AWS Services
   │                             │                             │
   └─ Click link ────────>  GET /auth/verify-email ──>  Lambda verify-email()
                            params: email, token, t           │
                                 │                        HMAC verification
                                 │                             │
                                 │                        Timestamp check
                                 │                             │
                                 │<──── Redirect ───────  /login?email=...
                                 │
                          Browser redirects
                          Pre-filled email

┌─────────────────────────────────────────────────────────────────────────────────┐
│                          LOGIN with OTP                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

User Input                    API Request                   AWS Services
   │                             │                             │
   ├─ Email         ───────>  initiateAuth() ───────>  Cognito.CUSTOM_AUTH
                                 │                             │
                                 │                        CreateAuthChallenge
                                 │                        Lambda trigger
                                 │                             │
                                 │                        Generate OTP
                                 │                             │
                                 │                        Store in DynamoDB
                                 │                             │
                                 │                        Send via SES
                                 │                             │
                                 │<──── Session ─────────  Cognito response
                                 │
User Input                    API Request
   │                             │
   ├─ OTP          ───────>  verifyOTP() ────────>  Cognito.respondToChallenge()
                                 │                             │
                                 │                        VerifyAuthChallenge
                                 │                        Lambda trigger
                                 │                             │
                                 │                        Validate vs DynamoDB
                                 │                             │
                                 │                        Delete OTP
                                 │                             │
                                 │<──── Tokens ───────────  {IdToken, AccessToken}
                                 │
                          Frontend saves tokens
                          to localStorage
```

---

## 6. Token Management Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     TOKEN LIFECYCLE                              │
└──────────────────────────────────────────────────────────────────┘

1. TOKEN ACQUISITION (After successful login)
   ┌────────────────────────────┐
   │ Cognito                    │
   │                            │
   │ ID Token ────────────────>│ Claims: user identity, email, name
   │ Access Token ────────────>│ Claims: app access, permissions
   │ Refresh Token ───────────>│ Claims: get new tokens
   │                            │
   └────────────────────────────┘
           │
           │ Frontend receives
           ▼
   ┌────────────────────────────┐
   │ localStorage               │
   │                            │
   │ idToken: "eyJ..."          │
   │ accessToken: "eyJ..."      │
   │ refreshToken: "eyJ..."     │
   │ userEmail: "user@..."      │
   │                            │
   └────────────────────────────┘

2. API AUTHENTICATION (Use tokens for requests)
   ┌────────────────────────────┐         ┌────────────────────┐
   │ Frontend API Call          │         │ Backend API        │
   │                            │         │                    │
   │ fetch('/api/endpoint', {   │         │ Verify token       │
   │   headers: {               │────────>│ Extract claims     │
   │     Authorization:         │         │ Validate signature │
   │     "Bearer " + idToken    │         │                    │
   │   }                        │         │ Return data        │
   │ })                         │<────────│                    │
   │                            │         │                    │
   └────────────────────────────┘         └────────────────────┘

3. TOKEN REFRESH (When token expires)
   ┌────────────────────────────┐
   │ Token Expired?             │
   │                            │
   │ if (exp < now) {           │
   │   Call refreshTokens()     │
   │ }                          │
   └────────────────────────────┘
           │
           ▼
   ┌────────────────────────────────────┐
   │ Cognito                            │
   │                                    │
   │ Input: refreshToken                │
   │ Process: Validate refresh token    │
   │ Output: New idToken, accessToken   │
   │                                    │
   └────────────────────────────────────┘
           │
           │ New tokens
           ▼
   ┌────────────────────────────┐
   │ Update localStorage        │
   │                            │
   │ idToken: "eyJ..." (new)    │
   │ accessToken: "eyJ..." (new)│
   │                            │
   └────────────────────────────┘

4. LOGOUT (Cleanup)
   ┌────────────────────────────┐
   │ signOut()                  │
   │                            │
   │ Remove from localStorage:  │
   │ ✗ idToken                  │
   │ ✗ accessToken              │
   │ ✗ refreshToken             │
   │ ✗ userEmail                │
   │                            │
   └────────────────────────────┘
           │
           ▼
   ┌────────────────────────────┐
   │ State Updated              │
   │                            │
   │ isAuthenticated = false    │
   │ user = null                │
   │                            │
   └────────────────────────────┘
           │
           ▼
   Redirect to /login
```

---

## 7. Lambda Invocation Trigger Chain

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SIGNUP TRIGGER CHAIN                              │
└──────────────────────────────────────────────────────────────────────┘

1. User submits signup form
         │
         ▼
2. Frontend: signup() ─────────────────> API Gateway POST /auth/signup
         │
         ▼
3. Lambda: signup.js
   ├─ Validate input
   ├─ Create user in Cognito
   └─ Trigger PreSignUp hook
         │
         ▼
4. Cognito: PreSignUp Trigger
   └─> Lambda: pre-sign-up.js
       └─ Auto-confirm user
       └─ Auto-verify email
       └─ (Fires CustomMessage next)
         │
         ▼
5. Cognito: CustomMessage Trigger
   └─> Lambda: custom-message.js
       ├─ Generate HMAC token
       ├─ Create verification URL
       └─ Send email via SES
         │
         ▼
6. Response returned to frontend
   └─ Frontend shows success message

┌──────────────────────────────────────────────────────────────────────┐
│                     LOGIN TRIGGER CHAIN                              │
└──────────────────────────────────────────────────────────────────────┘

1. User submits email
         │
         ▼
2. Frontend: initiateAuth(email) ──> Cognito: CUSTOM_AUTH flow
         │
         ▼
3. Cognito: CreateAuthChallenge Trigger
   └─> Lambda: create-auth-challenge.js
       ├─ Generate 6-digit OTP
       ├─ Store in DynamoDB
       └─ Send OTP via SES
         │
         ▼
4. Response: Session token to frontend
         │
         ▼
5. User receives OTP email
         │
         ▼
6. User enters OTP
         │
         ▼
7. Frontend: verifyOTP() ──> Cognito: respondToAuthChallenge()
         │
         ▼
8. Cognito: VerifyAuthChallengeResponse Trigger
   └─> Lambda: verify-auth-challenge.js
       ├─ Get expected OTP from params
       ├─ Compare with user input
       ├─ Delete OTP from DynamoDB
       └─ Return success/failure
         │
         ▼
9. Response: Auth tokens or error
         │
         ▼
10. If success: Save tokens to localStorage
    If failure: Show error message
```

---

## 8. Database Tables Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                      COGNITO USER POOL                              │
│                                                                     │
│  User: john@example.com                                            │
│  ├─ Username: john@example.com (email attribute)                   │
│  ├─ Email: john@example.com                                        │
│  ├─ Email Verified: true                                           │
│  ├─ Name: John Doe                                                 │
│  ├─ Phone: +1234567890                                             │
│  ├─ Sub: uuid-xxxx (Cognito user ID)                              │
│  └─ Created: 2024-12-22T10:00:00Z                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
           │
           │ References
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DYNAMODB: auth-otp TABLE                         │
│                                                                     │
│  Partition Key: email                                               │
│                                                                     │
│  Item:                                                              │
│  {                                                                  │
│    "email": "john@example.com",                                    │
│    "otp": "123456",                                                │
│    "ttl": 1703252100,          ← Auto-delete at this timestamp     │
│    "createdAt": "2024-12-22T10:05:00Z"                            │
│  }                                                                  │
│                                                                     │
│  [OTP automatically deleted after 10 minutes]                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
           │
           │ Source of truth
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DYNAMODB: contacts TABLE                         │
│                                                                     │
│  [For contact form submissions - separate from auth]               │
│                                                                     │
│  Item:                                                              │
│  {                                                                  │
│    "id": "abc123def456",                                           │
│    "name": "John Doe",                                             │
│    "email": "john@example.com",                                    │
│    "phone": "+1234567890",                                         │
│    "interest": "Services",                                         │
│    "message": "I'm interested in...",                              │
│    "timestamp": "2024-12-22T10:00:00Z"                            │
│  }                                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

**Visual Architecture Reference**
- Print these diagrams for team reference
- Share with stakeholders for architecture review
- Update when making significant changes
- Keep in documentation wiki

**Last Updated**: December 22, 2025
