# Quick Deployment Reference

## TL;DR - Account-Specific Constants

These values **must be provided** or determined **before** deployment:

| Constant | Example | How to Get/Set |
|----------|---------|---|
| **AWS Account ID** | `720427058396` | `aws sts get-caller-identity --query Account --output text` |
| **AWS Region** | `ap-south-1` | Configure via `aws configure` or pass `--region` |
| **Environment Name** | `prod`, `staging`, `dev`, `feature-123` | You choose |
| **SES Verified Email** | `noreply@growksh.com` | Must exist in AWS SES for the region |
| **Verify Secret** | `CQxrZPyIjvXwMcNpzHaFDdASkWLYqthO` | Generate: `openssl rand -base64 32` |
| **Frontend Domain** | `https://growksh.com` | You own/manage |
| **VerifyBaseUrl** | `https://growksh.com/auth/verify-email` | Derived from frontend domain |

## Deployment Command (Simplest)

### PowerShell (Windows):
```powershell
cd d:\Growksh\growksh-website
.\infra\scripts\deploy.ps1 -Environment prod -Region ap-south-1 -SESEmail noreply@growksh.com
```

### Bash/Python (Linux/Mac):
```bash
cd ~/growksh-website
python3 infra/scripts/deploy.py --environment prod --region ap-south-1 --ses-email noreply@growksh.com
```

## Environment-Specific Deployments

### Development (AWS Account: 720427058396)
```powershell
.\infra\scripts\deploy.ps1 `
  -Environment dev `
  -Region ap-south-1 `
  -SESEmail noreply@growksh.com `
  -VerifyBaseUrl "https://dev.growksh.com/auth/verify-email"
```

### Staging (Your Staging Account)
```powershell
# First, configure AWS CLI for staging account
aws configure --profile staging

# Then deploy
.\infra\scripts\deploy.ps1 `
  -Environment staging `
  -Region us-east-1 `
  -SESEmail noreply@growksh.com `
  -VerifyBaseUrl "https://staging.growksh.com/auth/verify-email"
```

### Production (Your Production Account)
```powershell
# First, configure AWS CLI for prod account
aws configure --profile prod

# Then deploy
.\infra\scripts\deploy.ps1 `
  -Environment prod `
  -Region us-east-1 `
  -SESEmail noreply@growksh.com `
  -VerifyBaseUrl "https://growksh.com/auth/verify-email"
```

## Post-Deployment Configuration

After stacks deploy, get the auto-generated values:

```powershell
$stackName = "growksh-website-cognito-prod"
$region = "us-east-1"

# Get Cognito User Pool ID
$poolId = aws cloudformation describe-stacks `
  --stack-name $stackName --region $region `
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' --output text

# Get Cognito Client ID
$clientId = aws cloudformation describe-stacks `
  --stack-name $stackName --region $region `
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' --output text

# Get API Endpoint
$apiEndpoint = aws cloudformation describe-stacks `
  --stack-name "growksh-website-api-prod" --region $region `
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' --output text

Write-Host "VITE_COGNITO_USER_POOL_ID: $poolId"
Write-Host "VITE_COGNITO_CLIENT_ID: $clientId"
Write-Host "VITE_API_URL: $apiEndpoint"
```

Then update `public/runtime-config.js`:
```javascript
window.__GROWKSH_RUNTIME_CONFIG__ = {
  VITE_COGNITO_USER_POOL_ID: 'ap-south-1_J0S26HesM',
  VITE_COGNITO_CLIENT_ID: '3cviqovg35pjt8n9e90gp8pum4',
  VITE_API_URL: 'https://8hz8oz0aef.execute-api.ap-south-1.amazonaws.com/prod',
  VITE_AWS_REGION: 'ap-south-1',
};
```

## Pre-Requisites Checklist

Before running deployment script:

- [ ] AWS CLI configured (`aws configure`)
- [ ] AWS credentials have CloudFormation, Lambda, API Gateway, Cognito, IAM, SES permissions
- [ ] SES email verified: `aws ses verify-email-identity --email-address noreply@growksh.com --region ap-south-1`
- [ ] Lambda code packaged and uploaded to S3
- [ ] Frontend domain/URL determined
- [ ] Decide on environment name (dev/staging/prod/feature-123)

## What Gets Created Automatically

| Resource | Parameter | Where to Find |
|----------|-----------|---|
| Cognito User Pool | `VITE_COGNITO_USER_POOL_ID` | CloudFormation Stack Outputs |
| Cognito App Client | `VITE_COGNITO_CLIENT_ID` | CloudFormation Stack Outputs |
| API Gateway | `VITE_API_URL` | CloudFormation Stack Outputs |
| Lambda Functions | ARNs exported | Between stacks via CloudFormation Exports |
| S3 Bucket (if needed) | Named automatically | AWS Console → S3 |
| IAM Roles | For each Lambda | Created by CloudFormation |

## Troubleshooting

**Error: "Parameter VerifySecret is too short"**
- Provide a 32+ character random string: `openssl rand -base64 32`

**Error: "Email not verified in SES"**
- Run: `aws ses verify-email-identity --email-address noreply@growksh.com --region ap-south-1`

**Error: "Access Denied on CloudFormation"**
- Ensure your AWS user has CloudFormation, Lambda, IAM:PassRole permissions

**Error: "Lambda code not found in S3"**
- Package and upload Lambdas: `cd aws-lambda && make package && make upload`

**Error: "Stack failed to create"**
- Check CloudFormation events: `aws cloudformation describe-stack-events --stack-name <stack-name>`
- Check Lambda logs: `aws logs tail /aws/lambda/<function-name> --follow`

## What Changes Between Environments

| Item | Dev | Staging | Prod |
|------|-----|---------|------|
| Environment Name | `dev` | `staging` | `prod` |
| AWS Region | `ap-south-1` | `us-east-1` | `us-east-1` |
| Frontend URL | `https://dev.growksh.com` | `https://staging.growksh.com` | `https://growksh.com` |
| VerifyBaseUrl | `https://dev.growksh.com/auth/verify-email` | `https://staging.growksh.com/auth/verify-email` | `https://growksh.com/auth/verify-email` |
| SES Email | `noreply@growksh.com` | `noreply@growksh.com` | `noreply@growksh.com` |
| Lambda Code Bucket | `growksh-website-lambda-code-dev` | `growksh-website-lambda-code-staging` | `growksh-website-lambda-code-prod` |

## What NEVER Changes (Account-Specific)

| Item | Value | Why |
|------|-------|-----|
| VerifySecret | Random string | HMAC key—must be same across all stacks in same deployment |
| SES Email | Verified email | Must match your domain's verified SES identity |
| AWS Account ID | Your account | Auto-detected, can't change |
| AWS Region | Your region choice | You choose based on where infrastructure should live |

