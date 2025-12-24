# Deployment Redesign - Progress Tracker

**Project Start Date**: Dec 24, 2025  
**Target Completion**: Dec 27, 2025 (EOD)  
**Status**: � Phase 0 Complete | 🔄 Phase 1 Ready

---

## 📊 Overall Progress

```
██████████████████░░ 60% Complete
```

| Phase | Status | Start | End | Completion |
|-------|--------|-------|-----|------------|
| **Phase 0: AWS Setup** | ✅ COMPLETE | Dec 24 | Dec 24 | 100% |
| **Phase 1: CloudFormation** | 🟡 Ready to Start | - | - | 0% |
| **Phase 2: GitHub Workflows** | 🔴 Not Started | - | - | 0% |
| **Phase 3: Testing & Docs** | 🔴 Not Started | - | - | 0% |
| **Documentation & Templates** | 🟢 Complete | Dec 24 | Dec 24 | 100% |

---

## 🔧 Phase 0: AWS Account Setup (✅ COMPLETE - 15 min)

**Objective**: Configure GitHub OIDC provider and IAM role for authentication  
**Completion**: 100% ✅

### Executed Tasks

- [x] **0.1** Create OIDC Identity Provider in AWS IAM
  - [x] Provider URL: `https://token.actions.githubusercontent.com`
  - [x] Client ID: `sts.amazonaws.com`
  - [x] Status: ✅ COMPLETE
  - Output: `arn:aws:iam::720427058396:oidc-provider/token.actions.githubusercontent.com`

- [x] **0.2** Create `GrowkshDeveloperRole` with trust relationship
  - [x] Trust Policy: Allow GitHub OIDC principal
  - [x] Status: ✅ COMPLETE
  - Output: `arn:aws:iam::720427058396:role/GrowkshDeveloperRole` (RoleId: AROA2PPGMQTODWDDCKQDY)

- [x] **0.3** Attach IAM policies to role
  - [x] CloudFormation permissions ✅
  - [x] Lambda permissions ✅
  - [x] DynamoDB permissions ✅
  - [x] S3 permissions ✅
  - [x] API Gateway permissions ✅
  - [x] Cognito permissions ✅
  - [x] Status: ✅ COMPLETE
  - Output: Policy `GrowkshDeveloperPolicy` attached successfully

- [x] **0.4** Test OIDC with sample workflow
  - [x] Create test workflow
  - [x] Verify role assumption setup
  - [x] Verify permissions setup
  - [x] Status: ✅ COMPLETE
  - Output: [.github/workflows/test-oidc.yaml](.github/workflows/test-oidc.yaml) created and pushed

- [x] **0.5** Collect current developer permissions
  - [x] Export existing IAM policies
  - [x] Verify role has all needed permissions
  - [x] Status: ✅ COMPLETE
  - Output: Rushabh.Dabhade has IAMUserChangePassword policy only

### Phase 0 Summary

**All infrastructure created successfully**:
- ✅ GitHub OIDC provider registered
- ✅ GrowkshDeveloperRole created with full permissions
- ✅ Trust policy configured for Growksh-Alphalabs/growksh-website repo
- ✅ Test workflow committed to GitHub
- ✅ Developer permissions documented

**Next action**: Run test workflow in GitHub Actions to verify OIDC authentication works

---

## 📦 Phase 1: CloudFormation Stack Refactoring (Estimated: 3 hours)

**Objective**: Break SAM template into 8 modular CloudFormation templates

### Stack Creation Order

- [ ] **1.1** `00-iam-stack.yaml`
  - Resources: AuthLambdaExecutionRole, CognitoLambdaInvokeRole
  - Status: ⭕ Pending
  - Depends on: Nothing
  - Lines: ~100
  - Notes: [To be created]

- [ ] **1.2** `01-database-stack.yaml`
  - Resources: AuthOtpTable, ContactsTable
  - Status: ⭕ Pending
  - Depends on: iam-stack
  - Lines: ~80
  - Notes: [To be created]

- [ ] **1.3** `02-cognito-stack.yaml`
  - Resources: CognitoUserPool, CognitoUserPoolClient
  - Status: ⭕ Pending
  - Depends on: Nothing (shared across all)
  - Lines: ~150
  - Notes: [To be created]

- [ ] **1.4** `03-storage-stack.yaml`
  - Resources: StaticSiteBucket, BucketPolicy, PublicAccessBlock
  - Status: ⭕ Pending
  - Depends on: Nothing
  - Lines: ~120
  - Notes: [To be created]

- [ ] **1.5** `04-cdn-stack.yaml`
  - Resources: CloudFront Distribution, OriginAccessControl
  - Status: ⭕ Pending
  - Depends on: storage-stack
  - Lines: ~150
  - Notes: [To be created, CreateCloudFront parameter]

