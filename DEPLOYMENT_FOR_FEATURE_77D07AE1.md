# Deployment Guide for feature-77d07ae1 Environment

## Overview
The new deployment uses API Gateway `8hz8oz0aef` and Cognito pool `ap-south-1_NiqhNWvf8`, but the backend Lambda functions and triggers haven't been deployed yet. This guide explains what needs to be done.

## Prerequisites

### 1. AWS Credentials
Ensure you're authenticated to AWS account **`720427058396`** (the deployment account).

```bash
aws sts get-caller-identity
```

Expected output:
```json
{
  "UserId": "AIDAI...",
  "Account": "720427058396",
  "Arn": "arn:aws:iam::720427058396:user/your-username"
}
```

**If you see a different account ID, STOP and switch profiles!**

---

## Step 1: Package Lambda Functions

### What This Does
Zips all Lambda functions for deployment to S3.

### Run This Command
```bash
npm run package-lambdas
```

**Or on Windows PowerShell:**
```powershell
.\package-lambdas.ps1
```

### Expected Outcome
Creates ZIP files in `aws-lambda/*/`:
```
aws-lambda/auth/signup-feature-77d07ae1.zip
aws-lambda/auth/verify-email-feature-77d07ae1.zip
aws-lambda/auth/define-auth-challenge-feature-77d07ae1.zip
aws-lambda/auth/create-auth-challenge-feature-77d07ae1.zip
aws-lambda/auth/verify-auth-challenge-feature-77d07ae1.zip
aws-lambda/auth/pre-sign-up-feature-77d07ae1.zip
aws-lambda/auth/custom-message-feature-77d07ae1.zip
aws-lambda/contact/contact-feature-77d07ae1.zip
```

---

## Step 2: Deploy CloudFormation Stacks

### What These Do
Deploy the AWS infrastructure in dependency order:
1. **IAM roles** → permissions for Lambdas to access Cognito/DynamoDB
2. **Database** → DynamoDB tables for OTP storage
3. **Lambda Code Bucket** → S3 bucket to store Lambda ZIPs
4. **Cognito Lambdas** → Pre-sign-up, custom-message, auth challenges
5. **Cognito User Pool** → Link triggers to Lambdas
6. **Storage/CDN** → S3 + CloudFront for website
7. **API Gateway** → REST API endpoint
8. **API Lambdas** → signup, check-user, verify-email, contact

### Run This Command
```bash
./infra/scripts/deploy-stacks.sh feature-77d07ae1
```

**Or on Windows PowerShell:**
```powershell
cd infra/scripts
# Convert .sh to PowerShell or use WSL
# For now, you'll need to deploy stacks manually via AWS Console or using AWS CLI
```

### What Should Happen
```
🚀 Starting CloudFormation deployment for environment: feature-77d07ae1
📍 Region: ap-south-1
📦 Assets bucket: growksh-website-ephemeral-assets-feature-77d07ae1
📦 Lambda bucket: growksh-website-lambda-code-feature-77d07ae1
⏱️  Timestamp: ...

Stage 1️⃣: IAM Roles
✅ Stack deployed: growksh-website-iam-feature-77d07ae1

Stage 2️⃣: Database
✅ Stack deployed: growksh-website-database-feature-77d07ae1
...
```

---

## Step 3: Upload Lambda Code to S3

### What This Does
Copies the Lambda ZIPs from Step 1 to the S3 bucket created in Step 2.

### Run This Command
```bash
./infra/scripts/build-and-upload-lambdas.sh feature-77d07ae1
```

**Or on Windows PowerShell:**
```powershell
cd infra/scripts
# Need to run this via WSL or translate to PowerShell
```

### Expected Outcome
All Lambda ZIPs are in S3:
```
s3://growksh-website-lambda-code-feature-77d07ae1/
  auth/signup-feature-77d07ae1.zip
  auth/verify-email-feature-77d07ae1.zip
  auth/define-auth-challenge-feature-77d07ae1.zip
  auth/create-auth-challenge-feature-77d07ae1.zip
  auth/verify-auth-challenge-feature-77d07ae1.zip
  auth/pre-sign-up-feature-77d07ae1.zip
  auth/custom-message-feature-77d07ae1.zip
  contact/contact-feature-77d07ae1.zip
```

---

## Step 4: Verify Deployment

### Check Lambda Functions Exist
```bash
aws lambda list-functions --region ap-south-1 --query "Functions[?contains(FunctionName, 'feature-77d07ae1')].FunctionName" --output table
```

