const crypto = require('crypto');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Content-Type': 'application/json'
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
    isBase64Encoded: false
  };
}

exports.handler = async (event) => {
  try {
    console.log('Verify Email event:', JSON.stringify(event, null, 2));
    
    if (event.httpMethod === 'OPTIONS') {
      return response(200, { message: 'OK' });
    }
    
    const { email, token, t } = event.queryStringParameters || {};
    
    if (!email || !token || !t) {
      return response(400, { error: 'Missing email, token, or timestamp' });
    }
    
    // Verify token signature
    const secret = process.env.VERIFY_SECRET;
    const expectedToken = crypto
      .createHmac('sha256', secret)
      .update(`${email}:${t}`)
      .digest('hex');
    
    if (token !== expectedToken) {
      return response(401, { error: 'Invalid verification token' });
    }
    
    // Check token expiry (valid for 24 hours)
    const now = Math.floor(Date.now() / 1000);
    const tokenAge = now - parseInt(t);
    if (tokenAge > 86400) {
      return response(401, { error: 'Verification token expired' });
    }
    
    return response(200, {
      message: 'Email verified successfully',
      email,
      redirect: `/login?email=${encodeURIComponent(email)}`
    });
  } catch (error) {
    console.error('Error:', error);
    return response(500, { error: error.message || 'Internal server error' });
  }
};
