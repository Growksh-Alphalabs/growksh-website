# Passwordless Authentication Implementation Guide

## Overview

This document describes the complete passwordless authentication flow implemented for Growksh using AWS Cognito and Lambda functions, with a unified login/signup flow.

## Authentication Flow

### 1. Signup Flow
```
User goes to /auth/signup page
    ↓
Enters: Name, Email, Phone (optional)
    ↓
Click "Sign Up" button
    ↓
Lambda: signup() creates user in Cognito User Pool
    ↓
Cognito: Triggers PreSignUpFunction (auto-confirms user)
    ↓
Cognito: Triggers CustomMessageFunction (sends verification email)
    ↓
User receives email with verification link (HMAC-signed, 24-hour expiry)
    ↓
User clicks link → /auth/verify-email?email=...&token=...&t=...
    ↓
VerifyEmailFunction validates HMAC token + timestamp
    ↓
AdminUpdateUserAttributes sets email_verified=true in Cognito
    ↓
Redirects to /auth/login?email=... (pre-filled)
```

### 2. Unified Login/OTP Flow (with User Existence Check)
```
User goes to /auth/login page
    ↓
Enters: Email
    ↓
Frontend: POST /auth/check-user { email }
    ↓
Lambda: AdminGetUser checks if user exists in Cognito
    ↓
If NOT found:
    → Return { exists: false }
    → Frontend redirects to /auth/signup?email=...
    ↓
If found:
    → Return { exists: true }
    → Frontend calls initiateAuth(email) → CUSTOM_AUTH flow
    ↓
Cognito: CreateAuthChallenge trigger fires
    ↓
Lambda: CreateAuthChallengeFunction
    1. Generates 6-digit OTP
    2. Stores OTP in DynamoDB with 10-minute TTL
    3. Sends OTP via SES email
    ↓
User receives OTP in email
    ↓
User enters OTP on /auth/login (now on OTP entry stage)
    ↓
Click "Verify OTP" button
    ↓
Frontend: verifyOTP({ email, otp, session })
    ↓
Cognito: VerifyAuthChallenge trigger fires
    ↓
Lambda: VerifyAuthChallengeFunction
    1. Retrieves OTP from DynamoDB
    2. Validates OTP matches
    3. Deletes OTP from DynamoDB
    4. Returns success
    ↓
Cognito: Returns AuthenticationResult
    { IdToken, AccessToken, RefreshToken }
    ↓
Frontend: Stores tokens in localStorage
    ↓
Redirect: → Home (logged in) + AuthContext updated
```

### 3. Logout Flow
```
User clicks profile dropdown (top-right navbar)
    ↓
Clicks "Logout" button
    ↓
Confirmation dialog: "Logout now?"
    ↓
If confirmed:
    → logout() from AuthContext
    ↓
Frontend clears:
    • localStorage: idToken, accessToken, refreshToken, userEmail
    • CognitoIdentityServiceProvider.* keys (amazon-cognito-identity-js)
    ↓
AuthContext updates:
    • isAuthenticated = false
    • user = null
    ↓
Navbar shows "Login" button again
    ↓
Redirect: → Home page
```

### 4. Token Management
- **ID Token**: Used for user identity (includes user claims: email, name, phone_number)
- **Access Token**: Used for API authentication
- **Refresh Token**: Used to get new tokens when current ones expire (Cognito handles)
- **Cognito Session**: String passed through custom challenge flow (not persisted)
- **OTP**: 6-digit code, stored 10 minutes in DynamoDB, one-time use

## Architecture

