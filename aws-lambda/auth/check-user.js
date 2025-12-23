/**
 * Check User Lambda Function
 * Checks if a user exists in the Cognito User Pool by email
 */

const { CognitoIdentityProviderClient, AdminGetUserCommand } = require("@aws-sdk/client-cognito-identity-provider");

let cognito = null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
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

function getCognito() {
  if (!cognito) {
    cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
  }
  return cognito;
}

exports.handler = async (event) => {
  try {
    console.log('Check user event:', JSON.stringify(event, null, 2));
    
    if (event.httpMethod === 'OPTIONS') {
      return response(200, { message: 'OK' });
    }
    
    if (event.httpMethod !== 'POST') {
      return response(405, { error: 'Method not allowed' });
    }
    
    const cognitoClient = getCognito();
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    
    if (!userPoolId) {
      console.error('COGNITO_USER_POOL_ID environment variable not set');
      return response(500, { error: 'Server configuration error' });
    }
    
    const body = JSON.parse(event.body || '{}');
    const { email } = body;
    
    if (!email) {
      return response(400, { error: 'Email is required' });
    }
    
    try {
      const cmd = new AdminGetUserCommand({
        UserPoolId: userPoolId,
        Username: email,
      });
      
      const result = await cognitoClient.send(cmd);
      
      // User exists
      return response(200, {
        exists: true,
        email: result.Username,
        userAttributes: result.UserAttributes || []
      });
    } catch (error) {
      // UserNotFoundException means user doesn't exist
      if (error.name === 'UserNotFoundException') {
        return response(200, {
          exists: false,
          email: email
        });
      }
      
      // Other Cognito errors
      console.error('Cognito error:', error);
      return response(400, {
        error: error.message || 'Failed to check user'
      });
    }
  } catch (error) {
    console.error('Check user error:', error);
    return response(500, { error: error.message || 'Internal server error' });
  }
};