Expected:
```
growksh-website-signup-feature-77d07ae1
growksh-website-verify-email-feature-77d07ae1
growksh-website-check-user-feature-77d07ae1
growksh-website-check-admin-feature-77d07ae1
growksh-website-contact-feature-77d07ae1
growksh-website-pre-sign-up-feature-77d07ae1
growksh-website-custom-message-feature-77d07ae1
growksh-website-define-auth-challenge-feature-77d07ae1
growksh-website-create-auth-challenge-feature-77d07ae1
growksh-website-verify-auth-challenge-feature-77d07ae1
```

### Check Cognito Triggers
```bash
aws cognito-idp describe-user-pool --user-pool-id ap-south-1_NiqhNWvf8 --region ap-south-1 --query 'UserPool.LambdaConfig' --output json
```

Expected output should show all 6 Lambda ARNs:
```json
{
  "PreSignUp": "arn:aws:lambda:ap-south-1:720427058396:function:growksh-website-pre-sign-up-feature-77d07ae1",
  "CustomMessage": "arn:aws:lambda:ap-south-1:720427058396:function:growksh-website-custom-message-feature-77d07ae1",
  "DefineAuthChallenge": "arn:aws:lambda:ap-south-1:720427058396:function:growksh-website-define-auth-challenge-feature-77d07ae1",
  "CreateAuthChallenge": "arn:aws:lambda:ap-south-1:720427058396:function:growksh-website-create-auth-challenge-feature-77d07ae1",
  "VerifyAuthChallengeResponse": "arn:aws:lambda:ap-south-1:720427058396:function:growksh-website-verify-auth-challenge-feature-77d07ae1",
  ...
}
```

---

## Step 5: Test the Deployment

### Test Signup
```bash
curl -X POST https://8hz8oz0aef.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

Expected: `201 Created` with CORS headers
```json
{
  "message": "User created successfully",
  "email": "test@example.com",
  "verified": true,
  "verificationEmailSent": false
}
```

### Test Check User
```bash
curl -X POST https://8hz8oz0aef.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/check-user \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Expected: `200 OK` with CORS headers
```json
{
  "exists": true
}
```

### Test Sign In (from Browser)
1. Hard refresh CloudFront: `Ctrl+Shift+R` on `https://d12jf2jvld5mg4.cloudfront.net/`
2. Go to Sign In page
3. Enter email: `test@example.com`
4. Should receive OTP via email (check spam folder)
5. Enter OTP → Should succeed

---

## Troubleshooting

### Issue: `Custom auth lambda trigger is not configured`
**Cause:** Cognito pool doesn't have triggers attached.

**Fix:** Ensure cognito-lambdas stack is deployed and Cognito stack has `EnableTriggers=true`.

```bash
aws cloudformation describe-stacks --stack-name growksh-website-cognito-feature-77d07ae1 \
  --region ap-south-1 --query 'Stacks[0].Parameters[?ParameterKey==`EnableTriggers`].ParameterValue'
```

Should return: `true`

### Issue: `/auth/signup` returns 500 without CORS
**Cause:** API Lambda stack isn't deployed.

**Fix:** Verify the stack exists:
```bash
aws cloudformation describe-stacks --stack-name growksh-website-api-lambdas-feature-77d07ae1 \
  --region ap-south-1 --query 'Stacks[0].StackStatus'
```

Should return: `CREATE_COMPLETE` or `UPDATE_COMPLETE`

### Issue: Lambda code is outdated
**Cause:** Old ZIPs in S3 bucket.

**Fix:** Delete old ZIPs and re-upload:
```bash
# Delete old
aws s3 rm s3://growksh-website-lambda-code-feature-77d07ae1/ --recursive --exclude "*" --include "*.zip"

# Repackage and upload
npm run package-lambdas
./infra/scripts/build-and-upload-lambdas.sh feature-77d07ae1
```

---

## Summary

| Step | Command | Deploys |
|------|---------|---------|
| 1 | `npm run package-lambdas` | Lambda ZIPs |
| 2 | `./infra/scripts/deploy-stacks.sh feature-77d07ae1` | All CloudFormation stacks |
| 3 | `./infra/scripts/build-and-upload-lambdas.sh feature-77d07ae1` | Code to S3 |
| 4 | (Verification) | N/A |
| 5 | (Browser test) | N/A |

Once all 5 steps complete, signup and sign-in should work!