### Frontend Components & Flow
```
Navbar.jsx
├── Shows "Login" button when logged out
├── Shows profile dropdown when logged in
│   └── Avatar, name, email, Logout button
└── Uses AuthContext (useAuth hook)

Login.jsx (/auth/login)
├── Email entry stage
│   ├── POST /auth/check-user { email }
│   ├── If user not found → redirect to /auth/signup?email=...
│   └── If found → initiateAuth(email) → show OTP stage
├── OTP entry stage
│   ├── Display "OTP sent to {email}"
│   ├── verifyOTP({ email, otp, session })
│   └── On success → redirect to Home
└── Uses cognito.js functions

Signup.jsx (/auth/signup)
├── Form: Name, Email, Phone
├── POST /auth/signup → SignupFunction
├── Success → redirect to /auth/login
├── Email query param pre-fills email field
└── Uses cognito.js functions

VerifyEmail.jsx (/auth/verify-email)
├── Validates HMAC token from URL
├── GET /auth/verify-email?email=...&token=...&t=...
├── On success → redirect to /auth/login?email=...
└── Uses verify-email Lambda

AuthContext.jsx (Global State)
├── user: { email, name, phone_number, isAuthenticated }
├── isAuthenticated: boolean
├── signup(userData) → calls signup Lambda
├── initiateAuth(email) → checks user exists + initiates auth
├── verifyOTP({ email, otp, session }) → verifies OTP
├── logout() → clears tokens + state
└── On mount: checkAuth() validates existing session

cognito.js (Auth Library)
├── signup(userData) → POST /auth/signup
├── checkUserExists(email) → POST /auth/check-user
├── initiateAuth(email) → Cognito CUSTOM_AUTH
├── verifyOTP({ email, otp, session }) → RespondToAuthChallenge
├── logout() → clears localStorage + Cognito keys
└── getCurrentUser() / getUserAttributes() / getIdToken()
```

### Backend (AWS Services)
```
AWS Cognito User Pool
├── Users table: email, name, phone_number, email_verified
├── Authentication Flow: CUSTOM_AUTH enabled
├── Triggers:
│   ├── PreSignUp → pre-sign-up.js (auto-confirm)
│   ├── CustomMessage → custom-message.js (send verification email)
│   ├── CreateAuthChallenge → create-auth-challenge.js (generate OTP + email)
│   ├── DefineAuthChallenge → define-auth-challenge.js (orchestrate flow)
│   ├── VerifyAuthChallenge → verify-auth-challenge.js (validate OTP)
│   └── PostConfirmation → post-confirmation.js (post-signup hook)
└── User Pool Client: CUSTOM_AUTH + REFRESH_TOKEN_AUTH flows

API Gateway (AuthApiGateway)
├── /auth/signup (POST) → SignupFunction
├── /auth/verify-email (GET) → VerifyEmailFunction
├── /auth/check-user (POST) → CheckUserFunction
└── All routes support OPTIONS (CORS)

Lambda Functions
├── SignupFunction
│   ├── AdminCreateUser in Cognito
│   ├── Sends verification email via SES (with HMAC link)
│   └── Role: AuthLambdaExecutionRole
│
├── VerifyEmailFunction
│   ├── Validates HMAC token (SHA-256)
│   ├── Checks timestamp (24-hour expiry)
│   ├── AdminUpdateUserAttributes → email_verified=true
│   └── Role: Custom (AdminUpdateUserAttributes permission)
│
├── CheckUserFunction (NEW)
│   ├── AdminGetUser to check if email exists
│   ├── Returns { exists: true/false }
│   └── Role: AuthLambdaExecutionRole
│
├── PreSignUpFunction
│   ├── Auto-confirms user
│   └── Returns: { autoConfirmUser: true, autoVerifyEmail: false }
│
├── CustomMessageFunction
│   ├── Sends verification email (from SignupFunction trigger)
│   └── Constructs verification link with HMAC token
│
├── CreateAuthChallengeFunction
│   ├── Generates 6-digit OTP
│   ├── Stores in DynamoDB auth-otp table (10-min TTL)
│   ├── Sends OTP via SES
│   └── Returns: { privateChallengeParameters: { otp } }
│
├── DefineAuthChallengeFunction
│   ├── Orchestrates CUSTOM_AUTH challenge flow
│   ├── Decides if challenge needed or token issued
│   └── Returns: { issueTokens: true/false, challengeName: CUSTOM_CHALLENGE }
│
└── VerifyAuthChallengeFunction
    ├── Retrieves OTP from DynamoDB
    ├── Compares with user response
    ├── Deletes OTP (one-time use)
    └── Returns: { answerCorrect: true/false }

DynamoDB
├── auth-otp table (automatic cleanup)
│   ├── Partition Key: email
│   ├── Attributes: otp, ttl, createdAt
│   └── TTL: 10 minutes (auto-delete)
│
└── contacts table (from contact form)
    └── Unrelated to auth

SES (Simple Email Service)
├── Sends verification emails (CustomMessageFunction)
│   └── Contains HMAC-signed link
├── Sends OTP emails (CreateAuthChallengeFunction)
│   └── Contains 6-digit code
└── Requires: Verified sender email + production access for external recipients
```