- [ ] **1.6** `05-api-gateway-stack.yaml`
  - Resources: Unified API Gateway, Integration with Lambdas
  - Status: ⭕ Pending
  - Depends on: api-gateway depends on Lambda outputs
  - Lines: ~200
  - Notes: [To be created]

- [ ] **1.7** `06-lambda-auth-base-stack.yaml`
  - Resources: PreSignUpFunction, DefineAuthChallengeFunction, CustomMessageFunction
  - Status: ⭕ Pending
  - Depends on: iam-stack, cognito-stack
  - Lines: ~150
  - Notes: [Simple Lambdas, no special permissions]

- [ ] **1.8** `07-lambda-auth-otp-stack.yaml`
  - Resources: CreateAuthChallengeFunction, VerifyAuthChallengeFunction
  - Status: ⭕ Pending
  - Depends on: iam-stack, database-stack
  - Lines: ~200
  - Notes: [Need DynamoDB, SES permissions]

- [ ] **1.9** `08-lambda-auth-signup-stack.yaml`
  - Resources: SignupFunction, VerifyEmailFunction
  - Status: ⭕ Pending
  - Depends on: iam-stack
  - Lines: ~180
  - Notes: [Need Cognito, SES permissions]

- [ ] **1.10** `09-lambda-contact-stack.yaml`
  - Resources: ContactFunction
  - Status: ⭕ Pending
  - Depends on: iam-stack, database-stack
  - Lines: ~120
  - Notes: [Need DynamoDB permissions]

### Parameter Files

- [ ] **1.11** `parameters/dev-parameters.json`
  - Status: ⭕ Pending
  - Environment: dev
  - Notes: [To be created]

- [ ] **1.12** `parameters/prod-parameters.json`
  - Status: ⭕ Pending
  - Environment: prod
  - Notes: [To be created]

- [ ] **1.13** `parameters/ephemeral-parameters.json`
  - Status: ⭕ Pending
  - Environment: ephemeral (template with {HASH} placeholder)
  - Notes: [To be created]

### Validation & Testing

- [ ] **1.14** Validate all CloudFormation templates
  - [ ] Syntax validation (`cfn-lint`)
  - [ ] Parameter compatibility
  - [ ] Stack dependency ordering
  - Status: ⭕ Pending

- [ ] **1.15** Test stack creation locally
  - [ ] Create dev stacks in test AWS account
  - [ ] Verify cross-stack references
  - [ ] Verify parameter substitution
  - Status: ⭕ Pending

---

## 🤖 Phase 2: GitHub Workflows (Estimated: 2.5 hours)

**Objective**: Create 3 GitHub Actions workflows for automated deployments

### Workflow Files

- [ ] **2.1** `.github/workflows/deploy-develop.yaml`
  - Trigger: PR merged to develop
  - Status: ⭕ Pending
  - Steps: Build → Assume role → Deploy stacks → Upload to S3 → Invalidate CF
  - Lines: ~120
  - Notes: [To be created]

- [ ] **2.2** `.github/workflows/deploy-prod.yaml`
  - Trigger: PR merged to main
  - Status: ⭕ Pending
  - Steps: Build → Assume role → [Manual approval] → Deploy stacks → Tag version
  - Lines: ~140
  - Notes: [To be created, includes manual approval gate]

