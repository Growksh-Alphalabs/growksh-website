# Deployment Workflow Redesign - CloudFormation & GitHub Actions

**Status**: 🔄 In Progress (Started: Dec 24, 2025)  
**Owner**: Infrastructure Team  
**Objective**: Move from SAM templates to modular CloudFormation stacks with environment-specific GitHub workflows

---

## 📋 Overview

### Current State
- Single `sam-template.yaml` with all resources
- Manual deployments
- No automated GitHub workflows
- Developers use personal AWS accounts

### Target State
- **8 modular CloudFormation templates** organized by resource type
- **3 automated GitHub workflows** for feature/develop/main branches
- **Single AWS account** with OIDC-based GitHub authentication
- **Ephemeral environments** for feature branch testing with auto-cleanup
- **Dev & Prod parity** with separate CloudFront distributions

---

## 🏗️ Architecture Design

### CloudFormation Stack Structure

```
├── iam-stack.yaml
│   └── IAM roles, policies, Cognito permissions
│
├── database-stack.yaml
│   ├── DynamoDB: AuthOtpTable
│   └── DynamoDB: ContactsTable
│
├── cognito-stack.yaml
│   ├── User Pool (shared across all environments)
│   └── User Pool Client
│
├── storage-stack.yaml
│   └── S3 bucket (environment-specific)
│
├── cdn-stack.yaml
│   ├── Depends on: storage-stack
│   └── CloudFront distribution (dev & prod only)
│
├── api-gateway-stack.yaml
│   └── Unified REST API Gateway (all endpoints)
│
├── lambda-auth-base-stack.yaml
│   ├── PreSignUpFunction
│   ├── DefineAuthChallengeFunction
│   └── CustomMessageFunction
│
├── lambda-auth-otp-stack.yaml
│   ├── CreateAuthChallengeFunction
│   └── VerifyAuthChallengeFunction
│   └── (Depends on: iam-stack, database-stack)
│
├── lambda-auth-signup-stack.yaml
│   ├── SignupFunction
│   └── VerifyEmailFunction
│   └── (Depends on: iam-stack)
│
└── lambda-contact-stack.yaml
    ├── ContactFunction
    └── (Depends on: iam-stack, database-stack)
```

### Stack Dependencies & Deployment Order

```
Phase 1 (Foundation):
  iam-stack → database-stack → cognito-stack

Phase 2 (Storage & CDN):
  storage-stack → cdn-stack

Phase 3 (APIs & Lambdas):
  api-gateway-stack
  lambda-auth-base-stack
  lambda-auth-otp-stack → (depends on iam-stack, database-stack)
  lambda-auth-signup-stack → (depends on iam-stack)
  lambda-contact-stack → (depends on iam-stack, database-stack)
```

---

## 🌍 Environment Strategy

### Three-Tier Environment Model

| Environment | Branch | Trigger | CloudFront | S3 Bucket | Cognito | Cleanup | Cost |
|-------------|--------|---------|-----------|-----------|---------|---------|------|
| **prod** | `main` | PR merge to main | ✅ Dedicated | `growksh-prod-*` | Shared (prod tenant) | Manual | ~$50/mo |
| **dev** | `develop` | PR merge to develop | ✅ Dedicated | `growksh-dev-*` | Shared (dev tenant) | Manual | ~$30/mo |
| **ephemeral** | `feature/*` | Push/PR create | ❌ S3 website | `growksh-eph-{hash}-*` | Shared (dev tenant) | Auto on PR close/merge | <$1/mo |

### Parameter Overrides by Environment

