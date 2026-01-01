# Quick Deployment Checklist

## ✅ Pre-Deployment

- [ ] **Verify AWS credentials**
  ```powershell
  aws sts get-caller-identity
  ```
  Expected: Account `720427058396`

- [ ] **Verify local environment**
  ```powershell
  node --version  # Node 18+
  npm --version   # npm 8+
  aws --version   # AWS CLI 2+
  ```

- [ ] **Pull latest code**
  ```bash
  git status
  git log --oneline -1
  ```

---

## 📦 Deployment

### Option A: Automated (Windows PowerShell)
```powershell
# All steps in one command
.\Deploy-Feature-Env.ps1
```

Expected output:
```
✅ AWS Account verified: 720427058396
✅ Lambda functions packaged
✅ All CloudFormation stacks deployed
✅ Lambda code uploaded to S3
✅ Deployment Complete!
```

**Time:** 10-15 minutes

### Option B: Manual Steps
```bash
# Step 1: Package Lambdas
npm run package-lambdas

# Step 2: Deploy stacks (requires bash/WSL or manual console deployment)
./infra/scripts/deploy-stacks.sh feature-77d07ae1

# Step 3: Upload code
./infra/scripts/build-and-upload-lambdas.sh feature-77d07ae1
```

---

## ✅ Post-Deployment Verification

### Lambda Functions
```bash
aws lambda list-functions --region ap-south-1 \
  --query "Functions[?contains(FunctionName, 'feature-77d07ae1')].FunctionName" \
  --output table
```

Should show: `growksh-website-signup-feature-77d07ae1`, `growksh-website-check-user-feature-77d07ae1`, etc.

### Cognito Triggers
```bash
aws cognito-idp describe-user-pool --user-pool-id ap-south-1_NiqhNWvf8 \
  --region ap-south-1 --query 'UserPool.LambdaConfig' --output json
```

Should show 6 Lambda ARNs (PreSignUp, CustomMessage, DefineAuthChallenge, CreateAuthChallenge, VerifyAuthChallengeResponse, PostConfirmation)

### S3 Lambda Code Bucket
```bash
aws s3 ls s3://growksh-website-lambda-code-feature-77d07ae1/ --recursive
```

Should show 8 `.zip` files (auth + contact Lambdas)

---

## 🧪 Functional Testing

### 1. Hard Refresh Frontend
```
Browser: https://d12jf2jvld5mg4.cloudfront.net/
Keys: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

Check browser console:
```
✅ [Growksh] runtime-config loaded (5) ['VITE_COGNITO_USER_POOL_ID', 'VITE_COGNITO_CLIENT_ID', 'VITE_API_URL', 'VITE_AWS_REGION', 'VITE_USE_FAKE_AUTH']
```

### 2. Test Signup (cURL)
```bash
curl -X POST https://8hz8oz0aef.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}' \
  -i
```

Expected response:
```
HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Content-Type: application/json

{
  "message": "User created successfully",
  "email": "test@example.com",
  "verified": true,
  "verificationEmailSent": false
}
```

### 3. Test Check User (cURL)
```bash
curl -X POST https://8hz8oz0aef.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/check-user \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}' \
  -i
```

Expected response:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: application/json

{
  "exists": true
}
```

### 4. Test Sign-in (Browser)
1. Open: https://d12jf2jvld5mg4.cloudfront.net/
2. Click "Sign In"
3. Enter email: `test@example.com`
4. Should show: "OTP sent to email" message
5. Check inbox for OTP email
6. Enter OTP → Should successfully sign in

---

## ❌ Troubleshooting

### Issue: Lambda functions not appearing
```bash
# Check if stack deployed
aws cloudformation describe-stacks --stack-name growksh-website-api-lambdas-feature-77d07ae1 \
  --region ap-south-1 --query 'Stacks[0].StackStatus'
```

Expected: `CREATE_COMPLETE` or `UPDATE_COMPLETE`

### Issue: `/auth/signup` returns 500 without CORS
```bash
# Check if Lambda exists
aws lambda get-function --function-name growksh-website-signup-feature-77d07ae1 \
  --region ap-south-1

# Check CloudWatch logs
aws logs tail /aws/lambda/growksh-website-signup-feature-77d07ae1 --since 10m --region ap-south-1 -f
```

### Issue: "Custom auth lambda trigger is not configured"
```bash
# Verify triggers are attached
aws cognito-idp describe-user-pool --user-pool-id ap-south-1_NiqhNWvf8 \
  --region ap-south-1 --query 'UserPool.LambdaConfig.DefineAuthChallenge'
```

Should return Lambda ARN, not null

### Issue: Stale CloudFront cache
1. **Hard refresh**: Ctrl+Shift+R
2. **Clear browser cache**: DevTools → Application → Cache Storage → Delete all
3. **CloudFront invalidation** (if needed):
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id d12jf2jvld5mg4 \
     --paths "/*" \
     --region ap-south-1
   ```

---

## 📋 Deployment Timeline

| Step | Task | Time |
|------|------|------|
| 1 | Package Lambdas | 2-3 min |
| 2 | Deploy IAM stack | 1-2 min |
| 3 | Deploy Database stack | 2-3 min |
| 4 | Deploy WAF stack | 2-3 min |
| 5 | Deploy Lambda Code Bucket | 1-2 min |
| 6 | Deploy Cognito Lambdas | 3-5 min |
| 7 | Deploy Cognito User Pool | 3-5 min |
| 8 | Deploy Storage/CDN | 5-10 min |
| 9 | Deploy API Gateway | 2-3 min |
| 10 | Deploy API Lambdas | 3-5 min |
| 11 | Upload Lambda code | 2-3 min |
| **Total** | **All steps** | **~30-45 min** |

---

## ✅ Success Criteria

- [ ] All 9 CloudFormation stacks in `CREATE_COMPLETE` or `UPDATE_COMPLETE`
- [ ] 8 Lambda functions deployed (`growksh-website-*-feature-77d07ae1`)
- [ ] Lambda code in S3: `s3://growksh-website-lambda-code-feature-77d07ae1/`
- [ ] Cognito triggers attached (6 Lambda ARNs in LambdaConfig)
- [ ] `POST /auth/signup` returns 201 with CORS headers
- [ ] `POST /auth/check-user` returns 200 with CORS headers
- [ ] Sign-in flow sends OTP email and signs in successfully

---

## 📚 Documentation

- `DEPLOYMENT_FOR_FEATURE_77D07AE1.md` - Detailed guide
- `INFRASTRUCTURE_FIX_SUMMARY.md` - Technical explanation
- `Deploy-Feature-Env.ps1` - Automated deployment script

---

## 🆘 Need Help?

1. **Check logs**: `aws logs tail /aws/lambda/growksh-website-* --region ap-south-1 -f`
2. **Describe stack**: `aws cloudformation describe-stacks --stack-name growksh-website-* --region ap-south-1`
3. **List resources**: `aws cloudformation list-stack-resources --stack-name growksh-website-* --region ap-south-1`
4. **Check IAM role**: `aws iam get-role --role-name growksh-website-auth-lambda-role-feature-77d07ae1`
