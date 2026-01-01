# Windows Deployment Guide

## Current Situation
The deployment scripts are written in Bash, which is not natively available on Windows PowerShell. To deploy the stack on Windows, you have several options:

## Option 1: Use GitHub Actions (RECOMMENDED)
GitHub Actions has bash available and will run automatically when you push to your feature branch.

```bash
git add .
git commit -m "fix: Set API_URL in runtime-config.js"
git push origin feat/admin
```

This will trigger the GitHub Actions workflow which will:
1. Build and upload Lambda functions
2. Deploy all CloudFormation stacks in order
3. Update runtime configuration
4. Invalidate CloudFront cache

## Option 2: Use WSL (Windows Subsystem for Linux)
If you have WSL installed:

```powershell
# In PowerShell, switch to bash/WSL
bash

# Then run the deployment script
cd /mnt/d/Growksh/growksh-website
./infra/scripts/deploy-stacks.sh feature-77d07ae1
```

## Option 3: Install Git Bash or MSYS2
If you have Git Bash or MSYS2 installed, you can run:

```bash
./infra/scripts/deploy-stacks.sh feature-77d07ae1
```

## Manual AWS CLI Deployment (Advanced)
If you need to deploy manually using AWS CLI, follow these steps:

### Step 1: Build and Upload Lambda Functions
```powershell
cd d:\Growksh\growksh-website

# Create build directory
New-Item -ItemType Directory -Path .build/lambda -Force

# Build each Lambda function and upload to S3
# This requires npm to be installed and S3 bucket to exist

# For now, use the AWS CLI to upload pre-built functions
```

### Step 2: Deploy Stacks in Order
The stacks must be deployed in this specific order due to dependencies:

1. **IAM Stack** (no dependencies)
   ```powershell
   aws cloudformation create-stack `
     --stack-name growksh-website-iam-feature-77d07ae1 `
     --template-body file://infra/cloudformation/00-iam-stack.yaml `
     --parameters ParameterKey=Environment,ParameterValue=feature-77d07ae1 `
     --capabilities CAPABILITY_NAMED_IAM `
     --region ap-south-1
   ```

2. **Database Stack** (depends on: IAM)
3. **Cognito Stack** (depends on: IAM)
4. **WAF Stack** (runs in us-east-1 region)
5. **Lambda Code Bucket Stack**
6. **Storage/CDN Stack**
7. **API Gateway Stack**
8. **Cognito Lambdas Stack**
9. **API Lambdas Stack**
10. **Route53 Stack** (if using custom domain)

## Recommended Approach

**Push to GitHub and let GitHub Actions handle the deployment:**

1. You've already fixed the API_URL in runtime-config.js
2. Commit and push your changes
3. GitHub Actions will automatically:
   - Build and test the application
   - Deploy all CloudFormation stacks
   - Upload updated assets to S3
   - Invalidate CloudFront cache

This is the most reliable and maintainable approach for your CI/CD pipeline.

## Next Steps

Option A (Recommended):
```bash
git add public/runtime-config.js
git commit -m "fix: Configure API_URL in runtime-config.js"
git push origin feat/admin
# GitHub Actions will handle deployment automatically
```

Option B (Manual):
- Install WSL or Git Bash
- Run: `./infra/scripts/deploy-stacks.sh feature-77d07ae1`

## Verification

After deployment completes, verify:

1. **Check CloudFormation Stack Status:**
   ```powershell
   aws cloudformation list-stacks --region ap-south-1 --query 'StackSummaries[?StackName==`growksh-website-iam-feature-77d07ae1`]'
   ```

2. **Check API Endpoint:**
   ```powershell
   aws cloudformation list-exports --region ap-south-1 --query 'Exports[?Name==`growksh-website-feature-77d07ae1-api-endpoint`]'
   ```

3. **Test Signup:**
   - Open the CloudFront distribution URL
   - Try signing up
   - The signup flow should now call the API successfully
