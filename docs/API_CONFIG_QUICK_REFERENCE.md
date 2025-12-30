# Quick Reference: API Configuration Fix

## The Problem ❌
Signup page error: "API_URL is not configured. For deployments, set VITE_API_URL in public/runtime-config.js"

## The Solution ✅
Automated post-deployment script that populates `VITE_API_URL` from CloudFormation

## What Changed
1. **Created**: `infra/scripts/update-runtime-config.sh`
   - Auto-runs after `deploy-stacks.sh` completes
   - Fetches API URL from CloudFormation exports
   - Updates and uploads to S3
   - Invalidates CloudFront

2. **Updated**: `infra/scripts/deploy-stacks.sh`
   - Added post-deployment step (non-blocking)

3. **Updated**: `infra/cloudformation/02-cognito-stack.yaml`
   - Added exports for runtime config values

4. **Updated**: `public/runtime-config.js`
   - Added documentation

## To Deploy
```bash
./infra/scripts/deploy-stacks.sh dev
# Automatically updates runtime config after deployment
```

## To Verify
```bash
# Check the file locally
grep VITE_API_URL public/runtime-config.js

# Check in S3 (after deployment)
aws s3 cp s3://growksh-website-dev-assets/runtime-config.js -

# Or in browser DevTools
window.__GROWKSH_RUNTIME_CONFIG__.VITE_API_URL
```

## If Something Breaks
1. **"API_URL is still empty"** → Wait for CloudFront invalidation (~15 min), hard refresh
2. **Script failed during deployment** → Manually run: `./infra/scripts/update-runtime-config.sh dev`
3. **S3 upload failed** → Check IAM credentials have S3 permissions
4. **CloudFront invalidation failed** → Manually invalidate: `aws cloudfront create-invalidation --distribution-id xxx --paths "/*"`

## Architecture
```
Deploy → CloudFormation (exports API endpoint) → 
update-runtime-config.sh (queries exports) → 
Update public/runtime-config.js → 
Upload to S3 → 
Invalidate CloudFront → 
Browser loads fresh config ✅
```

Done! Signup should now work. 🎉
