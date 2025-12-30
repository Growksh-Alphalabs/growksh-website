# Passwordless Auth - Quick Start Guide

## TL;DR - 5 Minute Setup

### 1. GitHub Configuration
- Repository already has GitHub OIDC configured
- `GrowkshDeveloperRole` IAM role created in AWS
- No additional secrets needed (OIDC-based authentication)

### 2. Deploy Infrastructure
```bash
# Push to develop branch - automatically deploys to dev
git push origin develop

# Or manually deploy
./infra/scripts/deploy-stacks.sh dev
```

### 3. Check Deployment Progress
Go to: https://github.com/Growksh-Alphalabs/growksh-website/actions

Watch the "Deploy to Development" workflow (takes 10-15 minutes)

### 4. Get CloudFormation Outputs
```bash
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --query 'Stacks[0].Outputs' \
  --region ap-south-1
```

### 5. Update .env.local for Local Development
```
VITE_COGNITO_USER_POOL_ID=<from Cognito stack output>
VITE_COGNITO_CLIENT_ID=<from Cognito stack output>
VITE_API_URL=<from API Gateway stack output>
```

Note: `.env.local` is for local development only. In production (CloudFront/S3), Vite reads env vars at **build time** from CloudFormation outputs captured during GitHub Actions workflow.

### 6. Done! 🎉
- **Local Signup**: http://localhost:5173/signup
- **Local Login**: http://localhost:5173/login
- **Dev Deployment**: Check CloudFormation output for CloudFront domain
- **Production**: Push to main branch for production deployment (with approval gate)

---

## Local Development with Fake Auth

Test without AWS:
```javascript
// In browser console
import { enableFakeAuth } from './src/lib/cognito'
enableFakeAuth()

// Now signup/login work with fake data
```

---

## Frontend Usage

### Use the Auth Hook
```javascript
import { useAuth } from '../context/AuthContext'

export function MyComponent() {
  const { user, isAuthenticated, signup, logout } = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout {user.email}</button>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  )
}
```

### Manual Auth Functions
```javascript
import { signup, initiateAuth, verifyOTP } from './lib/cognito'

// Signup
await signup({ name, email, phone_number })

// Login - Step 1: Get OTP
const { session } = await initiateAuth(email)

// Login - Step 2: Verify OTP
const result = await verifyOTP({ email, otp, session })

// Get token for API calls
const token = await getIdToken()
```

---

## Authentication Routes

| Route | Purpose | Description |
|-------|---------|-------------|
| `/signup` | Register | User enters name, email, phone |
| `/login` | Login | User enters email, receives OTP |
| `/auth/verify-email` | Email Verification | Verification link from email |

---

## User Flow Summary

```
1. User fills signup form → /signup
   └─ Backend: Create user in Cognito
   └─ Email: Verification link sent

2. User clicks email link → /auth/verify-email
   └─ Backend: Validates HMAC token
   └─ Redirect: To login page with email pre-filled

3. User enters email → /login
   └─ Frontend: Check if email exists (POST /auth/check-user)
   └─ If NOT found: Redirect to /signup?email=...
   └─ If found: Proceed to OTP stage

4. OTP sent to email (if user found)
   └─ Backend: CreateAuthChallenge generates 6-digit OTP
   └─ Email: OTP sent

5. User enters OTP → /login (OTP entry screen)
   └─ Backend: VerifyAuthChallenge validates OTP
   └─ Token: Stored in localStorage
   └─ Redirect: To home page

6. User logged in
   └─ Navbar: Shows profile dropdown with user details
   └─ Logout: Button available with confirmation dialog
```

---

## API Endpoints

### Check User Exists (Lambda)
```
POST /auth/check-user
{
  "email": "john@example.com"
}

Response (User Found):
{
  "exists": true
}

Response (User Not Found):
{
  "exists": false
}
```
**Purpose**: Before OTP flow, check if email is registered. If not found, redirect to signup.

### Signup (Lambda)
```
POST /auth/signup
{
  "name": "John",
  "email": "john@example.com",
  "phone_number": "+1234567890"
}

Response:
{
  "message": "User created. Check your email for verification link."
}
```
**Purpose**: Create new user in Cognito and send verification email.

