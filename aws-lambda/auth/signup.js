/**
 * Signup Lambda Function
 * Handles user registration and creates user in Cognito User Pool
 */

const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Content-Type': 'application/json',
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  console.log('Signup event:', JSON.stringify(event, null, 2));

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return response(200, { message: 'OK' });
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return response(405, { error: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, name, phone_number } = body;

    // Validate required fields
    if (!email || !name) {
      return response(400, { error: 'Email and name are required' });
    }

    // Validate email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return response(400, { error: 'Invalid email format' });
    }

    console.log('Creating user:', email);

    // Create user in Cognito User Pool
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: name },
        ...(phone_number ? [{ Name: 'phone_number', Value: phone_number }] : []),
      ],
      MessageAction: 'SUPPRESS', // Don't send any default message
      TemporaryPassword: 'TempPass' + Math.random().toString(36).substring(7) + '!@',
    };

    const createResult = await cognito.adminCreateUser(params).promise();
    console.log('User created successfully:', email);

    // Set a non-expiring password for passwordless login
    // This is required for CUSTOM_AUTH flow
    const setPasswordParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      Password: 'Temporary' + Math.random().toString(36).substring(7) + '!@1',
      Permanent: false,
    };

    await cognito.adminSetUserPassword(setPasswordParams).promise();
    console.log('User password set for:', email);

    return response(201, {
      message: 'User created successfully. Please check your email for verification link.',
      email,
      userSub: createResult.User.Attributes.find((attr) => attr.Name === 'sub')?.Value,
    });
  } catch (error) {
    console.error('Error in signup:', error);

    // Handle specific Cognito errors
    if (error.code === 'UsernameExistsException') {
      return response(409, {
        error: 'User with this email already exists. Please login or use a different email.',
      });
    }

    if (error.code === 'InvalidPasswordException') {
      return response(400, {
        error: 'Password validation failed',
      });
    }

    return response(500, {
      error: error.message || 'Internal server error',
    });
  }
};
