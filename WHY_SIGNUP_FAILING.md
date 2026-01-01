# Why Signup/Sign-in Are Failing - Simple Explanation

## The Problem (In 30 seconds)

You're seeing:
```
❌ POST /auth/signup returns 500 without CORS headers
❌ POST /auth/check-user returns 500 without CORS headers
❌ Sign-in fails: "Custom auth lambda trigger is not configured"
```

**Why?** The backend Lambda functions that handle signup and sign-in were **never deployed** to your new environment.

---

## What's Missing

### Missing Piece 1: Lambda Functions
The API needs these functions:
- `growksh-website-signup-feature-77d07ae1` → Handles user registration
- `growksh-website-check-user-feature-77d07ae1` → Checks if user exists
- `growksh-website-verify-email-feature-77d07ae1` → Verifies email links
- `growksh-website-contact-feature-77d07ae1` → Handles contact form

**Current State:** ❌ These don't exist in your AWS account yet

### Missing Piece 2: Cognito Auth Triggers
Sign-in uses OTP authentication, which requires these Lambda triggers in your Cognito pool:
- `pre-sign-up` → Validates user before signup
- `custom-message` → Generates OTP message
- `define-auth-challenge` → Defines OTP challenge type
- `create-auth-challenge` → Creates OTP and stores in DynamoDB
- `verify-auth-challenge` → Verifies user's OTP response
- `post-confirmation` → Runs after successful confirmation

**Current State:** ❌ These aren't attached to pool `ap-south-1_NiqhNWvf8` yet

### Missing Piece 3: Lambda Code in S3
Lambda code lives in S3 as ZIP files:
- `s3://growksh-website-lambda-code-feature-77d07ae1/auth/signup-feature-77d07ae1.zip`
- `s3://growksh-website-lambda-code-feature-77d07ae1/auth/verify-auth-challenge-feature-77d07ae1.zip`
- etc.

**Current State:** ❌ The S3 bucket exists but the ZIP files aren't there yet

---

## How It Should Work

```
┌─────────────────────────────────────────────────────────────┐
│ User clicks "Sign Up" on Frontend                           │
│ (https://d12jf2jvld5mg4.cloudfront.net/)                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Browser sends POST to API Gateway                           │
│ https://8hz8oz0aef.execute-api.ap-south-1.amazonaws.com/... │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ API Gateway routes to Lambda                                │
│ (growksh-website-signup-feature-77d07ae1)                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Lambda calls Cognito API                                    │
│ AdminCreateUser()                                           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Cognito triggers pre-sign-up Lambda                         │
│ (growksh-website-pre-sign-up-feature-77d07ae1)              │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ User created! Response sent back to browser                 │
│ ✅ 201 Created                                              │
│ ✅ With CORS headers                                        │
└─────────────────────────────────────────────────────────────┘
```

**Currently:** Steps 3-5 fail because the Lambdas don't exist! API Gateway returns 500 with no CORS headers.

---

## The Fix: 3 Steps

### Step 1: Package the Lambda Code
Run this command to create ZIP files:
```powershell
npm run package-lambdas
```

Creates:
- `aws-lambda/auth/signup-feature-77d07ae1.zip`
- `aws-lambda/auth/verify-auth-challenge-feature-77d07ae1.zip`
- etc. (8 total)

### Step 2: Deploy CloudFormation Stacks
Run this command to create AWS resources:
```powershell
.\Deploy-Feature-Env.ps1
```

Creates:
- IAM roles (for Lambdas to call Cognito/DynamoDB)
- DynamoDB table (for storing OTPs)
- S3 bucket (for Lambda code)
- 6 Cognito trigger Lambdas
- Cognito User Pool configuration
- API Lambdas for signup/check-user/verify-email
- Plus other infrastructure

### Step 3: Upload Lambda Code to S3
The deploy script does this automatically, but manually:
```bash
aws s3 cp aws-lambda/auth/signup-feature-77d07ae1.zip \
  s3://growksh-website-lambda-code-feature-77d07ae1/auth/
```

All 8 ZIPs go into the S3 bucket.

---

## Why This Wasn't Done Already

The environment `feature-77d07ae1` is **new** and the infrastructure scripts haven't run yet.

The `runtime-config.js` already has the correct values:
- ✅ Cognito Pool: `ap-south-1_NiqhNWvf8`
- ✅ Cognito Client: `3cviqovg35pjt8n9e90gp8pum4`
- ✅ API Gateway: `8hz8oz0aef`

But the **backend** was never deployed to match these IDs.

---

## Why the Error Messages?

### Error 1: CORS Block
```
Access to fetch... has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header
```

**Why:** API Gateway can't find a Lambda to forward the request to, so it returns 500 directly from the gateway (not from the Lambda). Since no Lambda runs, no CORS headers are added.

### Error 2: "Custom auth lambda trigger is not configured"
```
Auth error: Error: Custom auth lambda trigger is not configured 
for the user pool.
```

**Why:** The Cognito user pool `ap-south-1_NiqhNWvf8` has no Lambda triggers attached. When the app tries to sign in with `InitiateAuth()`, Cognito returns this error because it doesn't know how to handle custom auth (OTP).

---

## What Changed in the Code

Two CloudFormation templates had hardcoded account IDs removed:

### Before (Broken)
```yaml
Default: growksh-website-lambda-code-720427058396
```

### After (Fixed)
```yaml
Default: ''
```

This makes the templates work in ANY AWS account. The deploy script passes the correct bucket name dynamically.

---

## Timeline

```
Now:  ❌ Signup returns 500, Sign-in fails
  ↓
  Run Deploy-Feature-Env.ps1 (~30 min)
  ↓
30m:  ✅ All 8 Lambdas deployed
      ✅ Cognito triggers attached
      ✅ Signup returns 201
      ✅ Sign-in flow works
```

---

## What Happens When You Deploy

### Before Deployment
```
API Gateway 8hz8oz0aef
    ↓
❌ No Lambda attached
    ↓
500 error (no CORS headers)
```

### After Deployment
```
API Gateway 8hz8oz0aef
    ↓
Lambda: growksh-website-signup-feature-77d07ae1
    ↓
Cognito User Pool: ap-south-1_NiqhNWvf8
    ↓
Pre-sign-up Lambda (validate)
    ↓
Custom-message Lambda (send email)
    ↓
✅ 201 response with CORS headers
```

---

## Success Indicators

After running the deploy script, you should see:

✅ Lambda functions in AWS console:
- `growksh-website-signup-feature-77d07ae1`
- `growksh-website-check-user-feature-77d07ae1`
- (6 more Cognito triggers)

✅ Cognito pool triggers:
- PreSignUp Lambda attached
- CustomMessage Lambda attached
- DefineAuthChallenge Lambda attached
- (3 more)

✅ API responses:
- `curl https://8hz8oz0aef.../auth/signup` → 201 (not 500)
- `curl https://8hz8oz0aef.../auth/check-user` → 200 (not 500)

✅ Frontend sign-in:
- Email field accepts input
- Shows OTP input after submit
- OTP email arrives
- Successful login after OTP entry

---

## TL;DR

**Problem:** Backend wasn't deployed for `feature-77d07ae1`

**Solution:** Run `.\Deploy-Feature-Env.ps1` to deploy everything in one command (~30 minutes)

**Result:** Signup and sign-in will work
