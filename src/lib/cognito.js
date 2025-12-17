const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const USE_FAKE = import.meta.env.VITE_USE_FAKE_AUTH === '1' || import.meta.env.VITE_USE_FAKE_AUTH === 'true';
let runtimeFakeOverride = false

// Provide a helpful error when env vars are missing
const missingMsg = 'Cognito UserPoolId and ClientId are not configured. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID in .env.local or enable VITE_USE_FAKE_AUTH=1 for local testing.';

// Mock implementation for fake auth
const pending = new Map(); // email -> code

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
      ClientId: CLIENT_ID
    });
  }
  
  return userPoolInstance;
}

async function startAuth(email) {
  if (USE_FAKE || runtimeFakeOverride) {
    return new Promise((resolve) => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      pending.set(email, code);
      resolve({ challenge: true, challengeParameters: { _dev_code: code } });
    });
  }
  
  if (!USER_POOL_ID || !CLIENT_ID) {
    return Promise.reject(new Error(missingMsg));
  }
  
  const { CognitoUser, AuthenticationDetails } = await getCognitoSDK();
  const userPool = await getUserPool();
  
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: '' });
    user.initiateAuth(authDetails, {
      onSuccess: (result) => resolve({ success: true, result }),
      onFailure: (err) => reject(err),
      customChallenge: (challengeParameters) => resolve({ challenge: true, challengeParameters })
    });
  });
}

async function respondToChallenge(email, answer) {
  if (USE_FAKE || runtimeFakeOverride) {
    return new Promise((resolve, reject) => {
      const expected = pending.get(email);
      if (expected && String(answer).trim() === String(expected).trim()) {
        pending.delete(email);
        resolve({ success: true, session: { fake: true } });
      } else {
        reject(new Error('Invalid code'));
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
    user.sendCustomChallengeAnswer(answer, {
      onSuccess: (session) => resolve({ success: true, session }),
      onFailure: (err) => reject(err)
    });
  });
}

async function signOutLocal() {
  if (USE_FAKE) {
    return;
  }
  
  if (!USER_POOL_ID || !CLIENT_ID) {
    return;
  }
  
  const userPool = await getUserPool();
  const current = userPool.getCurrentUser();
  if (current) current.signOut();
}

export { startAuth, respondToChallenge, signOutLocal };
export default null;

// Allow tests or live debugging to enable fake auth at runtime
export function enableFakeAuth() { runtimeFakeOverride = true }
export function disableFakeAuth() { runtimeFakeOverride = false }