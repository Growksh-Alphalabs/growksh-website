# Phase 3: Testing & Validation Guide

This guide provides step-by-step instructions for testing the new CloudFormation-based deployment workflows.

## Overview

Phase 3 validation covers:
1. ✅ CloudFormation template syntax
2. ✅ Development environment deployment
3. ✅ Ephemeral environment creation and cleanup
4. ✅ Production environment deployment
5. ✅ Frontend functionality testing
6. ✅ Auth flow testing
7. ✅ Rollback procedures

**Estimated Duration**: 2-4 hours (depending on testing thoroughness)

---

## Pre-Testing Checklist

- [ ] AWS credentials configured (OIDC or static)
- [ ] Repository has `AWS_ROLE_ARN` secret configured
- [ ] All CloudFormation templates committed to git
- [ ] All deployment scripts have execute permissions
- [ ] `cfn-lint` installed locally
- [ ] `aws-cli` v2 installed and configured
- [ ] Node.js 18+ installed
- [ ] Git configured with correct credentials

---

## Test 1: CloudFormation Template Validation

**Objective**: Verify all templates have valid YAML syntax and CloudFormation semantics

### Local Validation

```bash
# Install cfn-lint
pip install cfn-lint

# Validate all templates
cfn-lint infra/cloudformation/*.yaml -t

# Expected output:
# No errors should be reported
```

### Expected Results
- ✅ No YAML syntax errors
- ✅ No CloudFormation logical errors
- ✅ All resource types valid
- ✅ All references (imports/exports) valid

### Troubleshooting
If errors are found:
1. Review the specific template file
2. Check for indentation issues
3. Verify resource properties against CloudFormation docs
4. Fix and re-validate

---

## Test 2: Development Environment Deployment

**Objective**: Deploy all stacks to dev environment and verify functionality

### 2.1 Manual Stack Deployment

```bash
# Navigate to repo
cd /path/to/growksh-website

# Make script executable
chmod +x infra/scripts/deploy-stacks.sh

# Deploy to dev
./infra/scripts/deploy-stacks.sh dev

# Monitor in another terminal
# aws cloudformation list-stacks --region ap-south-1 | grep dev
```

**Expected Output:**
```
🚀 Starting CloudFormation deployment for environment: dev
[Stage 1: IAM Roles]
✅ Stack deployed: growksh-website-iam-dev
[Stage 2: Database]
✅ Stack deployed: growksh-website-database-dev
...
✅ All stacks deployed successfully!
```

**Duration**: 10-15 minutes

### 2.2 Verify Dev Stack Creation

```bash
# List all dev stacks
aws cloudformation describe-stacks \
  --region ap-south-1 \
  --query "Stacks[?contains(StackName, 'dev')].{Name:StackName,Status:StackStatus}" \
  --output table
```

**Expected Output:**
```
| Name                                   | Status            |
|----------------------------------------|-------------------|
| growksh-website-iam-dev                | CREATE_COMPLETE   |
| growksh-website-database-dev           | CREATE_COMPLETE   |
| growksh-website-cognito-dev            | CREATE_COMPLETE   |
| growksh-website-storage-cdn-dev        | CREATE_COMPLETE   |
| growksh-website-api-dev                | CREATE_COMPLETE   |
| growksh-website-cognito-lambdas-dev    | CREATE_COMPLETE   |
| growksh-website-api-lambdas-dev        | CREATE_COMPLETE   |
```

### 2.3 Get Dev Deployment URLs

```bash
# Get CloudFront domain
CLOUDFRONT=$(aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text)

echo "Frontend URL: https://$CLOUDFRONT"

# Get API endpoint
API=$(aws cloudformation describe-stacks \
  --stack-name growksh-website-api-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text)

echo "API Endpoint: $API"
```

### 2.4 Build and Upload Frontend

```bash
# Install dependencies
npm ci

# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://growksh-website-assets-dev/ --delete

# Invalidate CloudFront
DISTRIBUTION=$(aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CdnDistributionId'].OutputValue" \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION" \
  --paths "/*"
```

### 2.5 Test Development Frontend

```bash
# In browser, navigate to:
https://<CLOUDFRONT_DOMAIN>

# Expected:
✅ Page loads successfully
✅ No CORS errors in console
✅ Logo and layout visible
✅ Auth buttons present
```

### 2.6 Verify AWS Resources