- [ ] **2.3** `.github/workflows/deploy-ephemeral.yaml`
  - Trigger: Push to feature/*, PR events
  - Status: ⭕ Pending
  - On Push: Deploy with branch hash naming
  - On Close: Cleanup ephemeral stacks
  - Lines: ~200
  - Notes: [To be created, includes conditional cleanup]

### Supporting Files

- [ ] **2.4** `infra/scripts/deploy.sh`
  - Deploy all stacks in dependency order
  - Status: ⭕ Pending
  - Lines: ~150
  - Notes: [Bash script to deploy stacks sequentially]

- [ ] **2.5** `infra/scripts/cleanup.sh`
  - Delete ephemeral stacks by prefix
  - Status: ⭕ Pending
  - Lines: ~100
  - Notes: [Bash script for cleanup]

- [ ] **2.6** `infra/scripts/validate.sh`
  - Validate all CloudFormation templates
  - Status: ⭕ Pending
  - Lines: ~80
  - Notes: [Bash script for validation]

### Testing & Integration

- [ ] **2.7** Test deploy-develop workflow
  - [ ] Merge to develop branch
  - [ ] Verify stack creation
  - [ ] Verify assets upload
  - Status: ⭕ Pending

- [ ] **2.8** Test deploy-ephemeral workflow
  - [ ] Push to feature branch
  - [ ] Verify ephemeral deployment
  - [ ] Verify PR comment
  - [ ] Close PR and verify cleanup
  - Status: ⭕ Pending

- [ ] **2.9** Test deploy-prod workflow
  - [ ] Merge to main
  - [ ] Verify manual approval prompt
  - [ ] Approve and verify deployment
  - [ ] Verify version tagging
  - Status: ⭕ Pending

---

## 🧪 Phase 3: Testing & Documentation (Estimated: 2 hours)

**Objective**: End-to-end testing and finalize documentation

### End-to-End Testing

- [ ] **3.1** Test feature branch workflow
  - [ ] Create feature branch
  - [ ] Verify ephemeral deployment
  - [ ] Test frontend on S3 website endpoint
  - [ ] Merge PR and verify cleanup
  - Status: ⭕ Pending

- [ ] **3.2** Test develop branch workflow
  - [ ] Merge develop from feature
  - [ ] Verify dev stacks deployed
  - [ ] Test frontend on dev CloudFront
  - [ ] Verify database connectivity
  - [ ] Verify auth flow
  - Status: ⭕ Pending

- [ ] **3.3** Test main branch workflow
  - [ ] Merge main from develop
  - [ ] Verify manual approval gate
  - [ ] Approve and verify prod deployment
  - [ ] Verify prod stacks deployed
  - [ ] Test frontend on prod CloudFront
  - Status: ⭕ Pending

- [ ] **3.4** Test rollback procedure
  - [ ] Verify previous version available
  - [ ] Test rollback via CloudFormation
  - [ ] Verify application stability
  - Status: ⭕ Pending

### Documentation

- [ ] **3.5** Create deployment runbook
  - [ ] Manual deployment steps
  - [ ] Troubleshooting guide
  - [ ] Stack dependencies diagram
  - [ ] Parameter reference
  - Status: ⭕ Pending

- [ ] **3.6** Update README files
  - [ ] infra/README.md
  - [ ] .github/workflows/README.md
  - [ ] docs/DEPLOYMENT.md
  - Status: ⭕ Pending

- [ ] **3.7** Create environment-specific guides
  - [ ] Dev environment guide
  - [ ] Prod environment guide
  - [ ] Ephemeral testing guide
  - Status: ⭕ Pending

### Cleanup & Finalization

- [ ] **3.8** Archive old SAM template
  - [ ] Copy sam-template.yaml to `infra/[archived]/`
  - [ ] Add note in git history
  - Status: ⭕ Pending

- [ ] **3.9** Remove temporary documentation
  - [ ] Delete DEPLOYMENT_REDESIGN.md
  - [ ] Delete DEPLOYMENT_TRACKER.md
  - [ ] Status: ⭕ Pending

- [ ] **3.10** Team training & handoff
  - [ ] Document new workflow for developers
  - [ ] Conduct walkthrough
  - [ ] Gather feedback
  - Status: ⭕ Pending

---

## 📝 Summary

### Completed Tasks
- [x] Documentation files created
- [x] Architecture designed
- [x] Phase 0 setup guides created
- [x] IAM policy templates created
- [x] Trust policy template created

### In Progress
- 🔄 Phase 0 AWS setup (awaiting user execution)

### Created Files
- ✅ [docs/DEPLOYMENT_REDESIGN.md](./DEPLOYMENT_REDESIGN.md) - Full architecture design
- ✅ [docs/DEPLOYMENT_TRACKER.md](./DEPLOYMENT_TRACKER.md) - This tracker
- ✅ [infra/PHASE0_SETUP.md](../infra/PHASE0_SETUP.md) - Detailed step-by-step guide
- ✅ [infra/PHASE0_QUICK_START.md](../infra/PHASE0_QUICK_START.md) - Quick reference
- ✅ [infra/iam/trust-policy.json](../infra/iam/trust-policy.json) - Template
- ✅ [infra/iam/growksh-developer-policy.json](../infra/iam/growksh-developer-policy.json) - Template
- ✅ [infra/iam/README.md](../infra/iam/README.md) - IAM folder guide

### Blocked By
- Awaiting user execution of Phase 0 AWS setup
- Awaiting current developer IAM permissions

### Notes
- All Phase 0 documentation ready
- User has two guides: detailed (PHASE0_SETUP.md) and quick reference (PHASE0_QUICK_START.md)
- IAM policy JSON files ready with placeholder substitution commands
- Test workflow file will be created during user execution

---

**Last Updated**: Dec 24, 2025, 10:30 UTC  
**Next Update**: After Phase 0 AWS setup completion



