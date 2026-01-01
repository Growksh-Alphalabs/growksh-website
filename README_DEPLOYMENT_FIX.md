# 🚀 Growksh Website - Deployment Fix for feature-77d07ae1

## Quick Start

Your signup/sign-in endpoints are failing because **the backend Lambda functions haven't been deployed** to the new `feature-77d07ae1` environment.

### The Fix (One Command)

```powershell
# On Windows PowerShell
.\Deploy-Feature-Env.ps1

# On Linux/Mac/WSL
./infra/scripts/deploy-stacks.sh feature-77d07ae1
npm run package-lambdas
./infra/scripts/build-and-upload-lambdas.sh feature-77d07ae1
```

⏱️ **Takes ~30-45 minutes**

---

## 📚 Documentation

### Start Here (Pick Your Path)

#### 🟦 Windows Users
1. **Quick Start**: `DEPLOYMENT_CHECKLIST.md`
2. **Run Deployment**: `.\Deploy-Feature-Env.ps1`
3. **Detailed Guide**: `DEPLOYMENT_FOR_FEATURE_77D07AE1.md`

#### 🐧 Linux/Mac/WSL Users
1. **Quick Start**: `DEPLOYMENT_CHECKLIST.md`
2. **Run Deployment**: `./infra/scripts/deploy-stacks.sh feature-77d07ae1`
3. **Detailed Guide**: `DEPLOYMENT_FOR_FEATURE_77D07AE1.md`

#### 🤔 Want to Understand the Problem?
1. **Simple Explanation**: `WHY_SIGNUP_FAILING.md` (non-technical)
2. **Technical Details**: `INFRASTRUCTURE_FIX_SUMMARY.md` (for engineers)
3. **Changes Made**: `CHANGES_SUMMARY.md` (what was fixed)

---

## 📋 Files Reference

| File | Purpose | Read Time |
|------|---------|-----------|
| **WHY_SIGNUP_FAILING.md** | Simple explanation of the problem and fix | 5 min |
| **DEPLOYMENT_CHECKLIST.md** | Quick reference for deployment steps | 3 min |
| **DEPLOYMENT_FOR_FEATURE_77D07AE1.md** | Complete step-by-step guide | 15 min |
| **INFRASTRUCTURE_FIX_SUMMARY.md** | Technical deep-dive and architecture | 20 min |
| **CHANGES_SUMMARY.md** | What was changed and why | 10 min |

---

## ❓ What's Wrong?

```
Problem 1: POST /auth/signup returns 500 (no CORS headers)
Problem 2: POST /auth/check-user returns 500 (no CORS headers)  
Problem 3: Sign-in fails: "Custom auth lambda trigger is not configured"

Root Cause: Backend Lambda functions never deployed for feature-77d07ae1
Solution: Run Deploy-Feature-Env.ps1 to deploy everything
```

---

## ✅ What Gets Deployed

When you run the deployment script, it creates:

### AWS Infrastructure
- ✅ 9 CloudFormation stacks
- ✅ 8 Lambda functions (signup, check-user, verify-email, contact + 4 Cognito triggers)
- ✅ IAM roles for Lambdas
- ✅ DynamoDB table for OTP storage
- ✅ S3 bucket for Lambda code
- ✅ 6 Cognito triggers attached to user pool

### Result
- ✅ Signup endpoint works (returns 201 with CORS headers)
- ✅ Sign-in endpoint works (returns 200 with CORS headers)
- ✅ OTP-based authentication works
- ✅ Custom Cognito auth challenges work

---

## 🚀 Deployment Steps

### Step 1: Verify Credentials
```powershell
aws sts get-caller-identity
# Expected: Account 720427058396
```

### Step 2: Run Deployment
```powershell
.\Deploy-Feature-Env.ps1
# Automated: packages Lambdas, deploys stacks, uploads code
```

### Step 3: Verify Success
```powershell
# Check Lambdas deployed
aws lambda list-functions --region ap-south-1 `
  --query "Functions[?contains(FunctionName, 'feature-77d07ae1')]"

# Check Cognito triggers
aws cognito-idp describe-user-pool --user-pool-id ap-south-1_NiqhNWvf8 `
  --region ap-south-1 --query 'UserPool.LambdaConfig'
```

### Step 4: Test Frontend
1. Hard refresh: **Ctrl+Shift+R** on https://d12jf2jvld5mg4.cloudfront.net/
2. Click "Sign In"
3. Enter email and receive OTP
4. Enter OTP and sign in successfully

---

## 🆘 Common Issues

### Issue: Lambda functions not appearing
**Check:** `aws cloudformation describe-stacks --stack-name growksh-website-api-lambdas-feature-77d07ae1 --region ap-south-1`

See `DEPLOYMENT_CHECKLIST.md` for troubleshooting

