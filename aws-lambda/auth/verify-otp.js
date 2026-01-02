/**
 * Verify OTP Lambda Function
 * Validates OTP sent to user email
 * Updates user's email verified status in Cognito
 */

const { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBDocumentClient(new DynamoDBClient({ region: process.env.AWS_REGION }));

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
    isBase64Encoded: false
  };
}

// Retrieve OTP from DynamoDB
async function getOTP(email) {
  try {
    const tableName = process.env.OTP_TABLE_NAME || 'growksh-otp-verification';

    const command = new GetCommand({
      TableName: tableName,
      Key: { email: email },
    });

    const result = await dynamoClient.send(command);
    return result.Item;
  } catch (error) {
    console.error('Error retrieving OTP from DynamoDB:', error);
    throw error;
  }
}

// Update OTP attempt count
async function updateOTPAttempt(email) {
  try {
    const tableName = process.env.OTP_TABLE_NAME || 'growksh-otp-verification';

    const command = new UpdateCommand({
      TableName: tableName,
      Key: { email: email },
      UpdateExpression: 'SET attempts = attempts + :inc',
      ExpressionAttributeValues: {
        ':inc': 1,
      },
    });

    await dynamoClient.send(command);
  } catch (error) {
    console.error('Error updating OTP attempt:', error);
    throw error;
  }
}

// Mark email as verified in Cognito
async function markEmailAsVerified(email, userPoolId) {
  try {
    // First, find the username from email
    // In a real scenario, you'd need to query Cognito or store the username mapping
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: email, // Using email as username
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
    });

    await cognitoClient.send(command);
    console.log(`Email marked as verified in Cognito for: ${email}`);
    return true;
  } catch (error) {
    console.error('Error marking email as verified in Cognito:', error);
    // Don't throw - email verification in app is still valid even if Cognito update fails
    return false;
  }
}

exports.handler = async (event) => {
  console.log('Verify OTP event:', JSON.stringify(event, null, 2));

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return response(200, { message: 'OK' });
  }

  try {
    // Get request body
    const body = event.body ? JSON.parse(event.body) : {};
    const email = body.email || event.queryStringParameters?.email;
    const otp = body.otp || event.queryStringParameters?.otp;

    // Validate required parameters
    if (!email || !otp) {
      return response(400, {
        error: 'Missing required parameters: email and otp',
      });
    }

    console.log(`Verifying OTP for email: ${email}`);

    // Retrieve OTP from DynamoDB
    const storedOTPData = await getOTP(email);

    if (!storedOTPData) {
      return response(401, {
        error: 'No OTP found for this email. Please request a new OTP.',
      });
    }

    // Check if OTP has expired
    const now = Math.floor(Date.now() / 1000);
    if (now > storedOTPData.expiryTime) {
      return response(401, {
        error: 'OTP has expired. Please request a new OTP.',
      });
    }

    // Check if max attempts exceeded
    if (storedOTPData.attempts >= storedOTPData.maxAttempts) {
      return response(401, {
        error: 'Too many failed attempts. Please request a new OTP.',
      });
    }

    // Validate OTP
    if (otp !== storedOTPData.otp) {
      // Increment attempt count
      await updateOTPAttempt(email);

      const remainingAttempts = storedOTPData.maxAttempts - storedOTPData.attempts - 1;
      return response(401, {
        error: 'Invalid OTP',
        remainingAttempts: remainingAttempts,
      });
    }

    // OTP is valid
    console.log(`OTP verified successfully for email: ${email}`);

    // Optionally update Cognito user attributes
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (userPoolId) {
      await markEmailAsVerified(email, userPoolId);
    }

    return response(200, {
      message: 'OTP verified successfully',
      email: email,
      verified: true,
    });
  } catch (error) {
    console.error('Error in verify OTP handler:', error);

    return response(500, {
      error: 'Failed to verify OTP',
      message: error.message,
    });
  }
};
