# CloudFront Cache Issue - Sign-In Failing

## Problem
When signing in, you see: **"Custom auth lambda trigger is not configured for the user pool."**

This means the browser is using an **old Cognito pool** (`ap-south-1_eZJJn3M9A`) instead of the new one with triggers (`ap-south-1_KjzKKZVDm`).

The old pool ID is cached in CloudFront's `runtime-config.js` and won't refresh without explicit invalidation.

## Root Cause
- S3 object `public/runtime-config.js` has been **updated** with the correct pool/client IDs
- CloudFront is **caching the old version** (max-age=3600, served at ~06:29 UTC)
- Browser requests for `https://dauro3ahy76qw.cloudfront.net/runtime-config.js` hit CloudFront's cache and never reach the updated S3 origin

## What's in S3 (Correct)
```javascript
VITE_COGNITO_USER_POOL_ID: 'ap-south-1_KjzKKZVDm',  // ✅ Has triggers
VITE_COGNITO_CLIENT_ID: '2idkk2pafuhbrcfr62uanh3mt8',
VITE_API_URL: 'https://dfinny76s0.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1',
```

## What's in CloudFront (Stale)
```javascript
VITE_COGNITO_USER_POOL_ID: 'ap-south-1_eZJJn3M9A',  // ❌ No triggers
VITE_COGNITO_CLIENT_ID: '2uaba43qlqlnach4jdbk3mm29p',
VITE_API_URL: 'https://dfinny76s0.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1',
```

## Fix: Invalidate CloudFront Cache

You must run this **from your 720427058396 AWS account** with a role that has `cloudfront:CreateInvalidation`:

### Step 1: Find the CloudFront Distribution ID for `dauro3ahy76qw.cloudfront.net`

```bash
export AWS_PROFILE=<your-deploy-role-in-720427058396>

# List all distributions
aws cloudfront list-distributions --region us-east-1 | grep -A 10 "dauro3ahy76qw"

# Or directly list all:
aws cloudfront list-distributions --region us-east-1 --query 'DistributionList.Items[*].[Id,DomainName]' --output table
```

Find the distribution ID (looks like `E3I77LK2U44KCM` or similar) for domain `dauro3ahy76qw.cloudfront.net`.

### Step 2: Create CloudFront Invalidation

Replace `DISTRIBUTION_ID` with the actual ID from Step 1:

```bash
export AWS_PROFILE=<your-deploy-role-in-720427058396>

aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/runtime-config.js" "/index.html" "/" \
  --region us-east-1
```

### Step 3: Verify Invalidation

```bash
# Check invalidation status (replace DISTRIBUTION_ID and INVALIDATION_ID from output above)
aws cloudfront get-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --id INVALIDATION_ID \
  --region us-east-1
```

Wait until status is `Completed`.

### Step 4: Hard Refresh Browser

After invalidation completes, do:
- Open `https://dauro3ahy76qw.cloudfront.net`
- Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
- Check browser console:
  ```javascript
  window.__GROWKSH_RUNTIME_CONFIG__.VITE_COGNITO_USER_POOL_ID
  // Should print: ap-south-1_KjzKKZVDm
  ```

### Step 5: Try Sign-In Again

The sign-in page should now use the correct pool with custom auth triggers configured.

## Automated Fix (if you have CloudFormation exports)

If your CloudFront distribution is managed by CloudFormation in account 720427058396:

```bash
export AWS_PROFILE=<your-deploy-role-in-720427058396>

DIST_ID=$(aws cloudformation list-exports \
  --query "Exports[?Name=='growksh-website-feature-77d07ae1-cloudfront-id'].Value" \
  --output text \
  --region us-east-1)

if [ -n "$DIST_ID" ]; then
  aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/*" \
    --region us-east-1
  echo "✅ Invalidation created for distribution: $DIST_ID"
else
  echo "⚠️  Could not find CloudFront distribution ID in CloudFormation exports"
fi
```

## Prevention

The deploy scripts now include strict guardrails to prevent accidental deployments with wrong AWS credentials. All scripts require:
- `AWS_PROFILE` to be set
- Active AWS account to match `720427058396`

This prevents future issues from mixing data across accounts.
