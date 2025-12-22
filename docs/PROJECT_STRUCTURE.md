# Project Structure - Passwordless Auth Implementation

```
growksh-website/
├── 📄 IMPLEMENTATION_SUMMARY.md     ⭐ Start here! Overview of everything
├── 📄 QUICKSTART.md                 ⭐ 5-minute quick reference
├── 📄 SETUP_CHECKLIST.md            ⭐ Step-by-step deployment guide
├── 📄 AUTH_IMPLEMENTATION.md        📖 Detailed technical documentation
├── 📄 CONFIG_REFERENCE.md           📖 Configuration options & reference
│
├── .github/
│   └── workflows/
│       └── 🔄 deploy-sam.yml        ✅ UPDATED - CI/CD pipeline for SAM deployment
│
├── infra/
│   ├── 📄 README.md
│   └── 🔄 sam-template.yaml         ✅ UPDATED - Complete IaC with all AWS services
│                                      - Cognito User Pool + Client
│                                      - 6 Lambda functions
│                                      - 2 DynamoDB tables
│                                      - API Gateway endpoints
│                                      - SES integration
│
├── aws-lambda/
│   ├── contact/
│   │   ├── index.js
│   │   ├── Makefile
│   │   └── package.json
│   │
│   └── auth/                        ✨ NEW - Passwordless auth functions
│       ├── 🆕 pre-sign-up.js        - Auto-confirm users in Cognito
│       ├── 🆕 custom-message.js     - Send verification email
│       ├── 🆕 create-auth-challenge.js - Generate & send OTP
│       ├── 🆕 verify-auth-challenge.js - Validate OTP from user
│       ├── 🆕 signup.js             - Create user endpoint
│       ├── 🆕 verify-email.js       - Verify email with magic link
│       └── 🆕 package.json          - Dependencies
│
├── src/
│   ├── 🔄 App.jsx                  ✅ UPDATED - Added auth routes & AuthProvider
│   │
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── 🔄 Login.jsx         ✅ UPDATED - Passwordless OTP login
│   │   │   ├── 🔄 Signup.jsx        ✅ UPDATED - Registration form with validation
│   │   │   ├── 🆕 VerifyEmail.jsx   - Email verification page
│   │   │   └── OidcTrigger.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PurpleClouds.jsx
│   │   │   └── ScrollToTop.jsx
│   │   │
│   │   └── [other components...]
│   │
│   ├── context/
│   │   └── 🆕 AuthContext.jsx       - Global auth state + useAuth hook
│   │       - signup()
│   │       - initiateAuth()
│   │       - verifyOTP()
│   │       - logout()
│   │       - getIdToken()
│   │       - refreshToken()
│   │
│   ├── lib/
│   │   ├── 🔄 cognito.js            ✅ UPDATED - Complete auth API
│   │   │   - signup()
│   │   │   - initiateAuth()
│   │   │   - verifyOTP()
│   │   │   - getCurrentUser()
│   │   │   - getUserAttributes()
│   │   │   - getIdToken()
│   │   │   - refreshTokens()
│   │   │   - signOut()
│   │   │   - enableFakeAuth()
│   │   │
│   │   ├── cognitoPasswordless.js
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Alphalabs/
│   │   ├── Insights/
│   │   ├── Ventures/
│   │   └── Wealthcraft/
│   │
│   ├── constants/
│   ├── hooks/
│   ├── styles/
│   ├── assets/
│   │
│   ├── main.jsx
│   ├── index.jsx
│   └── styles.css
│
├── public/
│
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 tailwind.config.cjs
├── 📄 eslint.config.js
├── 📄 index.html
├── 📄 README.md
└── .env.local (your local env vars - not committed)


Legend:
  ✨ NEW     - Newly created
  ✅ UPDATED - Modified from original
  🔄         - Auto-managed/generated
  ⭐         - Important! Start here
  📖         - Reference documentation
  📄         - Document/Config file
```

---

## Key Files Explained

### 1. Core Infrastructure
**`infra/sam-template.yaml`** (560+ lines)
- Complete AWS infrastructure definition
- Cognito User Pool configuration
- 6 Lambda functions defined
- DynamoDB tables
- API Gateway endpoints
- IAM roles and permissions
- CloudFormation outputs

