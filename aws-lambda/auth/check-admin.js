/**
 * Check Admin Lambda
 * Returns whether the provided JWT indicates admin group membership.
 *
 * Auth: expects Authorization: Bearer <IdToken>
 * Note: this is a lightweight check that decodes JWT payload.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Content-Type': 'application/json',
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
    isBase64Encoded: false,
  };
}

function getBearerToken(headers) {
  const raw = (headers && (headers.Authorization || headers.authorization)) || '';
  if (!raw || typeof raw !== 'string') return '';
  const m = raw.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : '';
}

function decodeJwtPayload(token) {
  const parts = (token || '').split('.');
  if (parts.length !== 3) return null;

  try {
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return response(200, { message: 'OK' });
    }

    if (event.httpMethod !== 'POST') {
      return response(405, { error: 'Method not allowed' });
    }

    const token = getBearerToken(event.headers || {});
    if (!token) {
      return response(401, { error: 'Missing Authorization bearer token' });
    }

    const payload = decodeJwtPayload(token);
    const groups = payload && Array.isArray(payload['cognito:groups']) ? payload['cognito:groups'] : [];
    const isAdmin = groups.includes('admin');

    return response(200, { isAdmin });
  } catch (e) {
    console.error('check-admin error:', e);
    return response(500, { error: e.message || 'Internal server error' });
  }
};
