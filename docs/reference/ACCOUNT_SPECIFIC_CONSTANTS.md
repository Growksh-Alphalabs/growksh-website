# Account-Specific Constants Reference

## Overview
This document lists all values that are **account-specific** and must be explicitly provided during deployment. These values vary between AWS accounts, regions, and environments.

---

## Mandatory Constants (Must Provide Before Deployment)

### 1. AWS Account ID
**What it is**: Your AWS account identifier  
**Format**: 12-digit number (e.g., `720427058396`)  
**How to get it**:
```bash
aws sts get-caller-identity --query Account --output text
```
**Used by**: CloudFormation for resource ARNs, IAM roles  
**Impact**: If wrong, all resources created in wrong account  
**Can this be parameterized?**: ❌ No—must match CLI credentials  
**How it's handled**: Auto-detected by CloudFormation pseudo-parameter `${AWS::AccountId}`

---

### 2. AWS Region
**What it is**: Geographic region where infrastructure deploys  
**Format**: Region code (e.g., `ap-south-1`, `us-east-1`)  
**How to set it**:
```bash
aws configure --region ap-south-1
# OR pass during deploy
--region ap-south-1
```
**Used by**: API Gateway, Lambda, SES, S3 buckets, Cognito  
**Impact**: Services in different regions are isolated  
**Can this be parameterized?**: ❌ No—determined by CLI config or `--region` flag  
**How it's handled**: Auto-detected by CloudFormation pseudo-parameter `${AWS::Region}`

**Supported Regions**:
- `ap-south-1` (Mumbai, India) ← Default for Growksh
- `us-east-1` (N. Virginia, USA)
- `eu-west-1` (Ireland, Europe)
- `ap-southeast-1` (Singapore)

---

### 3. Environment Name
**What it is**: Logical environment identifier  
**Format**: String without spaces (e.g., `dev`, `staging`, `prod`, `feature-xyz`)  
**How to provide it**:
```powershell
.\infra\scripts\deploy.ps1 -Environment prod
```
```bash
python3 infra/scripts/deploy.py --environment prod
```
**Used by**: Resource naming, stack naming, separating deployments  
**Examples**:
- `dev` → Resources: `growksh-website-cognito-dev`
- `prod` → Resources: `growksh-website-cognito-prod`
- `feature-77d07ae1` → Resources: `growksh-website-cognito-feature-77d07ae1`

**Can this be parameterized?**: ✅ Yes—in deployment scripts and CloudFormation templates  
**How it's handled**: Passed via `--parameter-overrides Environment=<value>`

---

### 4. SES Verified Email
**What it is**: Email address verified in AWS SES for sending emails  
**Format**: Valid email (e.g., `noreply@growksh.com`)  
**How to verify it**:
```bash
aws ses verify-email-identity --email-address noreply@growksh.com --region ap-south-1
# OR verify entire domain
aws ses verify-domain-identity --domain growksh.com --region ap-south-1
```
**Used by**: Cognito Lambda to send OTP and verification emails  
**Impact**: Without this, email sending fails  
**Can this be parameterized?**: ✅ Yes—via `SESSourceEmail` parameter (default: `noreply@growksh.com`)

**Verification Status**:
```bash
# Check verified identities
aws ses list-identities --region ap-south-1

# Check specific email
aws ses get-identity-verification-attributes --identities noreply@growksh.com --region ap-south-1
```

**Production Consideration**: By default, AWS SES accounts start in **Sandbox Mode**—can only send to verified identities. Request production access via AWS Support.

---

### 5. Verify Secret (HMAC Key)
**What it is**: 32+ character random string for signing verification links  
**Format**: Random alphanumeric (e.g., `CQxrZPyIjvXwMcNpzHaFDdASkWLYqthO`)  
**How to generate it**:
```powershell
# PowerShell
$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
$secret = -join ((1..32) | ForEach-Object { $chars[(Get-Random -Maximum $chars.Length)] })
Write-Host $secret
```
```bash
# Bash
openssl rand -base64 32 | tr -d '=+/' | cut -c1-32
```

**Used by**:
- Stack 07 (Cognito Lambdas): Signing verification link in email
- Stack 08 (API Lambdas): Verifying signature on verification link

**CRITICAL**: Must be **identical** in both stacks  
**Can this be parameterized?**: ✅ Yes—via `VerifySecret` parameter  
**Impact if mismatched**: Users cannot verify email after signup

