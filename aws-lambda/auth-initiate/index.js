const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

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
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  try {
    console.log('auth-initiate invoked');
    
    if (event.httpMethod === 'OPTIONS') {
      return response(204, {});
    }

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { email } = body || {};
    
    if (!email) {
      return response(400, { 
        message: 'Email is required',
        code: 'MISSING_EMAIL' 
      });
    }

    // Initiate custom auth flow for passwordless OTP
    const params = {
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email
      }
    };

    console.log('Initiating passwordless auth for:', email);
    const result = await cognito.initiateAuth(params).promise();
    
    console.log('Auth initiated:', result);
    
    // Cognito triggers will send OTP via email
    return response(200, {
      success: true,
      message: 'OTP sent to your email',
      session: result.Session,
      challengeName: result.ChallengeName
    });
    
  } catch (err) {
    console.error('auth-initiate error:', err);
    
    if (err.code === 'UserNotFoundException') {
      return response(404, { 
        message: 'User not found. Please register first.',
        code: 'USER_NOT_FOUND'
      });
    }
    
    if (err.code === 'UserNotConfirmedException') {
      return response(400, { 
        message: 'Please verify your email first before logging in.',
        code: 'USER_NOT_CONFIRMED'
      });
    }
    
    return response(500, { 
      message: 'Failed to initiate authentication',
      code: 'INTERNAL_ERROR',
      error: err.message
    });
  }
};