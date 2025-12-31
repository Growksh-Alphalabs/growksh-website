# Production API Configuration Setup

## Overview

This document explains how the API URL is configured in production environments.

## How It Works

The system uses a **two-layer approach** to ensure the API URL is always available:

### Layer 1: CI/CD Injection (Recommended) ✅

**What happens during deployment:**

1. GitHub Actions deploys CloudFormation stacks
2. After successful deployment, the workflow queries CloudFormation for the API endpoint
3. The API URL is automatically injected into `public/runtime-config.js`
4. The updated runtime config is uploaded to S3
5. CloudFront cache is invalidated

**Timeline:**
- ⏱️ No runtime overhead
- ⏱️ API URL available immediately on app load
- ⏱️ Works offline

**Configuration Files:**
- `.github/workflows/deploy-prod.yaml` - Production deployment
- `.github/workflows/deploy-develop.yaml` - Development deployment  
- `.github/workflows/deploy-ephemeral.yaml` - Feature branch deployments

**Key Step in Workflow:**
```yaml
- name: Get API Endpoint from CloudFormation
  id: api-config
  run: |
    API_ENDPOINT=$(aws cloudformation describe-stacks \
      --stack-name growksh-website-api-${ENVIRONMENT} \
      --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
      --output text)
    echo "api_endpoint=$API_ENDPOINT" >> $GITHUB_OUTPUT

- name: Update runtime-config.js with API URL
  run: |
    sed -i "s|VITE_API_URL: ''|VITE_API_URL: '${{ steps.api-config.outputs.api_endpoint }}'|g" public/runtime-config.js
```

### Layer 2: Runtime Fallback (Safety Net) 🛡️

**When CI/CD injection fails or API URL is missing:**

The app automatically attempts to load the API URL at runtime using the `configLoader.js` module.

**How it works:**

1. App checks `window.__GROWKSH_RUNTIME_CONFIG__.VITE_API_URL` (from HTML)
2. Falls back to environment variables (`import.meta.env.VITE_API_URL`)
3. Can be extended to fetch from CloudFormation exports via Lambda

**Implementation:**
- `src/lib/configLoader.js` - Configuration loader with fallback logic
- `src/lib/cognito.js` - Uses configLoader for safe API URL retrieval

**Usage:**
```javascript
import { getApiUrl } from './lib/configLoader'

// Automatically tries all fallback mechanisms
const apiUrl = await getApiUrl()
```

---

## Files Involved

### Runtime Configuration
- **`public/runtime-config.js`** - Loaded by index.html before React app
  - Contains API endpoint, Cognito config
  - Updated by CI/CD during deployment
  - Uploaded to S3 and served by CloudFront

### Application Code
- **`src/lib/configLoader.js`** - Configuration loading with fallbacks
  - `getApiUrl()` - Get API endpoint with fallbacks
  - `getConfig()` - Get full configuration
  - `validateConfig()` - Validate configuration integrity

- **`src/lib/cognito.js`** - Cognito/Auth operations
  - `signup()` - Uses async API URL with fallback
  - `checkUserExists()` - Uses async API URL with fallback

### CI/CD Workflows
- **`.github/workflows/deploy-prod.yaml`** - Production deployments
- **`.github/workflows/deploy-develop.yaml`** - Development deployments
- **`.github/workflows/deploy-ephemeral.yaml`** - Feature branch deployments

---

## Deployment Flow

```
┌─────────────────────────────────────────┐
│ 1. Push code to main/develop/PR         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ 2. GitHub Actions workflow triggered    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ 3. Deploy CloudFormation stacks         │
│    - API Gateway created                │
│    - Stack outputs available            │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ 4. Query CloudFormation for API URL     │
│    - Get ApiEndpoint output             │
│    - Store in GitHub variable           │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ 5. Update public/runtime-config.js      │
│    - Inject API URL                     │
│    - Keep all other configs             │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ 6. Build React app                      │
│    - npm run build                      │
│    - Output to dist/                    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ 7. Upload to S3                         │
│    - Upload dist/* to S3 bucket         │
│    - Upload public/runtime-config.js    │
│      with no-cache headers              │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ 8. Invalidate CloudFront cache          │
│    - Clear all paths (/*) from CDN      │
│    - Users get latest version           │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ 9. App loads in browser                 │
│    - Fetch public/runtime-config.js     │
│    - Load __GROWKSH_RUNTIME_CONFIG__    │
│    - React app starts with API URL      │
└─────────────────────────────────────────┘
```

---

## How It Appears in Browser

