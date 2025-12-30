# Signup API Configuration Fix

## Problem
Signup failed with error: "API_URL is not configured. For deployments, set VITE_API_URL in public/runtime-config.js (and invalidate CloudFront for runtime-config.js + index.html)."

The frontend application requires the API Gateway endpoint URL to be configured at runtime, but it wasn't being populated after deployment.

## Solution
Implemented a complete automated runtime configuration system that populates deployment-specific values after CloudFormation stacks are deployed.

### Changes Made

#### 1. **Created Post-Deployment Script** (`infra/scripts/update-runtime-config.sh`)
   - Runs **after** all CloudFormation stacks are deployed
   - Fetches deployment-specific values from CloudFormation exports:
     - `VITE_API_URL` from API Gateway endpoint
     - `VITE_COGNITO_USER_POOL_ID` from Cognito User Pool
     - `VITE_COGNITO_CLIENT_ID` from Cognito App Client
   - Updates `public/runtime-config.js` with actual values
   - Uploads updated config to S3 with no-cache headers
   - Invalidates CloudFront distribution for all paths (`/*`)

#### 2. **Updated CloudFormation Exports** (`infra/cloudformation/02-cognito-stack.yaml`)
   - Added new exports for runtime config:
     - `growksh-website-${Environment}-cognito-user-pool-id`
     - `growksh-website-${Environment}-cognito-client-id`
   - Existing API Gateway stack (`06-api-gateway-stack.yaml`) already exports:
     - `growksh-website-${Environment}-api-endpoint`
   - Existing Storage/CDN stack (`05-storage-cdn-stack.yaml`) already exports:
     - `growksh-website-${Environment}-cloudfront-id`

#### 3. **Updated Deployment Script** (`infra/scripts/deploy-stacks.sh`)
   - Added post-deployment step that calls `update-runtime-config.sh`
   - Runs immediately after all 10 stages complete
   - Non-blocking: warns if update fails but deployment is still successful

#### 4. **Updated Runtime Config File** (`public/runtime-config.js`)
   - Added documentation explaining which values are auto-populated
   - `VITE_API_URL` is now marked as AUTO-POPULATED
   - Still loaded in `index.html` before React app initializes

### How It Works

1. **Deployment Phase**
   - User runs: `./infra/scripts/deploy-stacks.sh dev` (or other environment)
   - All 10 CloudFormation stacks deploy in correct order
   - Stacks export their ARNs and configuration values

2. **Post-Deployment Phase**
   - `update-runtime-config.sh` automatically runs
   - Queries CloudFormation exports for actual values
   - Updates `public/runtime-config.js` with:
     - API Gateway endpoint URL → `VITE_API_URL`
     - Cognito User Pool ID → `VITE_COGNITO_USER_POOL_ID`
     - Cognito Client ID → `VITE_COGNITO_CLIENT_ID`
   - Uploads updated file to S3 with `Cache-Control: max-age=0`
   - Invalidates entire CloudFront distribution (`/*`)

3. **Runtime Phase**
   - Browser loads `index.html`
   - `<script src="/runtime-config.js">` loads configuration
   - Sets `window.__GROWKSH_RUNTIME_CONFIG__` globally
   - React app initializes and uses values from `getApiUrl()`, `getUserPoolId()`, etc.
   - All API calls now have correct endpoint URL

### File Structure
```
infra/
├── scripts/
│   ├── deploy-stacks.sh                    # Updated: calls update-runtime-config.sh
│   ├── update-runtime-config.sh            # NEW: post-deployment configuration
│   └── build-and-upload-lambdas.sh         # (unchanged)
├── cloudformation/
│   ├── 02-cognito-stack.yaml               # Updated: added runtime config exports
│   ├── 05-storage-cdn-stack.yaml           # (unchanged: exports cloudfront-id)
│   ├── 06-api-gateway-stack.yaml           # (unchanged: exports api-endpoint)
│   └── ... (other stacks)
public/
├── runtime-config.js                       # Updated: added auto-population docs
└── index.html                              # (unchanged: loads runtime-config.js)
src/
├── lib/
│   ├── cognito.js                          # (unchanged: reads from window.__GROWKSH_RUNTIME_CONFIG__)
│   └── ...
└── ...
```

### Usage

#### Standard Deployment
```bash
cd growksh-website
./infra/scripts/deploy-stacks.sh dev
# Automatically updates runtime config after deployment
```

#### Manual Runtime Config Update (if needed)
```bash
./infra/scripts/update-runtime-config.sh dev
```

### Verification

After deployment, verify the runtime config was updated:

1. **Check S3**
   ```bash
   aws s3 cp s3://growksh-website-dev-assets/runtime-config.js - | head -20
   ```

2. **Check CloudFront** (give a few minutes for invalidation to complete)
   - Browser DevTools → Network → runtime-config.js
   - Should see `Cache-Control: no-cache` header
   - Should contain actual `VITE_API_URL` value (not empty)

3. **Check Browser Console**
   ```javascript
   window.__GROWKSH_RUNTIME_CONFIG__
   // Should show populated values, not empty strings
   ```

### Troubleshooting

#### "API_URL is not configured" still appears
1. **Check CloudFront invalidation** - Wait up to 15 minutes for cache to clear
2. **Hard refresh** - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check S3** - Verify runtime-config.js file exists and has correct content
4. **Manual deployment** - Run `./infra/scripts/update-runtime-config.sh dev` manually

#### Runtime config update fails during deployment
1. Check CloudFormation stacks are actually deployed
2. Verify IAM credentials have S3 and CloudFront permissions
3. Check S3 bucket exists and is accessible
4. Deployment succeeds even if this step fails; you can manually rerun the script

#### Export not found errors
1. Ensure all CloudFormation stacks deployed successfully
2. Check stack names include the environment: `growksh-website-dev-*`
3. Wait a few moments for exports to become available after deployment

### What Problem This Solves

**Before**: Frontend had hardcoded or empty API URL, signup failed
**After**: API URL is automatically configured per environment from actual CloudFormation exports

**Benefits**:
- ✅ No hardcoded URLs in code
- ✅ Different URL per environment (dev, prod, feature branches)
- ✅ Automatically updated on each deployment
- ✅ CloudFront cache invalidated to serve fresh config
- ✅ Deployment fully self-contained (no manual config steps)
