# Documentation Index & Quick Links

## 📚 Complete Documentation Suite

Your infrastructure has been updated with comprehensive documentation. Use this index to find what you need.

---

## 🚀 Quick Start (5 Minutes)

**Just want to deploy?**  
→ Go to [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)

```powershell
# Windows - one command deployment
.\infra\scripts\deploy.ps1 -Environment prod -SESEmail noreply@growksh.com
```

```bash
# Linux/Mac - one command deployment
python3 infra/scripts/deploy.py --environment prod --ses-email noreply@growksh.com
```

---

## 📖 Core Documentation

### For Different Roles

| Role | Start Here | Then Read | Reference |
|------|-----------|-----------|-----------|
| **DevOps/SRE** | [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md) | [CLOUDFORMATION_CHANGES.md](CLOUDFORMATION_CHANGES.md) | [DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md) |
| **Developer** | [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md) | [CODE_CHANGES_SUMMARY.md](CODE_CHANGES_SUMMARY.md) | [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md) |
| **Team Lead** | [INFRASTRUCTURE_UPDATE_SUMMARY.md](INFRASTRUCTURE_UPDATE_SUMMARY.md) | [DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md) | All others |
| **Security** | [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md) | [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md) | [CODE_CHANGES_SUMMARY.md](CODE_CHANGES_SUMMARY.md) |

---

## 📋 Documentation by Purpose

### Understanding What Changed
1. **[CODE_CHANGES_SUMMARY.md](CODE_CHANGES_SUMMARY.md)**
   - Every file modified
   - Specific code changes
   - Before/after comparisons
   - Why each change was made

2. **[CLOUDFORMATION_CHANGES.md](CLOUDFORMATION_CHANGES.md)**
   - Stack-by-stack changes
   - Parameter details
   - Deployment order
   - Common mistakes

### Planning a Deployment
1. **[DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md)**
   - Complete configuration guide
   - Parameter reference for each stack
   - Pre-requisites
   - How to get outputs

2. **[DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)**
   - Fast lookup tables
   - Command examples
   - Environment-specific configs
   - Troubleshooting

### Understanding Architecture
1. **[DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md)**
   - Visual diagrams
   - Dependency graphs
   - Parameter flows
   - Multi-environment strategy

2. **[ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md)**
   - What is account-specific
   - What is environment-specific
   - What is auto-generated
   - How to get each value

### Running a Deployment
1. **[DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)**
   - Pre-deployment checklist
   - Deployment commands
   - Post-deployment steps

2. **[infra/scripts/deploy.ps1](infra/scripts/deploy.ps1)** (PowerShell)
   - Windows native automation
   - Colored output
   - Detailed help

3. **[infra/scripts/deploy.py](infra/scripts/deploy.py)** (Python)
   - Cross-platform automation
   - Works on Windows/Mac/Linux

