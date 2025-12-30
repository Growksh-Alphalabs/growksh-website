// NOTE: We intentionally avoid using the AWS SDK v3 CognitoIdentityProviderClient in the browser.
// It typically expects SigV4 credentials, while Cognito User Pool auth flows from the browser are
// designed to work without AWS credentials (as used by amazon-cognito-identity-js).

const IS_LOCALHOST =
  typeof window !== 'undefined' &&
  window.location &&
  ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);

function getRuntimeConfig() {
  if (typeof window === 'undefined') return {}
  return window.__GROWKSH_RUNTIME_CONFIG__ || {}
}

function getConfigValue(key) {
  const runtime = getRuntimeConfig()
  const value = runtime && Object.prototype.hasOwnProperty.call(runtime, key) ? runtime[key] : undefined
  const fallback = import.meta.env ? import.meta.env[key] : undefined
  return (value ?? fallback ?? '').toString().trim()
}

function getUserPoolId() {
  return getConfigValue('VITE_COGNITO_USER_POOL_ID')
}

function getClientId() {
  return getConfigValue('VITE_COGNITO_CLIENT_ID')
}

function getApiUrl() {
  return getConfigValue('VITE_API_URL')
}

function getRegion() {
  const explicit = getConfigValue('VITE_AWS_REGION')
  if (explicit) return explicit
  const userPoolId = getUserPoolId()
  return (userPoolId ? userPoolId.split('_')[0] : undefined) || 'ap-south-1'
}

function isFakeAuthExplicitlyEnabled() {
  const raw = getConfigValue('VITE_USE_FAKE_AUTH')
  return raw === '1' || raw.toLowerCase() === 'true'
}

async function cognitoIdpRequest(target, payload) {
  const region = getRegion()
  const url = `https://cognito-idp.${region}.amazonaws.com/`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(payload),
  })

  const text = await response.text()
  const data = text ? (() => { try { return JSON.parse(text) } catch { return {} } })() : {}

  if (!response.ok) {
    const message =
      data.message ||
      data.Message ||
      data.error ||
      (data.__type ? `${data.__type}` : '') ||
      `Cognito request failed (${response.status})`
    throw new Error(message)
  }

  return data
}

function normalizeApiGatewayBase(apiUrl) {
  let apiBase = (apiUrl || '').trim().replace(/\/+$/, '')
  apiBase = apiBase.replace(/\/(contact)$/i, '')
  apiBase = apiBase.replace(/\/(prod)$/i, '')
  return `${apiBase}/Prod`
}

let runtimeFakeOverride = false;

function isFakeAuthEnabled() {
  // Auto-fallback for localhost when Cognito IDs are missing.
  // This keeps local testing working without AWS.
  const userPoolId = getUserPoolId()
  const clientId = getClientId()
  const autoFake = IS_LOCALHOST && (!userPoolId || !clientId);
  return isFakeAuthExplicitlyEnabled() || runtimeFakeOverride || autoFake;
}

function clearCognitoLocalStorage() {
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('CognitoIdentityServiceProvider.')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))
  } catch {}
}

// Provide a helpful error when env vars are missing
const missingMsg =
  'Cognito UserPoolId and ClientId are not configured. For deployments, set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID in runtime-config.js and invalidate CloudFront cache for runtime-config.js + index.html.';

// Mock implementation for fake auth
const pending = new Map(); // email -> { otp, session }

// Lazy-loaded Cognito SDK and user pool
let cognitoSdk = null;
let userPoolInstance = null;
let userPoolKey = '';

async function getCognitoSDK() {
  if (!cognitoSdk) {
    cognitoSdk = await import('amazon-cognito-identity-js');
  }
  return cognitoSdk;
}

async function getUserPool() {
  const userPoolId = getUserPoolId()
  const clientId = getClientId()

  if (isFakeAuthEnabled() || !userPoolId || !clientId) {
    return null;
  }

  const nextKey = `${userPoolId}::${clientId}`
  if (userPoolInstance && userPoolKey && userPoolKey !== nextKey) {
    userPoolInstance = null
  }

  if (!userPoolInstance) {
    const { CognitoUserPool } = await getCognitoSDK();
    userPoolInstance = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });
    userPoolKey = nextKey
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
    // Support fake auth for testing without real API
    if (isFakeAuthEnabled()) {
      console.info('[Signup] Using FAKE AUTH - simulating signup');
      return {
        message: 'User created successfully (FAKE AUTH)',
        email: userData.email,
        userSub: 'fake-user-' + Math.random().toString(36).substring(7),
      };
    }

    const apiUrl = getApiUrl()
    if (!apiUrl) {
      throw new Error(
        'API_URL is not configured. For deployments, set VITE_API_URL in public/runtime-config.js (and invalidate CloudFront for runtime-config.js + index.html).'
      );
    }

    const apiBase = normalizeApiGatewayBase(apiUrl)
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
 * Check whether a user exists (via backend API), used by the login flow.
 * Returns: { exists: boolean }
 */
