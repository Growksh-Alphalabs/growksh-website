/**
 * Signup Lambda Function
 * Handles user registration and creates user in Cognito User Pool
 */

const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider");

let cognito = null;

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://d2eipj1xhqte5b.cloudfront.net',
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
    console.log('Signup event:', JSON.stringify(event, null, 2));
    
    if (event.httpMethod === 'OPTIONS') {
      return response(200, { message: 'OK' });
    }
    
    if (event.httpMethod !== 'POST') {
      return response(405, { error: 'Method not allowed' });
    }
    
    const cognitoClient = getCognito();
    const body = JSON.parse(event.body || '{}');
    const { email, name, phone_number } = body;
    
    if (!email || !name) {
      return response(400, { error: 'Email and name are required' });
    }
    
    // Generate a temporary password
    const tempPassword = 'TempPass' + Math.random().toString(36).substring(7) + '!';
    
    // Create user in Cognito
    const createParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      TemporaryPassword: tempPassword,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: name },
        ...(phone_number ? [{ Name: 'phone_number', Value: phone_number }] : [])
      ],
      MessageAction: 'SUPPRESS'
    };
    
    await cognitoClient.send(new AdminCreateUserCommand(createParams));
    
    // Set permanent password for passwordless flow
    const setPassParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      Password: tempPassword,
      Permanent: false
    };
    
    await cognitoClient.send(new AdminSetUserPasswordCommand(setPassParams));
    
    return response(201, {
      message: 'User created successfully',
      email,
      verified: true
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'UsernameExistsException') {
      return response(409, { error: 'User already exists' });
    }
    
    return response(500, { error: error.message || 'Internal server error' });
  }
};