### index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Loads runtime config BEFORE React app -->
    <script src="/runtime-config.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### window.__GROWKSH_RUNTIME_CONFIG__ (in browser console)
```javascript
{
  VITE_COGNITO_USER_POOL_ID: "ap-south-1_eZJJn3M9A",
  VITE_COGNITO_CLIENT_ID: "2uaba43qlqlnach4jdbk3mm29p",
  VITE_API_URL: "https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/prod",
  VITE_AWS_REGION: "ap-south-1",
  VITE_USE_FAKE_AUTH: "0"
}
```

---

## Debugging

### Check what config is loaded:
```javascript
// In browser console
console.log(window.__GROWKSH_RUNTIME_CONFIG__)
```

### Check if API URL is available:
```javascript
// In browser console
import { getApiUrl } from './src/lib/configLoader'
getApiUrl().then(url => console.log('API URL:', url))
```

### Check runtime config in S3:
```bash
aws s3 cp s3://dev-growksh-website/runtime-config.js - | grep VITE_API_URL
```

### Check CloudFormation exports:
```bash
# Get API endpoint
aws cloudformation describe-stacks \
  --stack-name growksh-website-api-prod \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

---

## Environment-Specific API Endpoints

| Environment | Stack Name | API Endpoint |
|---|---|---|
| Production | `growksh-website-api-prod` | `https://{id}.execute-api.ap-south-1.amazonaws.com/prod` |
| Development | `growksh-website-api-dev` | `https://{id}.execute-api.ap-south-1.amazonaws.com/dev` |
| Feature branches | `growksh-website-api-feature-{hash}` | `https://{id}.execute-api.ap-south-1.amazonaws.com/feature-{hash}` |

---

## Common Issues & Solutions

### Issue: "API_URL is not configured"

**Possible causes:**
1. ❌ `public/runtime-config.js` has empty `VITE_API_URL`
2. ❌ CloudFront cache not invalidated
3. ❌ CloudFormation API stack deployment failed

**Solutions:**
1. ✅ Check GitHub Actions workflow logs
2. ✅ Manually invalidate CloudFront cache
3. ✅ Verify CloudFormation stack deployed successfully
4. ✅ Check S3 bucket has updated runtime-config.js

### Issue: Wrong API endpoint being used

**Possible causes:**
1. ❌ Old CloudFront cache
2. ❌ Using wrong S3 bucket
3. ❌ Deploying to wrong environment

**Solutions:**
1. ✅ Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
2. ✅ Verify CloudFront distribution points to correct S3 bucket
3. ✅ Check GitHub Actions deployed to correct environment

### Issue: API calls failing after deployment

**Possible causes:**
1. ❌ API Gateway not deployed
2. ❌ Lambda functions not updated
3. ❌ CORS not configured on API

**Solutions:**
1. ✅ Check CloudFormation API stack events
2. ✅ Verify Lambda functions deployed
3. ✅ Check API Gateway CORS configuration

---

## Monitoring

### CloudWatch Metrics to Monitor:
- API Gateway request count
- Lambda function errors
- CloudFront cache hit rate
- S3 object count/size

### Logs to Check:
- CloudFormation events: `aws cloudformation describe-stack-events`
- API Gateway logs: CloudWatch Logs group `/aws/apigateway/...`
- Lambda logs: CloudWatch Logs group `/aws/lambda/...`

---

## Best Practices

1. ✅ **Always wait for CloudFormation to complete** before updating runtime config
2. ✅ **Always invalidate CloudFront after updating** runtime-config.js
3. ✅ **Never hardcode API URLs** in code
4. ✅ **Use environment variables** for local development
5. ✅ **Test deployments** to dev first before production
6. ✅ **Monitor CloudFront cache** to avoid stale config
7. ✅ **Have a rollback plan** for failed deployments

---

## Future Enhancements

Possible improvements to this setup:

1. **Lambda Config API** - Create a Lambda function that returns current config
   - Endpoint: `/api/config`
   - Response: `{ apiEndpoint, cognitoPoolId, clientId }`

2. **Config Versioning** - Track config changes in CloudWatch
   - Log every deployment's API URL
   - Alert on unexpected changes

3. **Health Checks** - Verify API endpoint is responding
   - Add health check to workflow
   - Rollback if API is unreachable

4. **Configuration Caching** - Cache config in browser localStorage
   - Reduce S3 requests
   - Work offline if config is cached

---

## References

- GitHub Actions: `.github/workflows/`
- CloudFormation Stacks: `infra/cloudformation/06-api-gateway-stack.yaml`
- Configuration Loader: `src/lib/configLoader.js`
- Runtime Config: `public/runtime-config.js`