```bash
# Check DynamoDB tables exist
aws dynamodb list-tables \
  --region ap-south-1 \
  --query "TableNames[?contains(@, 'dev')]" \
  --output table

# Check Cognito User Pool exists
aws cognito-idp list-user-pools \
  --max-results 60 \
  --region ap-south-1 \
  --query "UserPools[?contains(Name, 'dev')]" \
  --output table

# Check Lambda functions exist
aws lambda list-functions \
  --region ap-south-1 \
  --query "Functions[?contains(FunctionName, 'dev')].FunctionName" \
  --output table
```

**Expected Results:**
- ✅ 2 DynamoDB tables (auth-otp, contacts)
- ✅ 1 Cognito User Pool
- ✅ 10 Lambda functions total
- ✅ All resources tagged with App=Website, Partner=Growksh, Env=dev

---

## Test 3: Ephemeral Environment (Feature Branch)

**Objective**: Deploy feature branch environment and verify auto-cleanup

### 3.1 Create Feature Branch

```bash
# Create feature branch
git checkout -b feature/phase3-testing

# Make a test change
echo "# Phase 3 Testing" >> README.md

# Commit and push
git add .
git commit -m "Phase 3 testing feature"
git push origin feature/phase3-testing
```

### 3.2 Monitor GitHub Actions

```
1. Go to https://github.com/Growksh-Alphalabs/growksh-website/actions
2. Watch "Deploy to Ephemeral Environment" workflow
3. Should see:
   - ✅ Template validation
   - ✅ Stack deployment
   - ✅ Frontend build
   - ✅ PR comment with URLs
```

**Expected Duration**: 10-15 minutes

### 3.3 Create Pull Request

```bash
# Create PR via GitHub UI
1. Go to https://github.com/Growksh-Alphalabs/growksh-website/pulls
2. Create new PR: feature/phase3-testing → develop
3. GitHub Actions should comment with:
   - Environment name (growksh-website-feature-{hash})
   - Frontend URL
   - API endpoint
```

### 3.4 Test Ephemeral Environment

```bash
# Get URLs from GitHub PR comment
# Test frontend loads
# Test API endpoints work
# Test auth flow
```

### 3.5 Verify Cleanup

```bash
# Merge PR
1. Go to GitHub PR
2. Click "Merge pull request"
3. Confirm merge to develop

# Watch cleanup workflow
1. Go to Actions
2. Watch "Deploy to Ephemeral Environment" cleanup job
3. Should see:
   - ✅ Stack deletion starting
   - ✅ Stack deletion complete
   - ✅ S3 bucket cleanup

# Verify cleanup
aws cloudformation describe-stacks \
  --region ap-south-1 \
  --query "Stacks[?StackStatus!='DELETE_COMPLETE' && contains(StackName, 'feature')].StackName" \
  --output table

# Expected: No results (all cleaned up)
```

---

## Test 4: GitHub Actions Workflow (Dev)

**Objective**: Verify develop branch deployment workflow

### 4.1 Prepare and Push to Develop

```bash
# Create test commit
git checkout feature/phase3-testing
echo "Test content" >> test.txt
git add test.txt
git commit -m "test: phase 3 validation"

# Merge to develop
git checkout develop
git pull origin develop
git merge feature/phase3-testing
git push origin develop
```

### 4.2 Monitor Deployment

```
1. Go to Actions
2. Watch "Deploy to Development" workflow
3. Should see:
   - ✅ Checkout code
   - ✅ Validate templates
   - ✅ Deploy stacks
   - ✅ Build frontend
   - ✅ Upload to S3
   - ✅ Invalidate CloudFront
```

**Expected Duration**: 15-20 minutes total

### 4.3 Verify Updated Dev Environment

```bash
# Get updated CloudFront domain
CLOUDFRONT=$(aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text)

# Test frontend loads (should reflect new build)
curl https://$CLOUDFRONT/

# Check S3 bucket has new files
aws s3 ls s3://growksh-website-assets-dev/ --recursive | tail -20
```

---

## Test 5: Manual Production Deployment

**Objective**: Verify production deployment with approval gate

### 5.1 Prepare Production Branch

```bash
# Ensure develop is stable
git checkout develop
git pull origin develop

# Merge to main
git checkout main
git pull origin main
git merge develop
git push origin main
```

### 5.2 GitHub Actions Workflow

```
1. Go to Actions
2. "Deploy to Production" workflow should:
   - ✅ Validate templates
   - ✅ Wait for approval (PAUSED)
```

