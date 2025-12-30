# Root Cause Analysis: Signup API_URL Error

## Problem Observed
When clicking the signup button, error appeared:
```
Signup Failed
API_URL is not configured. For deployments, set VITE_API_URL in public/runtime-config.js (and invalidate CloudFront for runtime-config.js + index.html).
```

## Root Cause Found
The `runtime-config.js` file was **not being loaded at all** due to an incorrect script tag in `index.html`.

### The Bug
**File**: `index.html` (line 9)
```html
<!-- WRONG (template variable not replaced) -->
<script src="%BASE_URL%runtime-config.js"></script>
```

The `%BASE_URL%` is a template variable used in some build systems, but Vite (the build tool used in this project) doesn't use this format. The variable was never replaced, resulting in the browser trying to load a file literally named `%BASE_URL%runtime-config.js` - which doesn't exist.

### Why It Went Unnoticed
1. The onerror handler only logs to console (doesn't show UI error)
2. The app still loads and runs - React initializes successfully
3. Only when signup is clicked does the code try to read `window.__GROWKSH_RUNTIME_CONFIG__`
4. Since the script never loaded, that object was never created
5. `getApiUrl()` returns empty string
6. Signup function throws the error

### Complete Execution Flow (With Bug)

```
1. Browser loads index.html
2. <script src="%BASE_URL%runtime-config.js"> tries to load
   ├─ Browser looks for file: /%BASE_URL%runtime-config.js (literal path)
   ├─ File NOT found (404)
   ├─ onerror handler only logs to console
   └─ Script execution skipped ❌

3. React app initializes normally
   ├─ Loads src/main.jsx
   ├─ Mounts Signup component
   └─ UI renders normally

4. User clicks signup button
   ├─ Signup.jsx calls signup() function
   ├─ signup() calls getApiUrl()
   ├─ getApiUrl() tries to read window.__GROWKSH_RUNTIME_CONFIG__
   ├─ Object doesn't exist (script never loaded)
   ├─ Returns empty string ''
   └─ Throws error: "API_URL is not configured" ❌
```

## The Fix
**Changed**: `index.html` line 9
```html
<!-- CORRECT (direct path for Vite) -->
<script src="/runtime-config.js"></script>
```

This is the proper Vite syntax because:
- Vite serves public directory assets directly
- `/runtime-config.js` maps to `public/runtime-config.js`
- No template variable replacement needed

## Complete Execution Flow (After Fix)

```
1. Browser loads index.html
2. <script src="/runtime-config.js"> loads correctly
   ├─ Browser requests /runtime-config.js
   ├─ File found in public/runtime-config.js (served by dev server / S3+CloudFront)
   ├─ Script executes
   ├─ Sets window.__GROWKSH_RUNTIME_CONFIG__ globally ✅
   └─ Contains VITE_API_URL value (or empty if not deployed yet)

3. React app initializes
   ├─ Loads src/main.jsx
   ├─ Mounts Signup component
   └─ UI renders

4. User clicks signup button
   ├─ Signup.jsx calls signup() function
   ├─ signup() calls getApiUrl()
   ├─ getApiUrl() reads window.__GROWKSH_RUNTIME_CONFIG__.VITE_API_URL
   ├─ Returns actual API URL (if set) or empty string (if not deployed)
   ├─ If empty and local dev: uses environment variables from .env.local
   └─ Signup request succeeds ✅
```

## Why the Original Bug Existed

The `%BASE_URL%` pattern comes from:
- Create React App (uses `%PUBLIC_URL%` in index.html)
- Some other build tools

But this project uses **Vite**, which has a different approach:
- Vite automatically serves the `public/` directory at root (`/`)
- No template variable replacement needed
- Just use `/filename` directly

## What Was Already Working
All the runtime configuration infrastructure was correctly implemented:
1. ✅ `public/runtime-config.js` created with correct structure
2. ✅ `update-runtime-config.sh` script to auto-populate values
3. ✅ `src/lib/cognito.js` correctly reads from `window.__GROWKSH_RUNTIME_CONFIG__`
4. ✅ CloudFormation exports configured correctly
5. ✅ Deployment script integration complete

The **only** issue was the loading mechanism in index.html.

## Verification

### Local Development
1. Ensure `.env.local` has `VITE_API_URL` set (fallback for local dev)
2. Open browser DevTools → Console
3. Check: `window.__GROWKSH_RUNTIME_CONFIG__`
4. Should show object with values, not `undefined`
5. Signup button should work

### Production (After Deployment)
1. Run deployment script: `./infra/scripts/deploy-stacks.sh dev`
2. This automatically populates `VITE_API_URL` in runtime-config.js
3. File is uploaded to S3 and CloudFront is invalidated
4. Browser loads fresh config with actual API endpoint
5. Signup works without any manual config changes

## Files Changed
- `index.html` - Fixed script tag from `%BASE_URL%runtime-config.js` to `/runtime-config.js`

That's it! No other files needed changes because everything else was already correct.
