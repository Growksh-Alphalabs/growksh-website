// Runtime configuration loaded before the React app.
//
// This file is copied as-is to the deployed site (e.g., S3/CloudFront).
// Update it after each deployment to point the frontend at the new Cognito
// User Pool and App Client without rebuilding the app bundle.

window.__GROWKSH_RUNTIME_CONFIG__ = {
  // Cognito User Pool (example: ap-south-1_AbCdEfGhI)
  VITE_COGNITO_USER_POOL_ID: 'ap-south-1_eZJJn3M9A',

  // Cognito App Client ID (no secret)
  VITE_COGNITO_CLIENT_ID: '2uaba43qlqlnach4jdbk3mm29p',

  // Backend API base URL (API Gateway invoke URL)
  VITE_API_URL: '',

  // Optional: AWS region override
  VITE_AWS_REGION: '',

  // Toggle fake auth ("1" or "true" to enable)
  VITE_USE_FAKE_AUTH: '0',
};

try {
  console.info('[Growksh] runtime-config loaded', Object.keys(window.__GROWKSH_RUNTIME_CONFIG__ || {}));
} catch {}