---

### 6. Frontend Domain (VerifyBaseUrl)
**What it is**: Your frontend's domain for email verification link  
**Format**: Full HTTPS URL (e.g., `https://growksh.com/auth/verify-email`)  
**Examples by environment**:
- Development: `https://dev.growksh.com/auth/verify-email`
- Staging: `https://staging.growksh.com/auth/verify-email`
- Production: `https://growksh.com/auth/verify-email`

**How to set it**:
```powershell
.\infra\scripts\deploy.ps1 -Environment prod -VerifyBaseUrl "https://growksh.com/auth/verify-email"
```

**Used by**: Email verification link generation in custom-message Lambda  
**Can this be parameterized?**: ✅ Yes—via `VerifyBaseUrl` parameter  
**Impact if wrong**: Users click email link, goes to wrong domain or 404

---

### 7. Lambda Code S3 Bucket
**What it is**: S3 bucket containing packaged Lambda ZIP files  
**Format**: S3 bucket name (e.g., `growksh-website-lambda-code-dev`)  
**Two options**:

**Option A: Pre-existing bucket**
```powershell
.\infra\scripts\deploy.ps1 -Environment prod -LambdaCodeBucket "my-existing-bucket"
```
- Bucket must already exist
- Must contain correct ZIP files in correct paths
- Must be accessible by CloudFormation

**Option B: Auto-create (default)**
```powershell
.\infra\scripts\deploy.ps1 -Environment prod
# Creates: growksh-website-lambda-code-prod-ap-south-1
```
- CloudFormation creates bucket automatically
- Bucket named: `growksh-website-lambda-code-${Environment}-${Region}`

**Bucket Name Constraints**:
- Must be globally unique across all AWS accounts
- Max 63 characters
- Only lowercase letters, numbers, hyphens
- Must start/end with letter or number

**Naming Formula**:
```
growksh-website-lambda-code-{Environment}-{Region}
growksh-website-lambda-code-prod-ap-south-1  (54 chars) ✅
growksh-website-lambda-code-dev-us-east-1    (51 chars) ✅
```

**Can this be parameterized?**: ✅ Yes—via `LambdaCodeBucketName` parameter  
**Impact if wrong**: Lambda functions won't deploy (code not found)

---

### 8. Lambda Code Source Environment
**What it is**: Environment suffix used when packaging Lambda code  
**Format**: Environment name (e.g., `dev`, `prod`)  
**How to set it**:
```powershell
.\infra\scripts\deploy.ps1 -Environment prod -LambdaCodeSourceEnv dev
```

**Purpose**: Separates where code is packaged from where it's deployed  
**Use case**: Package code once as `dev`, deploy to `dev`, `staging`, `prod`

**S3 Key Pattern**:
```
Code packaged as 'dev':
  auth/signup-dev.zip
  auth/custom-message-dev.zip

Can deploy to any environment:
  Stack 07 with LambdaCodeSourceEnv=dev, Environment=staging
  Looks for: auth/signup-dev.zip ✅
  → Works, uses dev-packaged code in staging
```

**Can this be parameterized?**: ✅ Yes—via `LambdaCodeSourceEnv` parameter (default: same as Environment)  
**Impact if wrong**: Lambda deployment fails if ZIP file doesn't exist at expected path

---

## Auto-Generated Values (No Action Needed)

These are generated by CloudFormation and should be captured after deployment:

### Cognito User Pool ID
**What it is**: Unique identifier for Cognito user pool  
**Format**: Region + ID (e.g., `ap-south-1_J0S26HesM`)  
**How to get it**:
```bash
aws cloudformation describe-stacks --stack-name growksh-website-cognito-prod --region ap-south-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' --output text
```
**Used by**: Frontend (VITE_COGNITO_USER_POOL_ID)  
**Captured in**: `public/runtime-config.js`

---

### Cognito App Client ID
**What it is**: OAuth client identifier within user pool  
**Format**: Random string (e.g., `3cviqovg35pjt8n9e90gp8pum4`)  
**How to get it**:
```bash
aws cloudformation describe-stacks --stack-name growksh-website-cognito-prod --region ap-south-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' --output text
```
**Used by**: Frontend (VITE_COGNITO_CLIENT_ID)  
**Captured in**: `public/runtime-config.js`

---

