# Deployment Runbook

This runbook provides step-by-step instructions for deploying the Growksh Website infrastructure using CloudFormation and GitHub Actions.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Deployment Environments](#deployment-environments)
4. [Manual Deployment](#manual-deployment)
5. [Automated Deployment (GitHub Actions)](#automated-deployment-github-actions)
6. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
7. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required AWS Access
- AWS Account: `720427058396`
- AWS Region: `ap-south-1`
- IAM Role: `GrowkshDeveloperRole` with CloudFormation permissions

### Required Local Tools
- AWS CLI v2 (configured with OIDC or static credentials)
- Node.js 18+
- Git

### Required GitHub Configuration
- Repository Secret: `AWS_ROLE_ARN` = `arn:aws:iam::720427058396:role/GrowkshDeveloperRole`
- GitHub OIDC Provider configured in AWS IAM

---

## Architecture Overview

The Growksh Website infrastructure consists of 9 CloudFormation stacks deployed in dependency order:

```
┌─────────────────────────────────────────┐
│ Stage 1: Core Infrastructure            │
├─────────────────────────────────────────┤
│ • 00-iam-stack.yaml                     │
│   - AuthLambdaRole                      │
│   - CognitoTriggerRole                  │
│   - ContactLambdaRole                   │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Stage 2: Data & Auth Layer              │
├─────────────────────────────────────────┤
│ • 01-database-stack.yaml                │
│   - AuthOtpTable (DynamoDB)             │
│   - ContactsTable (DynamoDB)            │
│ • 02-cognito-stack.yaml                 │
│   - UserPool                            │
│   - UserPoolClient                      │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Stage 3: Security & Asset Management    │
├─────────────────────────────────────────┤
│ • 03-waf-stack.yaml (us-east-1 region) │
│   - AWS WAFv2 Web ACL                   │
│   - DDoS and bot protection             │
│ • 04-lambda-code-bucket-stack.yaml      │
│   - S3 bucket for Lambda code           │
│   - Lifecycle policies                  │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Stage 4: Frontend & API (Parallel)      │
├─────────────────────────────────────────┤
│ • 05-storage-cdn-stack.yaml             │
│   - S3 Bucket (Assets)                  │
│   - CloudFront Distribution             │
│   - SSL/TLS Certificate                 │
│ • 06-api-gateway-stack.yaml             │
│   - API Gateway                         │
│   - REST Endpoints                      │
│   - CloudWatch Logs                     │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Stage 5: Lambda Functions               │
├─────────────────────────────────────────┤
│ • 07-cognito-lambdas-stack.yaml         │
│   - PreSignUpFunction                   │
│   - CustomMessageFunction               │
│   - CreateAuthChallengeFunction         │
│   - VerifyAuthChallengeFunction         │
│ • 08-api-lambdas-stack.yaml             │
│   - SignupFunction                      │
│   - VerifyEmailFunction                 │
│   - ContactFunction                     │
│   - CheckAdminFunction                  │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Stage 6: DNS Management (AWS CLI)       │
├─────────────────────────────────────────┤
│ • Route53 DNS Records (UPSERT)          │
│   - Primary domain (growksh.com)        │
│   - WWW subdomain (www.growksh.com)     │
│   - CloudFront alias records            │
└─────────────────────────────────────────┘
```

**Total Resources**: ~50+ AWS resources (roles, tables, functions, API endpoints, WAF, CDN, DNS, etc.)

---

## Deployment Environments

### Development Environment (`dev`)
- **Branch**: `develop`
- **Trigger**: Push to develop
- **Approval**: None (automatic)
- **Stack Name Pattern**: `growksh-website-{component}-dev`
- **S3 Bucket**: `growksh-website-assets-dev`
- **CloudFront**: Auto-created and invalidated
- **Duration**: ~10-15 minutes
- **Cost**: ~$30-50/month

### Production Environment (`prod`)
- **Branch**: `main`
- **Trigger**: Push to main
- **Approval**: Manual approval required
- **Stack Name Pattern**: `growksh-website-{component}-prod`
- **S3 Bucket**: `growksh-website-assets-prod`
- **CloudFront**: Auto-created and invalidated
- **Duration**: ~10-15 minutes
- **Cost**: ~$50-100/month

### Ephemeral Environment (feature branches)
- **Branch**: `feature/*`
- **Trigger**: Push to feature branch
- **Approval**: None (automatic)
- **Stack Name Pattern**: `growksh-website-feature-{hash}-{component}`
- **S3 Bucket**: `growksh-website-feature-{hash}-assets`
- **CloudFront**: Auto-created
- **Duration**: ~10-15 minutes
- **Cost**: $0 after cleanup (deleted on PR close)
- **Auto-Cleanup**: Yes (on PR close)

---

## Manual Deployment

### Prerequisites for Manual Deployment

```bash
# Set AWS credentials
export AWS_ACCESS_KEY_ID="your-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="ap-south-1"

# Or use AWS profile
export AWS_PROFILE="your-profile"
```

### Deploy to Development

```bash
# Navigate to repository root
cd /path/to/growksh-website

# Make the deployment script executable
chmod +x infra/scripts/deploy-stacks.sh

# Deploy to dev environment
./infra/scripts/deploy-stacks.sh dev
```

**Expected Output:**
```
🚀 Starting CloudFormation deployment for environment: dev
📍 Region: ap-south-1

📋 Deployment Plan:
  1. growksh-website-iam-dev (IAM roles)
  2. growksh-website-database-dev (DynamoDB)
  3. growksh-website-cognito-dev (Cognito)
  ...

Stage 1️⃣: IAM Roles
✅ Stack deployed: growksh-website-iam-dev

[... more stages ...]

✅ All stacks deployed successfully!
```

### Deploy to Production

```bash
# Same as development, but with 'prod'
./infra/scripts/deploy-stacks.sh prod
```

**Note**: Always test in dev first before deploying to prod!

### Deploy Ephemeral Environment

```bash
# Deploy with a unique environment identifier
./infra/scripts/deploy-stacks.sh growksh-website-feature-abc123

# This creates:
# - growksh-website-feature-abc123-iam
# - growksh-website-feature-abc123-database
# - etc.
```

### Post-Deployment Configuration

After CloudFormation stacks are deployed, complete these manual steps:

#### 1. Enable CloudFront Free Plan (Production Only)

**Why**: Reduces CloudFront costs from pay-as-you-go to $0/month (includes 50GB free data transfer/month)

**Prerequisites**: AWS WAF Web ACL must be attached (✅ already configured by CloudFormation)

**Steps**:
1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Select your distribution (`growksh-website-storage-cdn-prod`)
3. Navigate to **"Plans and pricing"** tab (top menu)
4. Click **"Manage plan"**
5. Select **"Free plan"** option
6. Click **"Confirm"**
7. Wait 2-3 minutes for the change to apply

**Verification**:
```bash
# Verify Free plan is enabled (should show "Free plan ($0/month)")
aws cloudfront get-distribution \
  --id <DISTRIBUTION_ID> \
  --query 'Distribution.DistributionConfig.PriceClass' \
  --region ap-south-1
```

#### 2. Configure Custom Domains (If Using Custom Domain)

If you have a custom domain (e.g., `growksh.com`, `www.growksh.com`):

1. Have your ACM Certificate ARN ready (must be in `us-east-1` region)
2. Update parameter file `infra/cloudformation/parameters/prod-03-storage-cdn.json`:
   ```json
   [
     {
       "ParameterKey": "Environment",
       "ParameterValue": "prod"
     },
     {
       "ParameterKey": "BucketName",
       "ParameterValue": "growksh-website-assets-prod"
     },
     {
       "ParameterKey": "DomainNames",
       "ParameterValue": "growksh.com,www.growksh.com"
     },
     {
       "ParameterKey": "CertificateArn",
       "ParameterValue": "arn:aws:acm:us-east-1:720427058396:certificate/xxxxx"
     }
   ]
   ```
3. Redeploy the storage stack:
   ```bash
   aws cloudformation deploy \
     --template-file infra/cloudformation/03-storage-cdn-stack.yaml \
     --stack-name growksh-website-storage-cdn-prod \
     --parameter-overrides file://infra/cloudformation/parameters/prod-03-storage-cdn.json \
     --capabilities CAPABILITY_NAMED_IAM \
     --region ap-south-1
   ```
4. Update your DNS provider to point your domain to CloudFront:
   - CNAME: `growksh.com` → `d1234567890abc.cloudfront.net`
   - CNAME: `www.growksh.com` → `d1234567890abc.cloudfront.net`

---

## Automated Deployment (GitHub Actions)

### Development Deployment

Triggered automatically when pushing to `develop` branch:

```bash
# 1. Create and push to develop
git checkout develop
git pull origin develop
git merge feature/your-feature
git push origin develop

# 2. GitHub Actions automatically:
#    ✓ Validates CloudFormation templates
#    ✓ Deploys all 9 stacks
#    ✓ Updates Route53 DNS records
#    ✓ Builds frontend
#    ✓ Uploads to S3
#    ✓ Invalidates CloudFront cache
#    ✓ Posts deployment status
```

**Monitor Progress:**
- Go to https://github.com/Growksh-Alphalabs/growksh-website/actions
- Click on latest "Deploy to Development" run
- Watch real-time logs

**Expected Duration**: 10-15 minutes

### Production Deployment

Triggered when pushing to `main` branch (requires approval):

```bash
# 1. Ensure develop is stable
git checkout develop
git pull origin develop

# 2. Merge develop to main
git checkout main
git pull origin main
git merge develop
git push origin main

# 3. GitHub Actions:
#    ✓ Validates CloudFormation templates
#    ✓ Waits for manual approval
#    ✓ (Manually approve in GitHub UI)
#    ✓ Deploys all 9 stacks to prod
#    ✓ Updates Route53 DNS records
#    ✓ Builds frontend
#    ✓ Uploads to S3
#    ✓ Invalidates CloudFront cache
#    ✓ Creates GitHub Release with deployment info
```

**Manual Approval Step:**
1. Go to https://github.com/Growksh-Alphalabs/growksh-website/actions
2. Click on the latest "Deploy to Production" run
3. Click "Review deployments"
4. Select "production" environment
5. Click "Approve and deploy"

**Expected Duration**: 10-15 minutes (after approval)

### Ephemeral Deployment (Feature Branches)

Triggered automatically when pushing to `feature/*` branches:

```bash
# 1. Create and push feature branch
git checkout -b feature/my-feature
# ... make changes ...
git push origin feature/my-feature

# 2. GitHub Actions automatically:
#    ✓ Generates unique environment hash
#    ✓ Validates CloudFormation templates
#    ✓ Deploys stacks (growksh-website-feature-{hash}-*)
#    ✓ Builds frontend
#    ✓ Uploads to S3
#    ✓ Comments PR with deployment URLs
#    ✓ Provides test environment

# 3. Create Pull Request
# GitHub comment will show:
#    - Frontend URL
#    - API endpoint
#    - Stack names

# 4. Test the feature...

# 5. Merge PR
git checkout develop
git merge feature/my-feature
git push origin develop

# 6. GitHub Actions automatically:
#    ✓ Deletes all ephemeral stacks
#    ✓ Empties S3 bucket
#    ✓ Cleans up CloudFront distributions
```

---

## Monitoring & Troubleshooting

### Monitor Deployment Progress

**Option 1: GitHub Actions UI**
```
https://github.com/Growksh-Alphalabs/growksh-website/actions
```

**Option 2: AWS CloudFormation Console**
```
https://console.aws.amazon.com/cloudformation/home?region=ap-south-1
```

**Option 3: AWS CLI**
```bash
# List all stacks for dev environment
aws cloudformation list-stacks \
  --region ap-south-1 \
  --query "StackSummaries[?contains(StackName, 'dev')]" \
  --output table

# Get specific stack details
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1

# Watch events in real-time
aws cloudformation describe-stack-events \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --query "StackEvents" \
  --output table
```

### Common Issues & Solutions

#### Issue: Stack Creation Timeout
**Cause**: Deployment taking too long
**Solution**:
- Check CloudFormation events for stuck resources
- Delete and retry
- Check AWS service quotas

#### Issue: IAM Permission Denied
**Cause**: Role doesn't have required permissions
**Solution**:
- Verify `GrowkshDeveloperRole` has all policies
- Check trust relationship with GitHub OIDC

#### Issue: S3 Bucket Already Exists
**Cause**: Bucket name collision (bucket names are globally unique)
**Solution**:
- Delete old bucket first: `aws s3 rb s3://growksh-website-assets-dev --force`
- Or use unique bucket naming

#### Issue: CloudFormation Template Error
**Cause**: Invalid YAML or missing parameters
**Solution**:
- Run `cfn-lint infra/cloudformation/*.yaml`
- Check parameter files for correct values
- Validate syntax in CloudFormation UI

---

## Rollback Procedures

### Rollback Development Environment

```bash
# Option 1: Redeploy previous CloudFormation templates
./infra/scripts/deploy-stacks.sh dev

# Option 2: Delete specific stack and redeploy
aws cloudformation delete-stack \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1

# Wait for deletion
aws cloudformation wait stack-delete-complete \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1

# Redeploy
./infra/scripts/deploy-stacks.sh dev
```

### Rollback Production Environment

**Caution**: Production rollbacks require careful planning!

```bash
# Option 1: Revert code and redeploy
git revert <commit-hash>
git push origin main
# GitHub Actions will automatically deploy the reverted code

# Option 2: Use CloudFormation change sets
# 1. Create a change set with the previous template
# 2. Review changes
# 3. Execute change set

# Option 3: Manual CloudFormation update
aws cloudformation update-stack \
  --stack-name growksh-website-storage-cdn-prod \
  --template-body file://infra/cloudformation/03-storage-cdn-stack.yaml \
  --parameters file://infra/cloudformation/parameters/prod-03-storage-cdn.json \
  --region ap-south-1
```

### Verify Rollback

```bash
# Check stack status
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-prod \
  --region ap-south-1 \
  --query "Stacks[0].StackStatus" \
  --output text

# Expected output: UPDATE_COMPLETE or CREATE_COMPLETE
```

---

## Useful Commands Reference

```bash
# List all stacks
aws cloudformation list-stacks --region ap-south-1

# Get stack outputs
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --query "Stacks[0].Outputs" \
  --region ap-south-1

# Get CloudFront domain
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text \
  --region ap-south-1

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

# Delete a stack
aws cloudformation delete-stack \
  --stack-name growksh-website-iam-dev \
  --region ap-south-1

# Validate templates
cfn-lint infra/cloudformation/*.yaml
```

---

## Support & Escalation

**For deployment issues:**
1. Check CloudFormation events in AWS Console
2. Review GitHub Actions logs
3. Check CloudFront and S3 configurations
4. Verify IAM permissions

**For emergencies:**
- Immediately delete problem stack
- Revert code changes
- Re-deploy stable version
- Post-incident review

---

**Last Updated**: Dec 24, 2025
**Version**: 1.0
**Maintained By**: Engineering Team