export async function checkUserExists(email) {
  if (isFakeAuthEnabled()) {
    return { exists: true }
  }

  const apiUrl = getApiUrl()
  if (!apiUrl) {
    throw new Error(
      'API_URL is not configured. Set VITE_API_URL (in .env.local for dev or public/runtime-config.js for deployments).'
    )
  }

  const apiBase = normalizeApiGatewayBase(apiUrl)

  const url = `${apiBase}/auth/check-user`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || data.message || `Check user failed with status ${response.status}`)
  }

  return data
}

/**
 * Initiate passwordless authentication (sends OTP)
 * @param {string} email - User's email
 * @returns {Promise<Object>} Auth session object
 */
export async function initiateAuth(email) {
  if (isFakeAuthEnabled()) {
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

  const clientId = getClientId()
  if (!getUserPoolId() || !clientId) {
    return Promise.reject(new Error(missingMsg));
  }

  const res = await cognitoIdpRequest('InitiateAuth', {
    AuthFlow: 'CUSTOM_AUTH',
    ClientId: clientId,
    AuthParameters: { USERNAME: email },
  })

  // If Cognito ever decides to return tokens immediately, support that too.
  if (res.AuthenticationResult) {
    return {
      success: true,
      AuthenticationResult: res.AuthenticationResult,
    };
  }

  return {
    challenge: true,
    session: res.Session || '',
    challengeParameters: res.ChallengeParameters || {},
    challengeName: res.ChallengeName,
  };
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
  if (isFakeAuthEnabled()) {
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

  const clientId = getClientId()
  if (!getUserPoolId() || !clientId) {
    return Promise.reject(new Error(missingMsg));
  }

  if (!session) {
    throw new Error(
      'Missing Cognito session. Call initiateAuth(email) first and pass its returned session into verifyOTP.'
    );
  }

  const res = await cognitoIdpRequest('RespondToAuthChallenge', {
    ChallengeName: 'CUSTOM_CHALLENGE',
    ClientId: clientId,
    Session: session,
    ChallengeResponses: { USERNAME: email, ANSWER: otp },
  })

  if (res.AuthenticationResult) {
    return {
      success: true,
      AuthenticationResult: res.AuthenticationResult,
    };
  }

  // If Cognito wants another round of challenge, propagate the new session.
  return {
    challenge: true,
    session: res.Session || '',
    challengeParameters: res.ChallengeParameters || {},
    challengeName: res.ChallengeName,
  };
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User object or null if not authenticated
 */
export async function getCurrentUser() {
  if (isFakeAuthEnabled()) {
    const token = localStorage.getItem('idToken')
    if (token && token.startsWith('fake-id-token')) {
      return { email: localStorage.getItem('userEmail'), isAuthenticated: true }
    }
    return null
  }

  if (!getUserPoolId() || !getClientId()) return null;

  const userPool = await getUserPool();
  if (!userPool) return null;

  const user = userPool.getCurrentUser();
  if (!user) return null;

  // Validate session; Cognito can return a user even when the session is expired.
  return await new Promise((resolve) => {
    user.getSession((error, session) => {
      if (error || !session || (typeof session.isValid === 'function' && !session.isValid())) {
        clearCognitoLocalStorage()
        resolve(null)
        return
      }
      resolve(user)
    })
  })
}

/**
 * Get current user attributes
 * @returns {Promise<Object|null>} User attributes or null
 */
export async function getUserAttributes() {
  const user = await getCurrentUser();
  if (!user) return null;

  return new Promise((resolve, reject) => {
    if (isFakeAuthEnabled()) {
      resolve({
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName') || '',
      });
      return;
    }

    user.getSession((sessionError, session) => {
      if (sessionError || !session || (typeof session.isValid === 'function' && !session.isValid())) {
        clearCognitoLocalStorage()
        resolve(null)
        return
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
    })
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
  if (isFakeAuthEnabled() || !getUserPoolId() || !getClientId()) {
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

  clearCognitoLocalStorage()

  if (isFakeAuthEnabled() || !getUserPoolId() || !getClientId()) {
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

export async function respondToChallenge(_email, _answer) {
  throw new Error(
    'respondToChallenge(email, answer) is deprecated. Use verifyOTP({ email, otp: answer, session }) with the Session returned by initiateAuth(email).'
  );
}

export function enableFakeAuth() {
  runtimeFakeOverride = true;
}

export function disableFakeAuth() {
  runtimeFakeOverride = false;
}

export default null;