```yaml
# Global
Environment: "prod" | "dev" | "ephemeral"
BranchName: "main" | "develop" | "feature-<hash>"
FeatureBranchHash: "" | "abc12345"

# S3 Buckets
StaticSiteBucketName:
  prod: "growksh-prod-static-assets"
  dev: "growksh-dev-static-assets"
  ephemeral: "growksh-eph-{COMMIT_HASH}-static-assets"

# CloudFront
CreateCloudFront:
  prod: true
  dev: true
  ephemeral: false

CloudFrontDomainName:
  prod: "d2eipj1xhqte5b.cloudfront.net"
  dev: "d3xyz123abc.cloudfront.net"  # To be configured
  ephemeral: ""  # Use S3 website endpoint

# Frontend Base URL (for verification links)
FrontendBaseUrl:
  prod: "https://growksh.com"
  dev: "https://dev.growksh.com"
  ephemeral: "https://s3.{region}.amazonaws.com/growksh-eph-{hash}-static-assets"

# SES Configuration
SESSourceEmail:
  prod: "noreply@growksh.com"
  dev: "noreply-dev@growksh.com"
  ephemeral: "noreply-dev@growksh.com"

# Resource Naming
ResourcePrefix:
  prod: "growksh-prod"
  dev: "growksh-dev"
  ephemeral: "growksh-eph-{COMMIT_HASH}"
```

---

## 🔐 AWS Account & IAM Setup

### Single Account Model
- All environments (dev, prod, ephemeral) in **one AWS account**
- GitHub OIDC provider configured in IAM
- Developers assume `GrowkshDeveloperRole` via GitHub Actions

### GrowkshDeveloperRole Permissions
```
✅ CloudFormation: Create, Update, Describe stacks
✅ Lambda: Create, Update, Publish, GetFunction
✅ DynamoDB: CreateTable, UpdateTable, Describe, Put, Get
✅ S3: CreateBucket, PutObject, GetObject, ListBucket
✅ API Gateway: CreateRestApi, CreateResource, PutMethod
✅ Cognito: CreateUserPool, UpdateUserPool, AdminCreateUser
✅ SES: SendEmail, VerifyDomain (if needed)
✅ IAM: PassRole (for Lambda execution roles)
❌ IAM: CreateRole, DeleteRole, AttachRolePolicy
❌ Account-level changes
```

---

## 🚀 GitHub Workflows

### Workflow 1: Deploy to Dev (develop branch)
**File**: `.github/workflows/deploy-develop.yaml`

```yaml
Trigger: 
  - push to develop branch (PR merged)
  - Manual trigger (workflow_dispatch)

Steps:
  1. Checkout code
  2. Assume GrowkshDeveloperRole via OIDC
  3. Build frontend (npm build)
  4. Deploy stacks in order:
     - iam-stack
     - database-stack
     - cognito-stack
     - storage-stack
     - cdn-stack
     - api-gateway-stack
     - lambda-*-stacks
  5. Upload built assets to S3
  6. Invalidate CloudFront cache
  7. Post status to Slack/Email
```

### Workflow 2: Deploy to Prod (main branch)
**File**: `.github/workflows/deploy-prod.yaml`

```yaml
Trigger: 
  - push to main branch (PR merged)
  - Manual trigger (workflow_dispatch)

Steps:
  1. Checkout code
  2. Assume GrowkshDeveloperRole via OIDC
  3. Build frontend (npm build)
  4. [MANUAL APPROVAL GATE] ⏸️
  5. Deploy stacks (same as dev)
  6. Upload built assets to S3
  7. Invalidate CloudFront cache
  8. Tag CloudFormation stacks with version
  9. Post status to Slack/Email with rollback instructions
```

### Workflow 3: Deploy Ephemeral (feature branches)
**File**: `.github/workflows/deploy-ephemeral.yaml`

```yaml
Trigger:
  - push to feature/* branches
  - pull_request (opened, synchronize, reopened)
  - pull_request (closed)

On Push/PR Open:
  1. Generate branch hash (first 8 chars of commit)
  2. Assume GrowkshDeveloperRole via OIDC
  3. Build frontend (npm build)
  4. Deploy stacks with ephemeral naming:
     - growksh-eph-{hash}-*
  5. Upload assets to S3 website bucket
  6. Post PR comment with test URL:
     - "✅ Deployed to: https://s3.{region}.amazonaws.com/growksh-eph-{hash}-static-assets"
     - "🧹 Will auto-cleanup on PR merge/close"

On PR Close/Merge:
  1. Trigger cleanup workflow
  2. Delete all ephemeral stacks: growksh-eph-{hash}-*
  3. Delete S3 bucket: growksh-eph-{hash}-static-assets
  4. Post comment: "♻️ Ephemeral environment cleaned up"
```