### Issue: "Custom auth lambda trigger is not configured"
**Check:** Cognito triggers are attached: `aws cognito-idp describe-user-pool --user-pool-id ap-south-1_NiqhNWvf8 --region ap-south-1 --query 'UserPool.LambdaConfig'`

See `DEPLOYMENT_FOR_FEATURE_77D07AE1.md` for detailed troubleshooting

### Issue: CORS still blocked
**Check:** CloudFront cache (hard refresh with Ctrl+Shift+R) or see `CLOUDFRONT_CACHE_FIX.md`

---

## 📊 Deployment Timeline

| Phase | Task | Duration |
|-------|------|----------|
| **Setup** | Verify credentials | 1 min |
| **Package** | Create Lambda ZIPs | 2-3 min |
| **Deploy** | CloudFormation stacks | 20-30 min |
| **Upload** | Lambda code to S3 | 2-3 min |
| **Verify** | Check deployment success | 2-3 min |
| **Test** | Frontend testing | 5-10 min |
| **TOTAL** | Full deployment | 30-45 min |

---

## ✅ Success Criteria

After deployment completes, verify:

- [ ] `aws lambda list-functions` shows 8 Lambda functions for `feature-77d07ae1`
- [ ] `aws cognito-idp describe-user-pool` shows 6 Lambda ARNs in LambdaConfig
- [ ] `aws s3 ls s3://growksh-website-lambda-code-feature-77d07ae1/` shows 8 ZIP files
- [ ] `curl https://8hz8oz0aef.../auth/signup` returns 201 with CORS headers
- [ ] `curl https://8hz8oz0aef.../auth/check-user` returns 200 with CORS headers
- [ ] Browser sign-in flow sends OTP email
- [ ] OTP entry succeeds and signs in user

---

## 🔧 Deployment Methods

### Option 1: Automated (Recommended for Windows)
```powershell
.\Deploy-Feature-Env.ps1
```
- ✅ Single command
- ✅ Verifies account
- ✅ Handles all steps
- ✅ Shows progress

### Option 2: Bash Scripts (Linux/Mac/WSL)
```bash
./infra/scripts/deploy-stacks.sh feature-77d07ae1
npm run package-lambdas
./infra/scripts/build-and-upload-lambdas.sh feature-77d07ae1
```
- ✅ Granular control
- ✅ See detailed logs
- ✅ Easier to debug

### Option 3: Manual AWS Console
Deploy each CloudFormation template manually via AWS Console
- ⚠️ More steps
- ⚠️ Easier to make mistakes
- ✅ Full visibility

See `DEPLOYMENT_FOR_FEATURE_77D07AE1.md` for detailed instructions.

---

## 📞 Need Help?

1. **For simple explanation**: Read `WHY_SIGNUP_FAILING.md`
2. **For deployment steps**: Follow `DEPLOYMENT_CHECKLIST.md`
3. **For detailed guide**: See `DEPLOYMENT_FOR_FEATURE_77D07AE1.md`
4. **For troubleshooting**: Check section "Troubleshooting" in `DEPLOYMENT_FOR_FEATURE_77D07AE1.md`
5. **For technical details**: Read `INFRASTRUCTURE_FIX_SUMMARY.md`

---

## 🎯 Summary

| What | Status | Action |
|------|--------|--------|
| **Problem** | Signup/sign-in failing | ✅ Documented in WHY_SIGNUP_FAILING.md |
| **Solution** | Deploy backend | ✅ Deploy-Feature-Env.ps1 ready |
| **Guide** | Step-by-step | ✅ DEPLOYMENT_CHECKLIST.md |
| **Code changes** | Removed hardcoded IDs | ✅ 2 files modified |
| **Account-agnostic** | Works in any account | ✅ Yes |

**Next step:** Run `.\Deploy-Feature-Env.ps1` and wait ~45 minutes ⏰

---

## 📝 Files Modified/Created

### Modified (2 files)
- `infra/cloudformation/07-cognito-lambdas-stack.yaml` - Removed account ID
- `infra/cloudformation/08-api-lambdas-stack.yaml` - Removed account ID

### Created (6 files)
- `Deploy-Feature-Env.ps1` - Windows deployment script
- `DEPLOYMENT_FOR_FEATURE_77D07AE1.md` - Detailed guide
- `DEPLOYMENT_CHECKLIST.md` - Quick reference
- `INFRASTRUCTURE_FIX_SUMMARY.md` - Technical explanation
- `WHY_SIGNUP_FAILING.md` - Simple explanation
- `CHANGES_SUMMARY.md` - Change documentation

---

## 🚀 Ready to Deploy?

```powershell
# Option 1: Windows
.\Deploy-Feature-Env.ps1

# Option 2: Linux/Mac/WSL
./infra/scripts/deploy-stacks.sh feature-77d07ae1
```

**Questions?** See the documentation files above.
