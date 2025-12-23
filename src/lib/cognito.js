const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const API_URL = import.meta.env.VITE_API_URL || '';
const USE_FAKE = import.meta.env.VITE_USE_FAKE_AUTH === '1' || import.meta.env.VITE_USE_FAKE_AUTH === 'true';

let runtimeFakeOverride = false;

// Provide a helpful error when env vars are missing
const missingMsg =
  'Cognito UserPoolId and ClientId are not configured. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID in .env.local or enable VITE_USE_FAKE_AUTH=1 for local testing.';

// Mock implementation for fake auth
const pending = new Map(); // email -> { otp, session }

// Lazy-loaded Cognito SDK and user pool
let cognitoSdk = null;
let userPoolInstance = null;

async function getCognitoSDK() {
  if (!cognitoSdk) {
    cognitoSdk = await import('amazon-cognito-identity-js');
  }
  return cognitoSdk;
}

async function getUserPool() {
  if (USE_FAKE || !USER_POOL_ID || !CLIENT_ID) {
    return null;
  }

  if (!userPoolInstance) {
    const { CognitoUserPool } = await getCognitoSDK();
    userPoolInstance = new CognitoUserPool({
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
    });
  }

  return userPoolInstance;
}

/**
 * Signup a new user
 * @param {Object} userData - User data object
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.phone_number - User's phone number (optional)
 * @returns {Promise<Object>} Signup result
 */
export async function signup(userData) {
  try {
    if (!API_URL) {
      throw new Error('API_URL is not configured. Set VITE_API_URL in .env.local');
    }

    // Clean up API base URL - remove trailing slashes and /contact or /Prod
    let apiBase = API_URL.trim();
    apiBase = apiBase.replace(/\/+$/, ''); // Remove trailing slashes
    apiBase = apiBase.replace(/\/(Prod|contact)$/, ''); // Remove /Prod or /contact at end

    // Ensure proper base structure (e.g., https://xxx.execute-api.region.amazonaws.com/Prod)
    if (!apiBase.includes('/Prod')) {
      // Add /Prod if not present
      if (apiBase.endsWith('/')) {
        apiBase = apiBase + 'Prod';
      } else {
        apiBase = apiBase + '/Prod';
      }
    }

    const signupUrl = `${apiBase}/auth/signup`;
    console.log('Calling signup endpoint:', signupUrl);

    const response = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Signup failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

/**
 * Initiate passwordless authentication (sends OTP)
 * @param {string} email - User's email
 * @returns {Promise<Object>} Auth session object
 */
export async function initiateAuth(email) {
  if (USE_FAKE || runtimeFakeOverride) {
    return new Promise((resolve) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const session = 'fake-session-' + Math.random().toString(36).substring(7);
      pending.set(email, { otp, session });
      console.log('[FAKE AUTH] Generated OTP:', otp);
      resolve({ 
        challenge: true, 
        session,
        challengeParameters: { _dev_code: otp } 
      });
    });
  }

  if (!USER_POOL_ID || !CLIENT_ID) {
    return Promise.reject(new Error(missingMsg));
  }

  const { CognitoUser, AuthenticationDetails } = await getCognitoSDK();
  const userPool = await getUserPool();

  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: 'DUMMY' });

    user.initiateAuth(authDetails, {
      onSuccess: (result) => {
        console.log('Auth success:', result);
        resolve({ success: true, result });
      },
      onFailure: (err) => {
        console.error('Auth failure:', err);
        reject(err);
      },
      customChallenge: (challengeParameters) => {
        console.log('Custom challenge received:', challengeParameters);
        // For CUSTOM_AUTH flows, Cognito returns a `Session` string that must be
        // provided back to Cognito when responding to the challenge.
        const session = user.Session || '';
        resolve({
          challenge: true,
          session,
          challengeParameters,
        });
      },
    });
  });
}

/**
 * Verify OTP for login
 * @param {Object} options - Options object
 * @param {string} options.email - User's email
 * @param {string} options.otp - OTP code entered by user
 * @param {string} options.session - Session from initiateAuth
 * @returns {Promise<Object>} Authentication result with tokens
 */
