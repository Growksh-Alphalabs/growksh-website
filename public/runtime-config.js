// Runtime configuration loaded before the React app.
//
// This file is copied as-is to the deployed site (e.g., S3/CloudFront).
// Update it after each fresh deployment to point the frontend at the new Cognito
// User Pool and App Client without rebuilding the app bundle.
//
// IMPORTANT:
// - Values are strings.
// - Keep keys prefixed with VITE_ to match existing code expectations.
// - After changing this file in production, you must refresh the page.

window.__GROWKSH_RUNTIME_CONFIG__ = {
  // Cognito User Pool (for amazon-cognito-identity-js custom auth)
  VITE_COGNITO_USER_POOL_ID: '',
  // App client ID (no secret) for User Pool
  VITE_COGNITO_CLIENT_ID: '',

  // Backend API base URL (API Gateway)
  VITE_API_URL: '',

  // Optional: AWS region override (defaults to region parsed from UserPoolId)
  VITE_AWS_REGION: '',

  // Toggle fake local auth ("1" or "true" to enable)
  VITE_USE_FAKE_AUTH: '0',
};

// Debug: confirm the file loaded and keys exist.
// (Values may be empty until you set them.)
try {
  // eslint-disable-next-line no-console
  console.info('[Growksh] runtime-config loaded', Object.keys(window.__GROWKSH_RUNTIME_CONFIG__ || {}));
} catch (e) {}
