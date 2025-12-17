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
  // Use backend endpoints to handle ADMIN flows so the frontend doesn't need
  // to manage Cognito sessions directly.
  const apiBase = import.meta.env.VITE_API_URL || ''
  const res = await fetch(`${apiBase}/auth/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  if (!res.ok) throw new Error('Failed to start auth')
  const data = await res.json()
  // store session globally for respondToChallenge to use
  try { globalThis.__cognito_last_session = data.session } catch (e) {}
  return { challenge: !!data.challengeName, session: data.session, challengeParameters: data.challengeParameters }
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
  // Call backend to respond to the challenge using AdminRespondToAuthChallenge
  const apiBase = import.meta.env.VITE_API_URL || ''
  // Expect caller to pass session; for our flow we store it in-memory via startAuth return
  // For simplicity, require caller to provide 'answer' and 'session' embedded in email param? 
  // We'll expect the caller to have saved the session on the client.
  if (!globalThis.__cognito_last_session) return Promise.reject(new Error('Missing Session'))
  const res = await fetch(`${apiBase}/auth/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, session: globalThis.__cognito_last_session, answer })
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || 'Failed to respond to challenge')
  }
  const data = await res.json()
  return { success: true, result: data }
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