### 5.3 Manual Approval

```
1. Go to the workflow run
2. Click "Review deployments"
3. Select "production"
4. Click "Approve and deploy"
5. Workflow continues
```

**Expected Duration**: 15-20 minutes after approval

### 5.4 Verify Production Deployment

```bash
# List prod stacks
aws cloudformation describe-stacks \
  --region ap-south-1 \
  --query "Stacks[?contains(StackName, 'prod')].{Name:StackName,Status:StackStatus}" \
  --output table

# Expected: All stacks CREATE_COMPLETE or UPDATE_COMPLETE

# Get prod frontend URL
CLOUDFRONT=$(aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-prod \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text)

echo "Production Frontend: https://$CLOUDFRONT"
```

---

## Test 6: Rollback Testing

**Objective**: Verify rollback procedures work correctly

### 6.1 Rollback Dev Environment

```bash
# Get current stack status
aws cloudformation describe-stack-resources \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --output table

# Delete and redeploy one stack
aws cloudformation delete-stack \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1

# Wait for deletion
aws cloudformation wait stack-delete-complete \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1

# Redeploy
./infra/scripts/deploy-stacks.sh dev

# Verify
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --query "Stacks[0].StackStatus" \
  --output text

# Expected: CREATE_COMPLETE
```

### 6.2 Code Rollback (Git)

```bash
# Revert a commit
git revert <commit-hash>
git push origin develop

# GitHub Actions should automatically redeploy with reverted code
# Monitor Actions workflow to verify
```

---

## Test 7: Cleanup After Testing

### 7.1 Delete Dev Environment (Optional)

```bash
# If you want to clean up test resources
chmod +x infra/scripts/cleanup-stacks.sh

./infra/scripts/cleanup-stacks.sh growksh-website-dev

# Verify cleanup
aws cloudformation list-stacks \
  --region ap-south-1 \
  --query "StackSummaries[?StackStatus!='DELETE_COMPLETE' && contains(StackName, 'dev')].StackName" \
  --output table

# Expected: No results
```

### 7.2 Cost Verification

```bash
# Check AWS Billing dashboard for:
# - Total monthly estimated costs
# - Breakdown by service
# - Compare to budget ($50-100 for prod, $30-50 for dev)
```

---

## Test Summary Checklist

### Template Validation
- [ ] All CloudFormation templates pass cfn-lint
- [ ] No YAML errors
- [ ] No resource definition errors

### Development Environment
- [ ] All 7 stacks created successfully
- [ ] DynamoDB tables exist
- [ ] Cognito User Pool created
- [ ] S3 bucket created
- [ ] CloudFront distribution created
- [ ] API Gateway configured
- [ ] Lambda functions deployed
- [ ] Frontend loads via CloudFront
- [ ] API endpoints respond
- [ ] All resources tagged correctly

### Ephemeral Environment
- [ ] Feature branch deployment triggers
- [ ] Ephemeral stacks created with unique names
- [ ] PR comment with URLs appears
- [ ] Can access ephemeral frontend
- [ ] Can test features
- [ ] Cleanup runs on PR merge
- [ ] All ephemeral resources deleted

### GitHub Actions Workflows
- [ ] deploy-develop.yaml works (automatic on push to develop)
- [ ] deploy-prod.yaml works with approval gate
- [ ] deploy-ephemeral.yaml works for feature branches
- [ ] All workflows show proper status
- [ ] Logs are readable and informative

### Rollback
- [ ] Can manually revert code
- [ ] Can delete and redeploy stacks
- [ ] Production rollback procedures documented
- [ ] No data loss during rollback

---

## Success Criteria

Testing is complete when:
- ✅ All 7 CloudFormation stacks deploy successfully
- ✅ Frontend loads and is functional
- ✅ Auth flow works end-to-end
- ✅ API endpoints respond correctly
- ✅ Ephemeral environments work and clean up
- ✅ GitHub Actions workflows execute without errors
- ✅ Production deployment includes approval gate
- ✅ Rollback procedures work as documented

---

## Next Steps (After Testing)

1. ✅ Create environment-specific documentation
2. ✅ Archive old SAM template
3. ✅ Delete legacy GitHub secrets (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
4. ✅ Delete legacy GitHub variables (S3_BUCKET, CLOUDFRONT_DISTRIBUTION_ID)
5. ✅ Team training and handoff

---

**Created**: Dec 24, 2025  
**Status**: Ready for Phase 3 Testing
