# Quick Reference: API Configuration System

## One-Line Summary
✅ **API URL is now automatically fetched from CloudFormation and injected during deployment**

---

## How It Works (30 seconds)

1. **Developer pushes code** → GitHub Actions triggered
2. **CloudFormation deploys stacks** → API Gateway created
3. **Workflow queries CloudFormation** → Gets API endpoint
4. **Workflow updates runtime-config.js** → Injects API URL
5. **Build & upload to S3** → User downloads app with API URL
6. **App starts** → API URL available immediately

---

## For End Users: Nothing Changes
Your app works exactly the same - API URL is just configured automatically now.

---

## For Developers: Here's What Changed

### Before (Manual)
```bash
# Had to manually run this
./infra/scripts/update-runtime-config.sh prod

# Easy to forget, error-prone
```

### After (Automatic) ✅
```bash
# Just push code
git push origin main

# GitHub Actions handles everything automatically
# ✅ Deploys stacks
# ✅ Fetches API URL
# ✅ Injects into config
# ✅ Uploads to S3
# ✅ Invalidates CloudFront
```

---

## Files You Care About

| File | Purpose | Changes |
|------|---------|---------|
| `.github/workflows/deploy-*.yaml` | CI/CD automation | **UPDATED** - Now fetches & injects API URL |
| `src/lib/configLoader.js` | Config loading | **NEW** - Smart fallback mechanism |
| `src/lib/cognito.js` | Auth logic | **UPDATED** - Uses async config loader |
| `public/runtime-config.js` | Runtime config | **Same** - Now auto-updated by CI/CD |
| `docs/PRODUCTION_CONFIG_SETUP.md` | Documentation | **NEW** - Comprehensive setup guide |

---

## Common Scenarios

### Scenario 1: You Push Code
```bash
git push origin main
```
**What happens:**
- ✅ GitHub Actions runs automatically
- ✅ CloudFormation deploys
- ✅ API URL fetched and injected
- ✅ App uploaded with correct config
- ✅ Done! No manual steps

### Scenario 2: You Want to Deploy Again
```bash
git push origin main
```
**Same as above** - Everything is automatic now

### Scenario 3: You Need to Debug Config
```javascript
// In browser console
console.log(window.__GROWKSH_RUNTIME_CONFIG__)

// Or use the loader
import { getApiUrl } from './src/lib/configLoader'
getApiUrl().then(url => console.log(url))
```

### Scenario 4: Config is Missing
✅ **Good news:** The system has fallbacks!
1. Checks window config
2. Checks environment variables
3. Checks CloudFormation (future)
4. Shows helpful error message

---

## Deployment Checklist

When deploying, just check:
- [ ] Code is committed
- [ ] Push to correct branch (main/develop/feature)
- [ ] GitHub Actions workflow runs (watch it in Actions tab)
- [ ] All steps pass ✅
- [ ] Test the deployed URL

**That's it!** No manual configuration needed.

---

## API URLs by Environment

| Env | Branch | Stack Name | Config Auto-Updated |
|-----|--------|-----------|-------------------|
| Production | `main` | `growksh-website-api-prod` | ✅ Yes |
| Development | `develop` | `growksh-website-api-dev` | ✅ Yes |
| Feature | Feature branches | `growksh-website-api-feature-{hash}` | ✅ Yes |

---

## Testing Locally

```bash
# Use environment variable for local dev
export VITE_API_URL=http://localhost:3000

npm run dev
```

The app will use this URL locally.

---

## If Something Goes Wrong

### Problem: "API_URL is not configured"

**Step 1:** Check GitHub Actions logs
```
Go to: GitHub > Actions > Latest workflow > View logs
```

**Step 2:** Look for these steps:
```
- Get API Endpoint from CloudFormation ← Check this
- Update runtime-config.js with API URL ← Check this
```

**Step 3:** Check S3 content
```bash
aws s3 cp s3://dev-growksh-website/runtime-config.js - | grep VITE_API_URL
```

**Step 4:** Check CloudFormation
```bash
aws cloudformation describe-stacks \
  --stack-name growksh-website-api-prod \
  --query 'Stacks[0].Outputs'
```

### Problem: API URL is Wrong

**Hard refresh browser:**
- Chrome/Linux: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`
- Or clear cache manually

---

## Key Concepts

### 1. **CI/CD Injection** (Primary)
- API URL fetched from CloudFormation during deployment
- Injected into `public/runtime-config.js`
- Uploaded to S3
- **No runtime overhead** ✅

### 2. **Runtime Fallback** (Safety Net)
- If config missing, tries environment variables
- If still missing, shows helpful error
- **Never silently fails** ✅

### 3. **CloudFront Cache**
- Automatically invalidated on deploy
- Cache busting for runtime-config.js
- Users always get latest version ✅

---

## Useful Commands

### View current config:
```bash
aws s3 cp s3://dev-growksh-website/runtime-config.js - | less
```

### View CloudFormation exports:
```bash
aws cloudformation describe-stacks \
  --stack-name growksh-website-api-prod \
  --query 'Stacks[0].Outputs' \
  --output table
```

### Check CloudFront distribution:
```bash
aws cloudfront list-distributions \
  --query 'DistributionList.Items[0].{Id:Id,DomainName:DomainName}' \
  --output table
```

### Manually invalidate cache (if needed):
```bash
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

---

## Documentation

- **Setup & Troubleshooting:** See `docs/PRODUCTION_CONFIG_SETUP.md`
- **Implementation Details:** See `PRODUCTION_CONFIG_IMPLEMENTATION.md`
- **Original Config Issues:** See `WINDOWS_DEPLOYMENT_GUIDE.md` (legacy)

---

## TL;DR

**Before:** Manual API URL configuration ❌  
**After:** Automatic CI/CD injection ✅

**What you do:** `git push`  
**What happens:** Automatic config + deploy  
**Result:** No manual configuration needed ever

---

## Questions?

1. **How does it work?** → Read `docs/PRODUCTION_CONFIG_SETUP.md`
2. **How do I debug?** → Check GitHub Actions logs
3. **Can I test locally?** → Set `VITE_API_URL` env var
4. **What if it fails?** → Check troubleshooting section above
