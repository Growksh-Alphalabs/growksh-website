# Admin Authentication Flow - Implementation Guide

## Overview

A secure admin panel has been implemented with the following features:
- **Separate admin login** at `/admin/login` (password-based)
- **Protected admin routes** that check for admin status
- **Cognito Groups** integration for admin role management
- **Admin Dashboard** at `/admin/dashboard`

## Architecture

### 1. Admin Role Management (Cognito)

Admin users are managed through Cognito User Pool Groups:

```
AWS Cognito User Pool
├── Users
│   ├── Regular User (email verified)
│   └── Admin User (email verified + in "admin" group)
└── Groups
    └── admin (contains admin users)
```

### 2. Authentication Flow

```
Admin visits /admin/login
    ↓
Enters: Email + Password
    ↓
Frontend: adminLogin(email, password)
    ↓
Lambda: USER_PASSWORD_AUTH flow
    ↓
Cognito: Validates credentials
    ↓
Returns: ID Token (contains cognito:groups)
    ↓
Frontend: Stores tokens in localStorage
    ↓
AuthContext: checkAuth() extracts admin status from token
    ↓
ID Token payload:
{
  "email": "admin@growksh.com",
  "cognito:groups": ["admin"],
  "email_verified": true
}
    ↓
AuthContext.isAdmin = true
    ↓
Redirect to /admin/dashboard
```

### 3. Route Protection

```
/admin/login
├── Publicly accessible
├── Shows admin login form
└── Redirects to /admin/dashboard if already authenticated

/admin/dashboard
├── Protected by ProtectedRoute component
├── Requires: isAuthenticated = true AND isAdmin = true
└── If not admin: shows "Access Denied" message
```

## Components Created

### 1. AdminLogin.jsx (`src/components/Auth/AdminLogin.jsx`)
- Email + Password form
- Calls `adminLogin(email, password)` from cognito.js
- Stores tokens and triggers auth state check
- Redirects to `/admin/dashboard` on success

### 2. AdminDashboard.jsx (`src/pages/AdminDashboard.jsx`)
- Protected admin panel
- Shows user information
- Placeholder for future admin features
- Logout button with confirmation

### 3. ProtectedRoute.jsx (`src/components/common/ProtectedRoute.jsx`)
- Wrapper component for protected routes
- Checks `isAuthenticated` and `isAdmin` status
- Shows "Access Denied" if not authorized
- Shows loading while auth state is being checked

## Functions Added

### AuthContext.jsx
```javascript
// New state
isAdmin: false

// New helper function
extractAdminStatusFromToken(token)
  - Decodes JWT payload
  - Checks "cognito:groups" array for "admin"
  - Returns boolean
```

### cognito.js
```javascript
// New function
adminLogin(email, password)
  - Uses USER_PASSWORD_AUTH flow
  - Takes email + password
  - Returns AuthenticationResult with tokens
  - Handles error cases (UserNotFound, NotAuthorized, etc.)
```

## Setup Instructions

### Step 1: Create Admin Group in Cognito

```bash
# Using AWS CLI
aws cognito-idp create-group \
  --group-name admin \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --description "Admin users with full access"
```

### Step 2: Add Users to Admin Group

```bash
# Add existing user to admin group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username admin@growksh.com \
  --group-name admin
```

### Step 3: Create Admin User (if needed)

```bash
# Create user
aws cognito-idp admin-create-user \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username admin@growksh.com \
  --user-attributes Name="value",Name=email,Value=admin@growksh.com \
  --message-action SUPPRESS

# Set permanent password
aws cognito-idp admin-set-user-password \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username admin@growksh.com \
  --password "AdminPassword123!" \
  --permanent
```

### Step 4: Enable USER_PASSWORD_AUTH Flow

Update SAM template or Cognito console:
```yaml
UserPoolClient:
  ExplicitAuthFlows:
    - ALLOW_USER_PASSWORD_AUTH
    - ALLOW_REFRESH_TOKEN_AUTH
```

## Admin Access Control

### Who can access `/admin/dashboard`?
- Users with `isAuthenticated = true` AND
- Users with `isAdmin = true` (in Cognito "admin" group)

### What happens if regular user tries to access?
1. Redirected to `/admin/login`
2. Can login with password
3. After login, AuthContext checks token
4. If `cognito:groups` doesn't contain "admin":
   - `isAdmin` remains false
   - Shows "Access Denied" message
   - Cannot access dashboard

## Security Features

✅ **Route Protection**: Admin routes require both authentication and admin role
✅ **Token Inspection**: Admin status checked from JWT claims (cognito:groups)
✅ **Server-side Validation**: Cognito enforces group membership
✅ **No Public Paths**: Admin routes are hidden and protected
✅ **Logout Required**: Admins must explicitly logout to switch roles
✅ **Password Authentication**: Admin users use password (not OTP)

## Testing

### Test as Regular User (OTP Login)
1. Go to `/login`
2. Enter any registered email
3. Verify OTP
4. Login successful
5. Try accessing `/admin/dashboard` → "Access Denied"

### Test as Admin User (Password Login)
1. Go to `/admin/login`
2. Enter admin email + password
3. Login successful
4. Redirect to `/admin/dashboard`
5. Full access to admin panel

### Test Fake Auth (Local Development)
```javascript
// For local testing without AWS
adminLogin('admin@growksh.com', 'admin123')
// Should succeed and login with fake admin token
```

## Future Enhancements

- [ ] Admin user management interface
- [ ] Content moderation tools
- [ ] Analytics dashboard
- [ ] Report generation
- [ ] Activity logs
- [ ] Role-based sub-permissions
- [ ] Two-factor authentication for admins
- [ ] Admin audit trail