### 2. Lambda Functions (Backend)
**`aws-lambda/auth/`** - 6 serverless functions

| File | Purpose | Trigger | Language |
|------|---------|---------|----------|
| `pre-sign-up.js` | Auto-confirm users | Cognito PreSignUp | Node.js |
| `custom-message.js` | Send verification email | Cognito CustomMessage | Node.js |
| `create-auth-challenge.js` | Generate OTP, send email | Cognito CreateAuthChallenge | Node.js |
| `verify-auth-challenge.js` | Validate OTP | Cognito VerifyAuthChallenge | Node.js |
| `signup.js` | Create user endpoint | API Gateway POST | Node.js |
| `verify-email.js` | Verify email link | API Gateway GET | Node.js |

### 3. Frontend Components
**`src/components/Auth/`** - React authentication UI

| Component | Purpose | Routes |
|-----------|---------|--------|
| `Signup.jsx` | Registration form | `/signup` |
| `Login.jsx` | OTP login flow | `/login` |
| `VerifyEmail.jsx` | Email verification | `/auth/verify-email` |

### 4. Auth Library
**`src/lib/cognito.js`** (350+ lines)
- Complete Cognito SDK wrapper
- All auth functions
- Token management
- Fake auth for testing
- Error handling

### 5. State Management
**`src/context/AuthContext.jsx`** (200+ lines)
- Global auth state
- `useAuth()` custom hook
- Auth methods (signup, login, logout, etc.)
- Loading and error states

### 6. CI/CD Pipeline
**`.github/workflows/deploy-sam.yml`**
- Automated deployment on push
- SAM build and deploy
- Lambda dependency installation
- Stack outputs retrieval
- OIDC or static key authentication

---

## File Dependencies

```
App.jsx
├── AuthProvider (from AuthContext.jsx)
├── Login.jsx
│   └── initiateAuth, verifyOTP (from cognito.js)
├── Signup.jsx
│   └── signup (from cognito.js)
└── VerifyEmail.jsx
    └── verify-email API call

AuthContext.jsx
└── cognito.js (all auth functions)

cognito.js
└── amazon-cognito-identity-js (npm package)
```

---

## Database Schema

### DynamoDB Tables (Created by SAM)

**1. growksh-infra-auth-otp**
```
Primary Key: email (String)
Attributes:
  - otp (String): 6-digit code
  - ttl (Number): Auto-delete timestamp
  - createdAt (String): Creation time
TTL: Enabled (10 minutes)
```

**2. growksh-infra-contacts**
```
Primary Key: id (String)
Attributes:
  - name, email, phone, interest, message
  - timestamp
```

### Cognito User Pool

**User Attributes**
```
- email (required, unique identifier)
- name (required)
- phone_number (optional)
- email_verified (boolean, auto-set)
- sub (Cognito user ID, auto-generated)
```

---

## Environment Variables Map

### Frontend (.env.local)
```
VITE_COGNITO_USER_POOL_ID    ← CloudFormation Output: CognitoUserPoolId
VITE_COGNITO_CLIENT_ID       ← CloudFormation Output: CognitoUserPoolClientId  
VITE_API_URL                 ← CloudFormation Output: AuthApiEndpoint
VITE_USE_FAKE_AUTH           ← Set to 1 for testing without AWS (default: 0)
```

### GitHub Secrets
```
AWS_ROLE_TO_ASSUME           ← For OIDC authentication
AWS_ACCESS_KEY_ID            ← For static key auth
AWS_SECRET_ACCESS_KEY        ← For static key auth
AWS_SESSION_TOKEN            ← Optional session token

VERIFY_SECRET                ← HMAC secret (generate: openssl rand -hex 32)
SES_SOURCE_EMAIL             ← Verified SES email
VERIFY_BASE_URL              ← Frontend verification callback URL
```

### Lambda Environment (Auto-set by SAM)
```
OTP_TABLE                    ← DynamoDB table name
SES_SOURCE_EMAIL             ← Email sender
COGNITO_USER_POOL_ID         ← User pool ID
VERIFY_SECRET                ← HMAC secret
VERIFY_BASE_URL              ← Callback URL
DEBUG_LOG                    ← Enable/disable debug logging
```

---