## Environment Variables

### Required Frontend (.env.local for local dev, .env at build time for CI/CD)
```
VITE_COGNITO_USER_POOL_ID=ap-south-1_4eXRVfyQv
VITE_COGNITO_CLIENT_ID=25ci4polvgbm7ekaic3p2c5n49
VITE_API_URL=https://b5230xgtzl.execute-api.ap-south-1.amazonaws.com/Prod
VITE_AWS_REGION=ap-south-1
VITE_USE_FAKE_AUTH=0  # Set to 1 for local testing without AWS
```

### Required AWS/GitHub Secrets
```
AWS_ROLE_TO_ASSUME       # OIDC role ARN for GitHub Actions
VERIFY_SECRET            # 32+ char random string (openssl rand -hex 32)
SES_SOURCE_EMAIL         # Verified SES email: noreply@growksh.com
VERIFY_BASE_URL          # https://d2eipj1xhqte5b.cloudfront.net/auth/verify-email (dev)
                         # https://growksh.com/auth/verify-email (prod)
```

### CloudFormation Parameters (sam-template.yaml)
```
Parameters:
  SESSourceEmail          # Default: noreply@growksh.com
  VerifyBaseUrl           # Default: https://d2eipj1xhqte5b.cloudfront.net/auth/verify-email
  DebugLogVerify          # Set to '1' to log verification URLs in Lambda
  DebugLogOTP             # Set to '1' to log OTP codes in Lambda (dev only!)
  VerifySecret            # HMAC secret for token signing
```
- Node.js 18+ for local development

### 2. Deploy with GitHub Actions
```bash
# Push to main/master branch to trigger automatic deployment
git push origin main

# Or trigger manually via GitHub Actions UI
# Workflow: Deploy SAM Infra
```

### 3. Manual Deployment
```bash
# Install dependencies
cd aws-lambda/auth
npm install
cd ../../

# Build and deploy
sam build --template-file infra/sam-template.yaml
sam deploy --template-file .aws-sam/build/template.yaml \
  --stack-name growksh-infra \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    VerifySecret="your-long-secret-here" \
    SESSourceEmail="noreply@growksh.com" \
    VerifyBaseUrl="https://yoursite.com/auth/verify-email"
```

### 4. Post-Deployment Setup
```bash
# Get stack outputs
aws cloudformation describe-stacks \
  --stack-name growksh-infra \
  --query 'Stacks[0].Outputs' \
  --output table

# Update .env.local with outputs
VITE_COGNITO_USER_POOL_ID=<CognitoUserPoolId>
VITE_COGNITO_CLIENT_ID=<CognitoUserPoolClientId>
VITE_API_URL=<AuthApiEndpoint>
```

## Testing

### Local Testing with Fake Auth
```javascript
// In browser console
import { enableFakeAuth } from './src/lib/cognito'
enableFakeAuth()

// Now you can test signup and login flows without AWS
```

### Testing with Real AWS
1. **Verify SES Email**: Add verified email in SES console
2. **Test Signup**: Go to `/signup` and register
3. **Check Email**: Look for verification link
4. **Verify Email**: Click link to confirm
5. **Test Login**: Use verified email to receive OTP
6. **Check Email**: Look for OTP code
7. **Enter OTP**: Complete login

## API Endpoints

### Signup
```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890"  // optional
}

Response:
{
  "message": "User created successfully...",
  "email": "john@example.com",
  "userSub": "cognito-user-id"
}
```

### Verify Email
```
GET /auth/verify-email?email=john@example.com&token=<hmac>&t=<timestamp>

Response:
{
  "message": "Email verified successfully",
  "email": "john@example.com",
  "redirect": "/login?email=john@example.com&verified=1"
}
```

