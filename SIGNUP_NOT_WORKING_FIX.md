# Signup Not Working - How to Fix

## Current Status
- `VITE_API_URL` is empty in `runtime-config.js`
- `.env.local` values were mismatched (now fixed)
- CloudFormation stacks haven't been deployed yet

## Two Ways to Fix This

### Option 1: Deploy Infrastructure (Recommended for Testing)

Run the complete deployment:
```bash
cd d:\Growksh\growksh-website
./infra/scripts/deploy-stacks.sh dev
```

This will:
1. Deploy all 10 CloudFormation stacks
2. Automatically populate `VITE_API_URL` in `runtime-config.js`
3. Upload config to S3
4. Invalidate CloudFront
5. Signup will work ✅

**Estimated time**: 15-30 minutes

---

### Option 2: Quick Local Testing

If you just want to test the signup UI locally without deploying:

#### Step 1: Get the API Endpoint
If you have an API Gateway already deployed, get its endpoint:
```bash
aws apigateway get-rest-apis --query "items[?name=='growksh-website-api-dev'].id" --output text
# Then get the stage invoke URL
aws apigateway get-stage --rest-api-id <id> --stage-name dev --query 'invokeUrl' --output text
```

Or use an existing endpoint from `.env.local`.

#### Step 2: Update runtime-config.js
Edit `public/runtime-config.js` and set:
```javascript
VITE_API_URL: 'https://xxxxxxx.execute-api.ap-south-1.amazonaws.com/dev',
```

Replace with actual endpoint.

#### Step 3: Restart Dev Server
```bash
npm run dev
```

#### Step 4: Test Signup
- Open `http://localhost:5173`
- Try signup
- Should work now ✅

---

## What Was Fixed

1. ✅ `index.html` - Fixed script tag to load `/runtime-config.js`
2. ✅ `.env.local` - Updated to correct Cognito Pool ID and Client ID

## What's Still Needed

You need **ONE** of:
- Deploy CloudFormation stacks (Option 1) ← **RECOMMENDED**
- Manually set `VITE_API_URL` in `public/runtime-config.js` (Option 2)

---

## Debugging: How to Verify

Open browser DevTools → Console and run:
```javascript
window.__GROWKSH_RUNTIME_CONFIG__
```

Should see:
```javascript
{
  VITE_COGNITO_USER_POOL_ID: "ap-south-1_eZJJn3M9A",
  VITE_COGNITO_CLIENT_ID: "2uaba43qlqlnach4jdbk3mm29p",
  VITE_API_URL: "https://xxxxx.execute-api.ap-south-1.amazonaws.com/dev",  // Should NOT be empty
  VITE_AWS_REGION: "ap-south-1",
  VITE_USE_FAKE_AUTH: "0"
}
```

If `VITE_API_URL` is empty → Use Option 2 above to set it manually.
If values don't match → Restart dev server with `npm run dev`.

---

## Summary

| Issue | Fix | Status |
|-------|-----|--------|
| Script not loading | Fixed index.html | ✅ Done |
| Wrong Cognito IDs | Fixed .env.local | ✅ Done |
| API URL empty | Deploy OR set manually | ⏳ **YOU NEED TO DO THIS** |

Choose Option 1 or 2 above to complete the fix!
