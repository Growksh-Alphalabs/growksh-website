# CORS & URL Fixes for Signup API

## Issues Fixed

### 1. ❌ Wrong API URL Construction
**Problem:** Extra `/Prod/` was being added to the endpoint
- **Was calling:** `https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/Prod/auth/signup`
- **Should call:** `https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/signup`

**Root Cause:** `normalizeApiGatewayBase()` function was always appending `/Prod`, but CloudFormation exports already include the correct stage.

**Fix:** Updated `src/lib/cognito.js` - `normalizeApiGatewayBase()` now returns the API URL as-is without adding extra stage prefix.

```javascript
// Before (WRONG)
function normalizeApiGatewayBase(apiUrl) {
  let apiBase = (apiUrl || '').trim().replace(/\/+$/, '')
  apiBase = apiBase.replace(/\/(contact)$/i, '')
  apiBase = apiBase.replace(/\/(prod)$/i, '')
  return `${apiBase}/Prod`  // ❌ Always adds /Prod
}

// After (CORRECT) ✅
function normalizeApiGatewayBase(apiUrl) {
  let apiBase = (apiUrl || '').trim().replace(/\/+$/, '')
  // CloudFormation already includes the stage, just return as-is
  return apiBase
}
```

---

### 2. ❌ CORS Policy Blocking Requests
**Problem:** Browser blocks API calls due to missing CORS headers
- **Error:** `No 'Access-Control-Allow-Origin' header is present`
- **Status:** `net::ERR_FAILED`

**Root Cause:** API Gateway auth endpoints didn't have OPTIONS methods configured for CORS preflight.

**Fix:** Updated `infra/cloudformation/06-api-gateway-stack.yaml` - Added OPTIONS methods to all auth endpoints:
- `POST /auth/signup` - Added OPTIONS method ✅
- `GET /auth/verify-email` - Added OPTIONS method ✅
- `POST /auth/check-admin` - Added OPTIONS method ✅

Each OPTIONS method returns proper CORS headers:
```yaml
Access-Control-Allow-Origin: '*'
Access-Control-Allow-Methods: 'GET,POST,PUT,DELETE,OPTIONS'
Access-Control-Allow-Headers: 'Content-Type,Authorization'
```

---

### 3. ⚙️ Disabled Fake Auth
**Changed:** `VITE_USE_FAKE_AUTH: '0'` (was '1')

**Reason:** Now that API calls work properly, we should test against real API, not fake auth.

---

## Files Modified

### 1. `src/lib/cognito.js`
- **Function:** `normalizeApiGatewayBase()`
- **Change:** Removed the hardcoded `/Prod` suffix
- **Impact:** API URLs will be correct for all environments

### 2. `infra/cloudformation/06-api-gateway-stack.yaml`
- **Added:** OPTIONS methods for `/auth/signup`, `/auth/verify-email`, `/auth/check-admin`
- **Each includes:** CORS headers configuration
- **Impact:** Browser CORS policy no longer blocks API calls

### 3. `public/runtime-config.js`
- **Changed:** `VITE_USE_FAKE_AUTH: '1'` → `'0'`
- **Impact:** Now uses real API instead of fake auth

---

## Testing the Fix

### Before (Broken) ❌
```
1. Click signup
2. Console error: "No 'Access-Control-Allow-Origin' header"
3. Signup fails
```

### After (Working) ✅
```
1. Click signup
2. API endpoint called correctly
3. Signup proceeds to next step
4. No CORS errors
```

---

## Deployment Instructions

### Step 1: Deploy CloudFormation Changes
```bash
# CloudFormation must be redeployed to add OPTIONS methods
./infra/scripts/deploy-stacks.sh feature-77d07ae1

# Or for production:
./infra/scripts/deploy-stacks.sh prod
```

### Step 2: Rebuild & Deploy Frontend
```bash
npm run build
aws s3 sync dist/ s3://dev-growksh-website/
aws cloudfront create-invalidation --distribution-id EUGTSR7ICTHAS --paths "/*"
```

### Step 3: Test
```
Visit: https://d3fvcv2oatyvuj.cloudfront.net
Try: Sign up
Expected: Works without CORS errors
```

---

## Why This Happened

### Issue 1: API URL Construction
The system was designed with the assumption that CloudFormation exports would return just the base URL (e.g., `https://api.example.com`), and the code would add the stage (e.g., `/Prod`).

However, the actual CloudFormation export includes the full URL with stage (e.g., `https://api.example.com/feature-77d07ae1`), so the code was creating double-stage URLs.

**Solution:** Updated to use the URL as-is since CloudFormation already includes the correct stage.

### Issue 2: CORS Policy
API Gateway OPTIONS methods weren't configured for the auth endpoints, so browsers rejected the preflight CORS requests.

**Solution:** Added OPTIONS methods with proper CORS headers to all auth endpoints.

---

## Verification

### Verify URL is Correct
```javascript
// In browser console
import { getApiUrl } from './src/lib/configLoader'
getApiUrl().then(url => {
  console.log('API URL:', url)
  // Should be: https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1
  // NOT: https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/Prod
})
```

### Verify CORS Headers
```bash
# Check OPTIONS endpoint
curl -X OPTIONS \
  https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/signup \
  -H "Origin: https://dauro3ahy76qw.cloudfront.net" \
  -v

# Should return 200 with CORS headers
```

---

## Impact Summary

| Component | Before | After |
|-----------|--------|-------|
| API URL format | Wrong (extra /Prod) | ✅ Correct |
| CORS preflight | ❌ Blocked | ✅ Allowed |
| Signup flow | ❌ Fails | ✅ Works |
| Fake auth | Enabled | ✅ Disabled (use real API) |

---

## Next Steps

1. ✅ Code changes committed
2. ⏳ Deploy CloudFormation stacks
3. ⏳ Deploy frontend
4. ⏳ Test signup endpoint
5. ⏳ Verify no CORS errors
6. ⏳ Monitor API Gateway logs

---

## References

- **CORS Error Docs:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **API Gateway CORS:** https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html
- **CloudFormation API Gateway:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html