export async function verifyOTP({ email, otp, session }) {
  if (USE_FAKE || runtimeFakeOverride) {
    return new Promise((resolve, reject) => {
      const stored = pending.get(email);
      if (stored && otp === stored.otp) {
        pending.delete(email);
        resolve({
          success: true,
          AuthenticationResult: {
            IdToken: 'fake-id-token-' + Date.now(),
            AccessToken: 'fake-access-token-' + Date.now(),
            RefreshToken: 'fake-refresh-token-' + Date.now(),
          },
        });
      } else {
        reject(new Error('Invalid OTP'));
      }
    });
  }

  if (!USER_POOL_ID || !CLIENT_ID) {
    return Promise.reject(new Error(missingMsg));
  }

  const { CognitoUser } = await getCognitoSDK();
  const userPool = await getUserPool();

  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });

    if (!session) {
      reject(
        new Error(
          'Missing Cognito session. Call initiateAuth(email) first and pass its returned session into verifyOTP.'
        )
      );
      return;
    }

    // amazon-cognito-identity-js expects `user.Session` to be set when responding
    // to a custom challenge (RespondToAuthChallenge requires the Session).
    user.Session = session;

    user.sendCustomChallengeAnswer(otp, {
      onSuccess: (result) => {
        console.log('OTP verification success:', result);
        resolve({
          success: true,
          AuthenticationResult: result,
        });
      },
      onFailure: (err) => {
        console.error('OTP verification failure:', err);
        reject(err);
      },
    });
  });
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User object or null if not authenticated
 */
export async function getCurrentUser() {
  if (USE_FAKE || !USER_POOL_ID || !CLIENT_ID) {
    // Check fake tokens in localStorage
    const token = localStorage.getItem('idToken');
    if (token && token.startsWith('fake-id-token')) {
      return { email: localStorage.getItem('userEmail'), isAuthenticated: true };
    }
    return null;
  }

  const userPool = await getUserPool();
  if (!userPool) return null;

  const user = userPool.getCurrentUser();
  return user || null;
}

/**
 * Get current user attributes
 * @returns {Promise<Object|null>} User attributes or null
 */
export async function getUserAttributes() {
  const user = await getCurrentUser();
  if (!user) return null;

  return new Promise((resolve, reject) => {
    if (USE_FAKE) {
      resolve({
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName') || '',
      });
      return;
    }

    user.getUserAttributes((error, attributes) => {
      if (error) {
        reject(error);
      } else {
        const attrs = {};
        attributes.forEach((attr) => {
          attrs[attr.Name] = attr.Value;
        });
        resolve(attrs);
      }
    });
  });
}

/**
 * Get ID token from current session
 * @returns {Promise<string|null>} ID token or null
 */
export async function getIdToken() {
  const fakeToken = localStorage.getItem('idToken');
  if (fakeToken) {
    return fakeToken;
  }

  const user = await getCurrentUser();
  if (!user) return null;

  return new Promise((resolve, reject) => {
    user.getSession((error, session) => {
      if (error) {
        reject(error);
      } else if (session && session.idToken) {
        resolve(session.idToken.jwtToken);
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Refresh authentication tokens
 * @returns {Promise<Object>} New session
 */
export async function refreshTokens() {
  if (USE_FAKE || !USER_POOL_ID || !CLIENT_ID) {
    throw new Error('Token refresh not available in fake auth mode');
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error('No authenticated user');
  }

  return new Promise((resolve, reject) => {
    user.getSession((error, session) => {
      if (error) {
        reject(error);
      } else if (session && session.refreshToken) {
        user.refreshSession(session.refreshToken, (error, session) => {
          if (error) {
            reject(error);
          } else {
            resolve(session);
          }
        });
      } else {
        reject(new Error('No refresh token available'));
      }
    });
  });
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export async function signOut() {
  // Clear fake auth tokens
  localStorage.removeItem('idToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');

  if (USE_FAKE || !USER_POOL_ID || !CLIENT_ID) {
    return;
  }

  const userPool = await getUserPool();
  if (!userPool) return;

  const user = userPool.getCurrentUser();
  if (user) {
    user.signOut();
  }
}

// Legacy functions for backward compatibility
export async function startAuth(email) {
  return initiateAuth(email);
}

export async function respondToChallenge(email, answer) {
  if (USE_FAKE || runtimeFakeOverride) {
    return verifyOTP({ email, otp: answer, session: '' });
  }

  const { CognitoUser } = await getCognitoSDK();
  const userPool = await getUserPool();

  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.sendCustomChallengeAnswer(answer, {
      onSuccess: (session) => resolve({ success: true, session }),
      onFailure: (err) => reject(err),
    });
  });
}

export function enableFakeAuth() {
  runtimeFakeOverride = true;
}

export function disableFakeAuth() {
  runtimeFakeOverride = false;
}

export default null;