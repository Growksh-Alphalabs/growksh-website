# Admin Flow Architecture

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│               USER TRIES TO ACCESS /admin               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  Is user authenticated?         │
        │  (isAuthenticated = true?)      │
        └────────┬────────────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
      NO                  YES
        │                  │
        ▼                  ▼
    Redirect to      ┌──────────────────┐
    /admin/login     │ Is user admin?   │
                     │ (isAdmin = true?)│
                     └────┬──────────┬──┘
                          │          │
                        NO           YES
                          │          │
                          ▼          ▼
                     Access Denied  Dashboard
```

## Admin Login Flow

```
1. User visits /admin/login
   └─ Displays email form

2. User submits email
   └─ Email: admin@growksh.com

3. Frontend calls initiateAuth(email)
   ├─ Method: CUSTOM_AUTH (OTP flow)
   ├─ Same as regular user login
   └─ Cognito CreateAuthChallenge trigger fires

4. Cognito generates OTP
   ├─ Lambda CreateAuthChallenge creates 6-digit code
   ├─ Stores in DynamoDB with 10-min TTL
   └─ Sends via SES email

5. Frontend receives OTP
   └─ User enters 6-digit code from email

6. Frontend calls verifyOTP(email, otp, session)
   ├─ Method: CUSTOM_AUTH (OTP verification)
   ├─ Lambda VerifyAuthChallenge validates code
   └─ Returns ID Token (with cognito:groups if admin)

7. Frontend receives tokens
   ├─ ID Token: { "cognito:groups": ["admin"], ... }
   ├─ Access Token: JWT for API calls
   └─ Refresh Token: For token renewal

8. Frontend stores tokens
   ├─ localStorage.setItem('idToken', IdToken)
   ├─ localStorage.setItem('accessToken', AccessToken)
   └─ localStorage.setItem('userEmail', email)

9. AuthContext.checkAuth() runs
   ├─ Reads ID token from localStorage
   ├─ Decodes JWT payload
   ├─ Checks cognito:groups array
   ├─ Sets isAdmin = true (if "admin" found)
   └─ Sets isAuthenticated = true

10. ProtectedRoute checks permissions
    ├─ Verifies: isAuthenticated = true AND isAdmin = true
    ├─ Both true: Show AdminDashboard ✓
    └─ Not admin: Show "Access Denied" ✗
```

## Token Inspection

```
ID Token Structure:
{
  "sub": "cognito-sub-id-xxx",
  "email_verified": true,
  "email": "admin@growksh.com",
  "cognito:groups": ["admin"],          ← Admin role here
  "cognito:username": "admin@growksh.com",
  "aud": "client-id-xxx",
  "token_use": "id",
  "iat": 1702900000,
  "exp": 1702910000
}

Extraction:
1. Get idToken from localStorage
2. Split by '.' → header.payload.signature
3. Take middle part (payload)
4. Base64 decode
5. JSON parse
6. Check payload['cognito:groups'].includes('admin')
```

## User Types & Access

```
┌──────────────────┬─────────────┬──────────────┬───────────────┐
│ User Type        │ Auth Route  │ Auth Method  │ Admin Access  │
├──────────────────┼─────────────┼──────────────┼───────────────┤
│ Regular User     │ /login      │ OTP (EMAIL)  │ BLOCKED ❌    │
│ Admin User       │ /admin/login│ PASSWORD     │ ALLOWED ✅    │
│ Not Logged In    │ /admin/login│ N/A          │ BLOCKED ❌    │
│ Logged In (wrong │ /admin      │ Already has  │ BLOCKED ❌    │
│ creds earlier)   │ /dashboard  │ token        │ (Access Denied)
└──────────────────┴─────────────┴──────────────┴───────────────┘
```

## Security Layers

```
Layer 1: Route Protection (Frontend)
├─ If not authenticated → redirect to /admin/login
└─ If not admin → show "Access Denied"

Layer 2: Token Validation (Frontend)
├─ Decode and check cognito:groups
└─ Set isAdmin state

Layer 3: Token Integrity (Cognito)
├─ Token signed by Cognito private key
├─ Frontend validates signature using public key
└─ Cannot be forged by client

Layer 4: Role Enforcement (Cognito)
├─ Groups managed server-side
├─ User can only be in groups assigned by admin
└─ Cannot self-assign admin role

Layer 5: OTP Security (DynamoDB + SES)
├─ OTP stored with 10-minute TTL (auto-delete)
├─ One-time use only (deleted after verification)
├─ Sent via email (not stored in app)
└─ Cannot be reused or brute-forced easily
```

## State Management

```
Before Login:
{
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  isLoading: true
}
        ↓
User enters credentials
        ↓
After Admin Login Success:
{
  isAuthenticated: true,
  isAdmin: true,
  user: {
    email: "admin@growksh.com",
    name: "Admin Name",
    email_verified: "true"
  },
  isLoading: false
}
        ↓
ProtectedRoute allows access
        ↓
AdminDashboard renders
```

## URL Routing

```
/                    → Home (public)
/login               → Regular OTP login (public)
/auth/login          → Regular OTP login (public)
/auth/signup         → Signup (public)
/about               → About page (public)
/wealthcraft         → Product page (public)
/alphalabs           → Product page (public)
/ventures            → Product page (public)
/insights            → Resources (public)
/contact             → Contact form (public)

/admin/login         → Admin OTP login (public, but redirects if authed)
/admin/dashboard     → Admin panel (PROTECTED - requires isAuthenticated && isAdmin)
```

## Key Differences: Regular vs Admin

```
REGULAR USER LOGIN                 ADMIN LOGIN
────────────────────────────────   ────────────────────
Route: /login                      Route: /admin/login
Flow: OTP (email-based)            Flow: OTP (email-based)
Auth: CUSTOM_AUTH                  Auth: CUSTOM_AUTH
Duration: 60 min (default)         Duration: 60 min (default)
Role: User (default)               Role: Admin (in cognito:groups)
Dashboard: None                    Dashboard: /admin/dashboard
Logout: Regular                    Logout: Regular

✨ Both use PASSWORDLESS OTP verification!
   The only difference is the admin user must be
   in Cognito "admin" group to access admin panel.
```
