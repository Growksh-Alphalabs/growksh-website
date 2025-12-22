# Passwordless Authentication Implementation Guide

## Overview

This document describes the complete passwordless authentication flow implemented for Growksh using AWS Cognito and Lambda functions.

## Authentication Flow

### 1. Signup Flow
```
User goes to /signup page
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
User receives email with verification link
    ↓
User clicks link → /auth/verify-email
    ↓
VerifyEmailFunction validates HMAC token
    ↓
Redirects to /login with email pre-filled
```

### 2. Login/OTP Flow
```
User goes to /login page
    ↓
Enters: Email
    ↓
Click "Send OTP" button
    ↓
Cognito: initiateAuth() → CUSTOM_AUTH flow triggered
    ↓
Lambda: CreateAuthChallengeFunction generates 6-digit OTP
    ↓
Lambda: Stores OTP in DynamoDB with 10-minute TTL
    ↓
Lambda: Sends OTP via SES email
    ↓
User receives OTP in email
    ↓
User enters OTP on /login?stage=otp
    ↓
Click "Verify OTP" button
    ↓
Cognito: respondToAuthChallenge() with OTP
    ↓
Lambda: VerifyAuthChallengeFunction validates OTP
    ↓
Lambda: Deletes OTP from DynamoDB
    ↓
User logged in successfully!
    ↓
Tokens stored in localStorage:
  - idToken
  - accessToken
  - refreshToken
  - userEmail
```

### 3. Token Management
- **ID Token**: Used for user identity (includes user claims)
- **Access Token**: Used for API authentication
- **Refresh Token**: Used to get new tokens when current ones expire
- **TTL**: Set to 10 minutes for OTP; tokens handled by Cognito

## Architecture

### Frontend Components
```
src/components/Auth/
├── Login.jsx          - Email + OTP entry
├── Signup.jsx         - Registration form
└── VerifyEmail.jsx    - Email verification via magic link

src/context/
├── AuthContext.jsx    - Global auth state management with useAuth hook

src/lib/
├── cognito.js         - Cognito SDK wrapper with all auth functions
└── cognitoPasswordless.js - AWS SDK v3 implementation (optional)
```

### Backend (AWS Services)
```
AWS Cognito User Pool
├── Pre Sign Up Trigger
│   └── Lambda: pre-sign-up.js (auto-confirms users)
├── Custom Message Trigger
│   └── Lambda: custom-message.js (sends verification email)
├── Create Auth Challenge Trigger
│   └── Lambda: create-auth-challenge.js (generates OTP, sends via SES)
└── Verify Auth Challenge Trigger
    └── Lambda: verify-auth-challenge.js (validates OTP)

API Gateway
├── POST /auth/signup - Create new user
├── GET /auth/verify-email - Verify email with token
├── POST /auth/initiate - Start OTP flow (handled by Cognito)
└── POST /auth/verify - Verify OTP (handled by Cognito)

DynamoDB
├── auth-otp table - Stores OTPs with 10-minute TTL
└── contacts table - Contact form submissions

SES (Simple Email Service)
├── Sends verification emails (signup)
└── Sends OTP emails (login)
```

## Environment Variables

### Required Frontend Variables (.env.local)
```
# Cognito
VITE_COGNITO_USER_POOL_ID=<from CloudFormation outputs>
VITE_COGNITO_CLIENT_ID=<from CloudFormation outputs>

# API
VITE_API_URL=<from CloudFormation outputs - AuthApiEndpoint>

# Optional: Enable fake auth for testing
VITE_USE_FAKE_AUTH=0
```

### Required AWS Secrets (GitHub)
```
AWS_ROLE_TO_ASSUME       - IAM role ARN for OIDC
AWS_ACCESS_KEY_ID        - AWS access key (if not using OIDC)
AWS_SECRET_ACCESS_KEY    - AWS secret key (if not using OIDC)
AWS_SESSION_TOKEN        - Optional session token

VERIFY_SECRET            - HMAC secret for email verification tokens (long random string)
SES_SOURCE_EMAIL         - Verified SES email address
VERIFY_BASE_URL          - Frontend URL for email verification callback
```

## Deployment

### 1. Prerequisites
- AWS Account with permissions for Cognito, Lambda, DynamoDB, SES, API Gateway
- GitHub repository with Actions enabled
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
