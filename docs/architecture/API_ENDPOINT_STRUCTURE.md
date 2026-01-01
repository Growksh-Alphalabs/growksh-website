# API Endpoint Structure Explanation

## The Problem We Had

When CloudFormation creates an API Gateway, it exports the base endpoint URL. The question is: **should the client code build the full endpoint, or should it use what CloudFormation provides?**

### Our Setup
CloudFormation exports the **complete** endpoint URL:
```
https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1
```

This already includes:
- ✅ Base domain
- ✅ Stage name (`feature-77d07ae1`)

---

## The Bug

The old code assumed CloudFormation would export just the base:
```
https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com
```

So it added `/Prod` to make:
```
https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/Prod/auth/signup
```

But it was actually getting the **full** URL, so it created:
```
https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/Prod/auth/signup
         ✅ base domain                          ✅ stage              ❌ WRONG - extra Prod
```

---

## The Fix

Now the code uses the URL **exactly as CloudFormation provides it**:

### CloudFormation Export
```
https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1
```

### Client Code
```javascript
const apiUrl = 'https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1'
const signupUrl = `${apiUrl}/auth/signup`
// Result: https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/signup ✅
```

---

## API Endpoint Structure by Environment

### Development Environment
```
Stack Name: growksh-website-api-dev
CloudFormation Export: https://{id}.execute-api.ap-south-1.amazonaws.com/dev
Signup Endpoint: https://{id}.execute-api.ap-south-1.amazonaws.com/dev/auth/signup
```

### Production Environment
```
Stack Name: growksh-website-api-prod
CloudFormation Export: https://{id}.execute-api.ap-south-1.amazonaws.com/prod
Signup Endpoint: https://{id}.execute-api.ap-south-1.amazonaws.com/prod/auth/signup
```

### Feature Branch Environment
```
Stack Name: growksh-website-api-feature-77d07ae1
CloudFormation Export: https://{id}.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1
Signup Endpoint: https://{id}.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/signup
```

---

## How It Works in Code

### 1. CloudFormation Exports URL
```yaml
# infra/cloudformation/06-api-gateway-stack.yaml
Outputs:
  ApiEndpoint:
    Value: !Sub 'https://${ApiGateway}.execute-api.${AWS::Region}.amazonaws.com/${Environment}'
    Export:
      Name: !Sub 'growksh-website-${Environment}-api-endpoint'
```

### 2. CI/CD Injects into Config
```bash
# .github/workflows/deploy-*.yaml
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name growksh-website-api-${ENVIRONMENT} \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text)

# sed updates public/runtime-config.js with this full URL
sed -i "s|VITE_API_URL: ''|VITE_API_URL: '$API_ENDPOINT'|g" public/runtime-config.js
```

### 3. App Uses URL Directly
```javascript
// src/lib/cognito.js
function normalizeApiGatewayBase(apiUrl) {
  // URL is already complete with stage, just trim trailing slashes
  return (apiUrl || '').trim().replace(/\/+$/, '')
}

// Result: Uses URL exactly as provided
const apiBase = normalizeApiGatewayBase(apiUrl)
// apiBase = 'https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1'

const signupUrl = `${apiBase}/auth/signup`
// = 'https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/signup' ✅
```

---

## API Routes

With the API endpoint as the base:
```
Base: https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1
```

All auth endpoints are:
```
POST   /auth/signup          → Sign up new user
GET    /auth/verify-email    → Verify email token
POST   /auth/check-admin     → Check if user is admin
POST   /auth/check-user      → Check if user exists
```

---

## What Changed

### Before ❌
```javascript
function normalizeApiGatewayBase(apiUrl) {
  let apiBase = apiUrl.replace(/\/(contact)$/i, '')
                      .replace(/\/(prod)$/i, '')
  return `${apiBase}/Prod`  // Always appends /Prod
}

// With input: 'https://api.example.com/feature-77d07ae1'
// Returns: 'https://api.example.com/feature-77d07ae1/Prod' ❌ WRONG
```

### After ✅
```javascript
function normalizeApiGatewayBase(apiUrl) {
  return (apiUrl || '').trim().replace(/\/+$/, '')  // Just trim
}

// With input: 'https://api.example.com/feature-77d07ae1'
// Returns: 'https://api.example.com/feature-77d07ae1' ✅ CORRECT
```

---

## Why This Matters

### Before (Bug)
- API calls to wrong URL
- Endpoint: `/feature-77d07ae1/Prod/auth/signup` ❌
- Result: 404 Not Found

### After (Fixed)
- API calls to correct URL  
- Endpoint: `/feature-77d07ae1/auth/signup` ✅
- Result: 200 OK

---

## Lesson Learned

**Don't assume the format of exported values from CloudFormation.** Always:

1. ✅ Check what CloudFormation actually exports
2. ✅ Use it as-is if it's already complete
3. ✅ Only add/modify if necessary
4. ✅ Test with real CloudFormation output

In this case, CloudFormation was already providing the complete endpoint, so we just needed to use it directly.

---

## Testing

### Verify Endpoint Format
```javascript
// In browser console
window.__GROWKSH_RUNTIME_CONFIG__.VITE_API_URL
// Should be: https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1
// NOT: https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/Prod
```

### Verify API Response
```javascript
// Test signup endpoint
fetch('https://f12a39ggj3.execute-api.ap-south-1.amazonaws.com/feature-77d07ae1/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', name: 'Test' })
})
.then(r => console.log('Status:', r.status))
.catch(e => console.error('Error:', e.message))
// Should get 200 or 400 (invalid input), NOT 404 (wrong URL)
```

---

## References

- CloudFormation API Gateway: `infra/cloudformation/06-api-gateway-stack.yaml`
- API Configuration: `src/lib/cognito.js` - `normalizeApiGatewayBase()`
- Runtime Config: `public/runtime-config.js` - `VITE_API_URL`
- Deployment: `.github/workflows/deploy-*.yaml` - Update runtime-config step