---

## 📁 File Structure (After Refactoring)

```
infra/
├── README.md
├── stacks/
│   ├── 00-iam-stack.yaml
│   ├── 01-database-stack.yaml
│   ├── 02-cognito-stack.yaml
│   ├── 03-storage-stack.yaml
│   ├── 04-cdn-stack.yaml
│   ├── 05-api-gateway-stack.yaml
│   ├── 06-lambda-auth-base-stack.yaml
│   ├── 07-lambda-auth-otp-stack.yaml
│   ├── 08-lambda-auth-signup-stack.yaml
│   └── 09-lambda-contact-stack.yaml
│
├── parameters/
│   ├── dev-parameters.json
│   ├── prod-parameters.json
│   └── ephemeral-parameters.json
│
├── scripts/
│   ├── deploy.sh        # Deploy all stacks in order
│   ├── cleanup.sh       # Delete ephemeral stacks
│   └── validate.sh      # Validate all templates
│
└── [old] sam-template.yaml  # Keep for reference during migration
```

---

## 🔄 Deployment Workflow (Step-by-Step)

### Developer creates feature branch & pushes code:
1. ✅ GitHub Actions triggered (feature branch detected)
2. ✅ OIDC: Assume GrowkshDeveloperRole
3. ✅ Build frontend
4. ✅ Deploy ephemeral stacks (`growksh-eph-abc12345-*`)
5. ✅ Upload to S3 website bucket
6. ✅ PR gets comment: "Deployed to: https://s3.../growksh-eph-abc12345-..."

### Developer opens PR against develop:
1. ✅ Code review
2. ✅ Merge PR
3. ✅ GitHub Actions triggered (develop branch)
4. ✅ Cleanup ephemeral stacks
5. ✅ Deploy/Update dev stacks (`growksh-dev-*`)
6. ✅ Available at dev CloudFront domain

### Release manager merges develop → main:
1. ✅ Create PR develop → main
2. ✅ Code review, approval
3. ✅ Merge PR
4. ✅ GitHub Actions triggered (main branch)
5. ⏸️ **MANUAL APPROVAL GATE** (optional approval by ops team)
6. ✅ Deploy/Update prod stacks (`growksh-prod-*`)
7. ✅ Tag stacks with version (for rollback)
8. ✅ Available at prod CloudFront domain

---

## 🔄 Rollback Strategy

### Prod Rollback (Keep last 2 versions)
- **Active**: `growksh-prod-v1.2.3` (current deployment)
- **Previous**: `growksh-prod-v1.2.2` (fallback)
- **Older**: Deleted automatically

### Via CloudFormation:
```bash
# View stack history
aws cloudformation describe-stacks --stack-name growksh-prod-api-gateway-stack

# Rollback to previous
aws cloudformation cancel-update-stack --stack-name growksh-prod-api-gateway-stack
```

### Via GitHub:
- Revert commit to main
- Re-run deploy-prod workflow
- Redeploy from specific git tag

---

## ✅ Migration Checklist

- [ ] Phase 0: AWS OIDC setup
- [ ] Phase 1: CloudFormation templates created & validated
- [ ] Phase 2: GitHub workflows created & tested
- [ ] Phase 3: End-to-end testing
- [ ] Documentation updated
- [ ] Team trained on new workflow
- [ ] Old SAM template archived
- [ ] Temporary docs removed

---

## 📞 Key Contacts & References

- **AWS OIDC Setup**: [Link to Phase 0 docs]
- **Deployment Tracker**: [Link to DEPLOYMENT_TRACKER.md]
- **GitHub Actions**: [Link to .github/workflows/]