### Cognito Auth Flow (Built-in)
```
1. Initiate Auth
POST /initiate-auth (Cognito endpoint)
{
  "AuthFlow": "CUSTOM_AUTH",
  "ClientId": "<CLIENT_ID>",
  "AuthParameters": {
    "USERNAME": "email@example.com"
  }
}

Response includes Session string

2. Respond to Challenge
POST /respond-to-auth-challenge (Cognito endpoint)
{
  "ChallengeName": "CUSTOM_CHALLENGE",
  "ClientId": "<CLIENT_ID>",
  "Session": "<session-from-step1>",
  "ChallengeResponses": {
    "USERNAME": "email@example.com",
    "ANSWER": "123456"  // OTP
  }
}

Response includes tokens:
{
  "AuthenticationResult": {
    "IdToken": "...",
    "AccessToken": "...",
    "RefreshToken": "..."
  }
}
```

## Token Management in Frontend

### Store Tokens
```javascript
// After successful login
localStorage.setItem('idToken', result.AuthenticationResult.IdToken)
localStorage.setItem('accessToken', result.AuthenticationResult.AccessToken)
localStorage.setItem('refreshToken', result.AuthenticationResult.RefreshToken)
localStorage.setItem('userEmail', email)
```

### Retrieve Tokens
```javascript
import { getIdToken } from './lib/cognito'

const token = await getIdToken()
// Use in API calls:
// fetch('/api/endpoint', {
//   headers: { Authorization: `Bearer ${token}` }
// })
```

### Refresh Tokens
```javascript
import { refreshTokens } from './lib/cognito'

const newSession = await refreshTokens()
// Update localStorage with new tokens
```

## Security Considerations

1. **Email Verification**: Users must verify email before login
2. **OTP Timeout**: OTPs expire in 10 minutes
3. **HMAC Signing**: Verification tokens signed with secret
4. **Token Expiry**: Managed by Cognito (configurable)
5. **HTTPS Only**: All communications should be over HTTPS
6. **CORS**: API Gateway configured with proper CORS headers
7. **DynamoDB TTL**: OTPs automatically deleted after 10 minutes

## Troubleshooting

### Issue: "Cognito UserPoolId not configured"
**Solution**: Set `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID` in `.env.local`

### Issue: OTP not received
**Solution**: 
- Check SES sandbox restrictions (might need to verify recipient emails)
- Verify `SES_SOURCE_EMAIL` in CloudFormation parameters
- Check Lambda logs in CloudWatch

### Issue: Verification link doesn't work
**Solution**:
- Check `VERIFY_BASE_URL` matches your frontend URL
- Verify `VERIFY_SECRET` is consistent between Lambda and frontend
- Check timestamp isn't older than 24 hours

### Issue: User already exists error
**Solution**: User already registered, ask them to use /login instead

## Advanced: Using AWS SDK v3

For more control, use the AWS SDK implementation in `src/lib/cognitoPasswordless.js`:

```javascript
import { 
  initiatePasswordless, 
  answerCustomChallenge 
} from './lib/cognitoPasswordless'

// Initiate
const session = await initiatePasswordless({
  username: 'email@example.com',
  clientId: 'YOUR_CLIENT_ID'
})

// Answer
const result = await answerCustomChallenge({
  session,
  username: 'email@example.com',
  clientId: 'YOUR_CLIENT_ID',
  otpCode: '123456'
})
```

## Database Cleanup

The DynamoDB OTP table automatically cleans up expired items via TTL. Manual cleanup (if needed):

```bash
# Clear all OTPs (use with caution)
aws dynamodb scan --table-name growksh-infra-auth-otp \
  --projection-expression "email" \
  --query 'Items[*].email.S' \
  --output text | \
  xargs -I {} aws dynamodb delete-item \
  --table-name growksh-infra-auth-otp \
  --key '{"email": {"S": "{}"}}'
```

## Next Steps

1. Customize email templates in `custom-message.js`
2. Add additional user attributes in Cognito schema
3. Implement role-based access control (RBAC)
4. Add MFA for enhanced security
5. Create user profile management page
6. Implement logout on all tabs/windows
7. Add "Forgot Email" / "Resend OTP" functionality

## References

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Amazon Cognito Identity SDK for JavaScript](https://github.com/aws-amplify/amplify-js)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