### Troubleshooting Issues
1. **[DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md#troubleshooting)**
   - Common error messages
   - Diagnosis steps
   - Solutions

2. **[DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md#validation-checklist)**
   - Validation steps
   - Pre-deployment checks

---

## 🔍 Find Information By Topic

### Account & Credentials
- How to set up AWS credentials? → [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md) - "Mandatory Constants"
- What is my account ID? → [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md#1-aws-account-id)
- Configure AWS region? → [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md#2-aws-region)

### Infrastructure Parameters
- What parameters do I need to provide? → [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md)
- What are default values? → [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md#default-values-can-override)
- What gets auto-generated? → [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md#auto-generated-values-no-action-needed)

### Email Configuration
- Set up SES email? → [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md#4-ses-verified-email)
- What email is required? → [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md) - "SES Verified Email"
- Email verification fails? → [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md#troubleshooting)

### Frontend Configuration
- What is VerifyBaseUrl? → [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md#6-frontend-domain-verifybaseurl)
- How to update runtime-config.js? → [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md#frontend-runtime-config)
- Get API endpoint? → [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md#post-deployment-configuration)

### Lambda & Code
- Package Lambda code? → [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md#7-lambda-code-s3-bucket)
- What is LambdaCodeSourceEnv? → [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md#8-lambda-code-source-environment)
- Multiple environments same code? → [DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md#multi-environment-deployment-example)

### CloudFormation Details
- Stack dependencies? → [DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md#cloudformation-stack-dependency-graph)
- Deployment order? → [CLOUDFORMATION_CHANGES.md](CLOUDFORMATION_CHANGES.md#deployment-order-critical)
- What changed in templates? → [CODE_CHANGES_SUMMARY.md](CODE_CHANGES_SUMMARY.md)

### Deployment Automation
- Use deployment script? → [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md#deployment-command-simplest)
- Script options? → [infra/scripts/deploy.ps1](infra/scripts/deploy.ps1) or [infra/scripts/deploy.py](infra/scripts/deploy.py)
- Dry run before deploy? → [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md#deployment-command-simplest) (add `--dry-run`)

### Multi-Environment
- Deploy to dev, staging, prod? → [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md#environment-specific-deployments)
- Parameter differences? → [DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md#what-changes-between-environments)
- Same code across environments? → [DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md#multi-environment-deployment-example)

---

## 📊 Document Details

| Document | File | Purpose | Audience | Length |
|----------|------|---------|----------|--------|
| **Deployment Quick Reference** | DEPLOYMENT_QUICK_REFERENCE.md | Fast lookup for deployments | Everyone | 2-3 min |
| **Infrastructure Update Summary** | INFRASTRUCTURE_UPDATE_SUMMARY.md | Overview of all changes | Team leads | 3-5 min |
| **Deployment Config** | DEPLOYMENT_CONFIG.md | Complete configuration guide | DevOps/SRE | 5-10 min |
| **Code Changes Summary** | CODE_CHANGES_SUMMARY.md | Every code modification | Developers/Reviewers | 10-15 min |
| **CloudFormation Changes** | CLOUDFORMATION_CHANGES.md | Template details & patterns | SRE/Architects | 15-20 min |
| **Account-Specific Constants** | ACCOUNT_SPECIFIC_CONSTANTS.md | All configurable values | Security/DevOps | 10-15 min |
| **Deployment Architecture** | DEPLOYMENT_ARCHITECTURE.md | Visual architecture & flows | Architects/Tech leads | 10-15 min |
| **Deploy Script (PowerShell)** | infra/scripts/deploy.ps1 | Windows automation | Windows users | - |
| **Deploy Script (Python)** | infra/scripts/deploy.py | Cross-platform automation | Linux/Mac users | - |

---

## ✅ Pre-Deployment Checklist

Use this before running any deployment:

```
Phase 1: Preparation
├─ [ ] AWS credentials configured (aws configure)
├─ [ ] Correct AWS account selected
├─ [ ] Target region decided (ap-south-1, us-east-1, etc.)
├─ [ ] Environment name chosen (dev, staging, prod, feature-xxx)
└─ [ ] Read DEPLOYMENT_CONFIG.md "Pre-Requisites Checklist"

Phase 2: Setup
├─ [ ] SES email verified in target region
├─ [ ] Frontend domain/URL known
├─ [ ] VerifySecret generated (32+ random characters)
├─ [ ] Lambda code packaged and ready
└─ [ ] VerifyBaseUrl calculated (domain + /auth/verify-email)

Phase 3: Execution
├─ [ ] Review DEPLOYMENT_QUICK_REFERENCE.md
├─ [ ] Run: .\infra\scripts\deploy.ps1 -Environment [name]
├─ [ ] All stacks deployed successfully
├─ [ ] Check CloudFormation console for any rollbacks
└─ [ ] Document any issues

Phase 4: Post-Deployment
├─ [ ] Captured: Cognito User Pool ID
├─ [ ] Captured: Cognito Client ID
├─ [ ] Captured: API Gateway Endpoint
├─ [ ] Updated: public/runtime-config.js
├─ [ ] Verified: Email sending (test signup)
├─ [ ] Verified: Authentication flow
└─ [ ] Verified: API endpoints working

Phase 5: Documentation
├─ [ ] Record deployment date & parameters
├─ [ ] Update team wiki/knowledge base
├─ [ ] Document any custom configurations
└─ [ ] Share outputs with team
```

---

## 🔗 Related Files in Repository

**CloudFormation Templates**:
- `infra/cloudformation/02-cognito-stack.yaml` ← Updated
- `infra/cloudformation/06-api-gateway-stack.yaml` ← Updated
- `infra/cloudformation/07-cognito-lambdas-stack.yaml` ← Updated
- `infra/cloudformation/08-api-lambdas-stack.yaml` ← Updated

**Deployment Scripts**:
- `infra/scripts/deploy.ps1` ← New
- `infra/scripts/deploy.py` ← New

**Frontend Configuration**:
- `public/runtime-config.js` ← Updated

**Lambda Functions**:
- `aws-lambda/auth/*.js` → No changes (environment-agnostic)
- `aws-lambda/contact/index.js` → No changes (environment-agnostic)

---

## 🎯 Common Scenarios

### Scenario 1: Deploy to Production for First Time
1. Read: [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md)
2. Follow: Pre-Requisites Checklist
3. Run: `.\infra\scripts\deploy.ps1 -Environment prod`
4. Use: [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md) for post-deployment

### Scenario 2: Deploy to New AWS Account
1. Read: [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md)
2. Configure: AWS credentials for new account
3. Run: Deploy script with new account's parameters
4. Result: Identical infrastructure in new account

### Scenario 3: Deploy New Feature Branch
1. Read: [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)
2. Run: `.\infra\scripts\deploy.ps1 -Environment feature-xyz`
3. Get: CloudFormation outputs
4. Update: public/runtime-config.js with new values

### Scenario 4: Debug Deployment Failure
1. Check: [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md#troubleshooting)
2. View: CloudFormation stack events
3. Check: Lambda logs in CloudWatch
4. Verify: Parameters match [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md)

### Scenario 5: Update Infrastructure
1. Modify: CloudFormation template
2. Read: [CLOUDFORMATION_CHANGES.md](CLOUDFORMATION_CHANGES.md) for best practices
3. Validate: `cfn-lint infra/cloudformation/*.yaml`
4. Deploy: Using deployment script

### Scenario 6: Migrate to New Region
1. Read: [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md)
2. Set: Region parameter to new region
3. Prepare: SES email in new region
4. Deploy: Same deployment script, new region

---

## 📞 Getting Help

**For specific questions, find the relevant section:**

- "How do I...?" → See [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)
- "What is...?" → See [ACCOUNT_SPECIFIC_CONSTANTS.md](ACCOUNT_SPECIFIC_CONSTANTS.md)
- "Why did...?" → See [CODE_CHANGES_SUMMARY.md](CODE_CHANGES_SUMMARY.md)
- "What changed...?" → See [CLOUDFORMATION_CHANGES.md](CLOUDFORMATION_CHANGES.md)
- "How does...?" → See [DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md)
- "Error: ..." → See [DEPLOYMENT_QUICK_REFERENCE.md#troubleshooting](DEPLOYMENT_QUICK_REFERENCE.md#troubleshooting)

---

## 📝 Version History

- **Current**: Infrastructure parameterized for multi-account deployment
- **Previous**: Hardcoded account IDs and region-specific configurations
- **Date Updated**: January 2026

---

## ✨ Key Improvements

✅ **Parameterized Infrastructure**: No hardcoded account IDs or region-specific values  
✅ **Automated Deployment**: PowerShell and Python scripts handle deployment complexity  
✅ **Comprehensive Documentation**: 6 guides + 2 automation scripts  
✅ **Multi-Environment Support**: Deploy to dev, staging, prod with same code  
✅ **Account-Agnostic**: Works in any AWS account without modification  
✅ **Reproducible**: Identical results every deployment  
✅ **Validated**: All templates pass cfn-lint checks  

---

**Start here**: [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)  
**Need help?**: Find your question in the index above