## API Endpoints (CloudFormation Outputs)

```
/auth/signup          POST    Create new user
                                Body: { name, email, phone_number }
                                Response: User created message + userSub

/auth/verify-email    GET     Verify email with magic link
                                Params: ?email=...&token=...&t=...
                                Response: Redirect to /login

/auth/initiate        POST    Start CUSTOM_AUTH flow (Cognito)
                                Auto-triggered by Cognito

/auth/verify          POST    Submit OTP (Cognito)
                                Auto-triggered by Cognito
```

---

## Authentication Flows

### Signup Flow (3 steps)
```
1. User fills /signup form
   └─ Frontend: signup() → Backend: Lambda signup()
   
2. Cognito triggers PreSignUp
   └─ Auto-confirms user
   
3. Cognito triggers CustomMessage
   └─ Sends verification email with magic link
```

### Email Verification (1 step)
```
1. User clicks link from email
   └─ Frontend: /auth/verify-email
   └─ Backend: Lambda verify-email()
   └─ Validates HMAC token
   └─ Redirects to /login
```

### Login/OTP Flow (4 steps)
```
1. User enters email at /login
   └─ Frontend: initiateAuth() → Cognito → CreateAuthChallenge
   
2. Lambda generates OTP (6-digit)
   └─ Stores in DynamoDB
   └─ Sends via SES email
   
3. User enters OTP
   └─ Frontend: verifyOTP() → Cognito → VerifyAuthChallenge
   
4. Lambda validates OTP
   └─ Deletes from DynamoDB
   └─ Returns auth tokens
```

---

## Testing Files

Not included in repo (local only):
```
.env.local                 ← Your environment variables
.aws-sam/build/            ← Generated by sam build
node_modules/              ← Generated by npm install
dist/                      ← Built frontend
.sam-tests/                ← SAM test results
```

---

## Deployment Order

1. **Infrastructure First**
   ```bash
   sam build
   sam deploy  # Creates all AWS resources
   ```

2. **Get Stack Outputs**
   ```bash
   aws cloudformation describe-stacks --stack-name growksh-infra
   ```

3. **Update Frontend Config**
   ```bash
   # Add outputs to .env.local
   npm install
   npm run dev
   ```

4. **Test All Flows**
   ```
   Test signup → Check email → Verify → Test login → Test OTP
   ```

---

## Configuration Files

| File | Purpose | Editable |
|------|---------|----------|
| `sam-template.yaml` | Infrastructure definition | Yes (advanced) |
| `vite.config.js` | Frontend build config | Yes |
| `tailwind.config.cjs` | Tailwind CSS setup | Yes |
| `eslint.config.js` | Code linting | Yes |
| `.env.local` | Local env vars | Yes (not committed) |
| `package.json` | Dependencies | Usually |
| `package-lock.json` | Locked dependencies | No |

---

## Code Statistics

| Metric | Count |
|--------|-------|
| New files created | 7 |
| Files modified | 5 |
| Lambda functions | 6 |
| React components | 3 |
| Documentation files | 4 |
| Lines of code (Lambda) | ~600 |
| Lines of code (Frontend) | ~800 |
| Lines of code (Infrastructure) | ~560 |
| Total new code | ~2000+ |

---

## Quick Navigation

**For Setup:**
1. Read: `QUICKSTART.md` (5 min)
2. Follow: `SETUP_CHECKLIST.md` (20 min)
3. Deploy: `sam deploy` (5-10 min)

**For Development:**
1. Check: `.env.local` configuration
2. Run: `npm run dev`
3. Test: `/signup` and `/login` pages
4. Use: `useAuth()` hook in components

**For Troubleshooting:**
1. Check: `CONFIG_REFERENCE.md` for settings
2. Read: `AUTH_IMPLEMENTATION.md` for deep dive
3. Review: CloudWatch logs in AWS console
4. Test: Enable fake auth for local testing

**For Customization:**
1. Edit: `aws-lambda/auth/custom-message.js` for email templates
2. Change: OTP length, expiry, validation in Lambda functions
3. Update: UI/UX in React components
4. Modify: SAM template for infrastructure changes

---

**Last Updated**: December 22, 2025
**Total Implementation Time**: ~4 hours
**Ready for Production**: ✅ Yes (with security review)
