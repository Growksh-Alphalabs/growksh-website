/**
 * User Status Lambda
 * Returns the current user's Cognito attributes (including email_verified) at runtime.
 *
 * Auth: expects Authorization: Bearer <AccessToken>
 */

const {
  CognitoIdentityProviderClient,
  GetUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET',
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
  const raw =
    (headers && (headers.Authorization || headers.authorization)) ||
    (headers && (headers.AUTHORIZATION || headers.authorization));
  if (!raw || typeof raw !== 'string') return '';

  const m = raw.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : '';
}

function attrsToMap(attrs) {
  const out = {};
  if (!Array.isArray(attrs)) return out;
  for (const a of attrs) {
    if (!a || typeof a.Name !== 'string') continue;
    out[a.Name] = a.Value;
  }
  return out;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return response(200, { message: 'OK' });
    }

    if (event.httpMethod !== 'GET') {
      return response(405, { error: 'Method not allowed' });
    }

    const accessToken = getBearerToken(event.headers || {});
    if (!accessToken) {
      return response(401, { error: 'Missing Authorization bearer token' });
    }

    const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

    const res = await client.send(new GetUserCommand({ AccessToken: accessToken }));
    const attrMap = attrsToMap(res?.UserAttributes);

    const email = typeof attrMap.email === 'string' ? attrMap.email : undefined;
    const email_verified_raw = typeof attrMap.email_verified === 'string' ? attrMap.email_verified : undefined;
    const email_verified =
      typeof email_verified_raw === 'string'
        ? email_verified_raw.trim().toLowerCase()
        : undefined;

    console.info(`[user-status] email=${email}, email_verified=${email_verified}`);

    return response(200, {
      authenticated: true,
      ...(email ? { email } : {}),
      email_verified: email_verified || 'false',
    });
  } catch (e) {
    // Cognito throws NotAuthorizedException for expired/invalid access tokens.
    const name = e && (e.name || e.__type);
    if (name === 'NotAuthorizedException') {
      return response(401, { error: 'Not authorized' });
    }

    console.error('user-status error:', e);
    return response(500, { error: e.message || 'Internal server error' });
  }
};