### API Gateway Endpoint
**What it is**: HTTPS URL for API Gateway  
**Format**: AWS-generated URL (e.g., `https://8hz8oz0aef.execute-api.ap-south-1.amazonaws.com/prod`)  
**How to get it**:
```bash
aws cloudformation describe-stacks --stack-name growksh-website-api-prod --region ap-south-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' --output text
```
**Used by**: Frontend (VITE_API_URL)  
**Captured in**: `public/runtime-config.js`

---

### Lambda Function ARNs
**What it is**: Full resource names for all Lambda functions  
**Format**: `arn:aws:lambda:region:account:function:name`  
**Exported by**: Stacks 07 & 08  
**Used by**: Stack 06 (API Gateway) via `Fn::ImportValue`  
**How they're referenced**:
```yaml
ContactLambdaArn: !ImportValue 'growksh-website-${Environment}-contact-lambda-arn'
```

---

## Summary Table

| Constant | Type | Required? | Parameterizable? | Auto-Detected? | Must Be Same Across Environments? |
|----------|------|-----------|------------------|--------|-----|
| AWS Account ID | Credentials | ✅ Yes | ❌ No | ✅ Yes | ❌ No (account-specific) |
| AWS Region | Deployment | ✅ Yes | ❌ No | ✅ Yes | ❌ No (region-specific) |
| Environment Name | Parameter | ✅ Yes | ✅ Yes | ❌ No | ❌ No (env-specific) |
| SES Email | Configuration | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes (same sender) |
| Verify Secret | Secret | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes (both stacks) |
| VerifyBaseUrl | Configuration | ✅ Yes | ✅ Yes | ❌ No | ❌ No (env-specific) |
| Lambda Code Bucket | Configuration | ⚠️ Optional | ✅ Yes | ✅ Auto-create | ✅ Yes (shared code) |
| Lambda Code Source Env | Parameter | ⚠️ Optional | ✅ Yes | Uses Environment | ⚠️ Can be shared |
| Cognito Pool ID | Generated | (Output) | ❌ No | ✅ Yes | ❌ No (per env) |
| Cognito Client ID | Generated | (Output) | ❌ No | ✅ Yes | ❌ No (per env) |
| API Gateway Endpoint | Generated | (Output) | ❌ No | ✅ Yes | ❌ No (per env) |

---

## Deployment Checklist

Before deploying, verify these constants are available:

- [ ] **AWS Account ID**: `aws sts get-caller-identity --query Account --output text`
- [ ] **AWS Region**: Decide (ap-south-1, us-east-1, etc.)
- [ ] **Environment Name**: Choose (dev, staging, prod, feature-xxx)
- [ ] **SES Email Verified**: `aws ses verify-email-identity --email-address noreply@growksh.com`
- [ ] **Verify Secret Generated**: 32+ random chars
- [ ] **Frontend Domain Known**: Where will frontend be hosted?
- [ ] **VerifyBaseUrl Decided**: Frontend URL + `/auth/verify-email`
- [ ] **Lambda Code**: Packaged and uploaded to S3 (or let CloudFormation create bucket)
- [ ] **Lambda Code Source Env**: Decided (usually `dev` for all environments)

---

## Quick Reference: Pre-Deployment Values

```powershell
# Windows PowerShell: Fill in these before deploying
$AWSAccountId = $(aws sts get-caller-identity --query Account --output text)
$AWSRegion = "ap-south-1"
$Environment = "prod"
$SESEmail = "noreply@growksh.com"
$VerifySecret = "CQxrZPyIjvXwMcNpzHaFDdASkWLYqthO"  # Generate this
$FrontendDomain = "https://growksh.com"
$VerifyBaseUrl = "$FrontendDomain/auth/verify-email"
$LambdaCodeSourceEnv = "dev"

Write-Host "AWS Account: $AWSAccountId"
Write-Host "AWS Region: $AWSRegion"
Write-Host "Environment: $Environment"
Write-Host "Frontend: $FrontendDomain"
Write-Host "Verify Base URL: $VerifyBaseUrl"

# Then deploy
.\infra\scripts\deploy.ps1 `
  -Environment $Environment `
  -Region $AWSRegion `
  -SESEmail $SESEmail `
  -VerifyBaseUrl $VerifyBaseUrl `
  -VerifySecret $VerifySecret `
  -LambdaCodeSourceEnv $LambdaCodeSourceEnv
```