### Verify Email (Lambda)
```
GET /auth/verify-email?email=john@example.com&token=xxxxx&t=1234567890
```
**Purpose**: Validate HMAC token from email link and mark email as verified.

### Login OTP (Cognito - Automatic)
- Email + OTP handled via Cognito CUSTOM_AUTH flow
- OTP sent by CreateAuthChallenge Lambda function
- OTP verified by VerifyAuthChallenge Lambda function

---

## Database Schema

### OTP Table (DynamoDB)
```
PK: email (String)
Attributes:
  - otp: string (6-digit code)
  - ttl: number (10 minutes)
  - createdAt: string (ISO timestamp)
TTL: 10 minutes (auto-delete)
```

### Cognito User Attributes
```
- email (required, unique)
- name (required)
- phone_number (optional)
- email_verified (automatic)
- cognito:username (auto-generated)
```

---

## Email Templates

### Signup Verification Email
Sent by: CustomMessageFunction
```
Hello [Name],

Welcome to Growksh! To complete your signup, click the link below:

[Verification Link]

This link expires in 24 hours.

Best regards,
Growksh Team
```

### OTP Email
Sent by: CreateAuthChallengeFunction
```
Your one-time password (OTP) is: [6-digit code]

Valid for 10 minutes.

Do not share this code with anyone.
```

---

## Common Issues & Fixes

### Issue: "Email not found"
**Fix**: User hasn't verified email. Check /signup flow.

### Issue: "Invalid OTP"
**Fix**:
- OTP might be expired (10 min limit)
- Check email received OTP
- Typo in OTP entry

### Issue: "Verify your SES email"
**Fix**:
- Verify sender email in SES console
- May need production access for SES
- Check CloudWatch logs

### Issue: Signup button not working
**Fix**:
- Check .env.local has VITE_COGNITO_USER_POOL_ID
- Check network tab for API errors
- Check CloudWatch logs for Lambda errors

---

## Token Management

### Auto-Stored in localStorage
```javascript
{
  "idToken": "eyJ...",        // User identity
  "accessToken": "eyJ...",    // API access
  "refreshToken": "eyJ...",   // Get new tokens
  "userEmail": "user@example" // For context
}
```

### Using Tokens in API Calls
```javascript
const token = localStorage.getItem('idToken')
fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Refresh Tokens (Auto-handled)
Token refresh is handled automatically. No manual intervention needed.

---

## Customization

### Change OTP Length
In `create-auth-challenge.js`:
```javascript
// Change from 6 digits to 8
const otp = Math.floor(10000000 + Math.random() * 90000000).toString()
```

### Change OTP Expiry
In `create-auth-challenge.js`:
```javascript
// Change from 10 minutes to 30 minutes
const ttl = Math.floor(Date.now() / 1000) + (30 * 60)
```

### Custom Email Templates
Edit `/custom-message.js`:
```javascript
response.emailSubject = 'Your Custom Subject'
response.emailMessage = `Your custom email body with ${email}`
```

---

## Production Checklist

- [ ] SES verified and in production (not sandbox)
- [ ] HTTPS enabled
- [ ] Environment variables set correctly
- [ ] CloudWatch alarms configured
- [ ] Lambda concurrent execution limits set
- [ ] DynamoDB auto-scaling enabled
- [ ] CORS properly configured
- [ ] Sensitive data not logged
- [ ] Backup plan documented

---

## Support / Questions

See `AUTH_IMPLEMENTATION.md` for:
- Detailed architecture
- Advanced configuration
- Troubleshooting guide
- Security best practices
- Database management

See `SETUP_CHECKLIST.md` for:
- Complete setup steps
- Post-deployment config
- Testing procedures
- Monitoring setup

---

## Tech Stack

- **Frontend**: React + Vite
- **Auth**: AWS Cognito (UserPool)
- **Compute**: AWS Lambda (Node.js 18)
- **Database**: DynamoDB
- **Email**: SES (Simple Email Service)
- **API**: API Gateway
- **IaC**: SAM (Serverless Application Model)
- **CI/CD**: GitHub Actions

---

**Ready to deploy? Start with SETUP_CHECKLIST.md →**
