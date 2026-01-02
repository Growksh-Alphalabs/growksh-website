/**
 * OTP Email Lambda Function
 * Generates and sends OTP (One-Time Password) to user email
 * Can be triggered by custom Cognito challenges or API Gateway
 */

const nodeCrypto = require('crypto');
const { SESClient, SendTemplatedEmailCommand } = require('@aws-sdk/client-ses');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const sesClient = new SESClient({ region: process.env.AWS_REGION });
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

// Generate a random 6-digit OTP
function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
}

// Store OTP in DynamoDB with expiry
async function storeOTP(email, otp, expiryMinutes = 5) {
  try {
    const tableName = process.env.OTP_TABLE_NAME || 'growksh-otp-verification';
    const expiryTime = Math.floor(Date.now() / 1000) + (expiryMinutes * 60);

    const command = new PutCommand({
      TableName: tableName,
      Item: {
        email: email,
        otp: otp,
        createdAt: new Date().toISOString(),
        expiryTime: expiryTime,
        attempts: 0,
        maxAttempts: 3,
      },
    });

    await dynamoClient.send(command);
    console.log(`OTP stored for email: ${email}`);
    return true;
  } catch (error) {
    console.error('Error storing OTP in DynamoDB:', error);
    throw error;
  }
}

// Send OTP via SES
async function sendOTPViaSES(email, username, otp, expiryMinutes = 5) {
  try {
    const templateName = process.env.OTP_TEMPLATE_NAME || 
      `growksh-${process.env.ENVIRONMENT}-otp-verification`;

    const command = new SendTemplatedEmailCommand({
      Source: process.env.FROM_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Template: templateName,
      TemplateData: JSON.stringify({
        username: username,
        otp_code: otp,
        expiry_minutes: expiryMinutes,
      }),
      ConfigurationSetName: process.env.SES_CONFIG_SET || undefined,
    });

    const result = await sesClient.send(command);
    console.log('OTP email sent successfully:', result.MessageId);
    return result.MessageId;
  } catch (error) {
    console.error('Error sending OTP via SES:', error);
    throw error;
  }
}

exports.handler = async (event) => {
  console.log('OTP Email event:', JSON.stringify(event, null, 2));

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return response(200, { message: 'OK' });
  }

  try {
    let email, username;

    // Handle API Gateway POST request
    if (event.httpMethod === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      email = body.email || event.queryStringParameters?.email;
      username = body.username || email?.split('@')[0];

      if (!email) {
        return response(400, {
          error: 'Email is required in request body or query parameters',
        });
      }
    }
    // Handle Cognito trigger event
    else if (event.request?.userAttributes?.email) {
      email = event.request.userAttributes.email;
      username = event.request.userAttributes.name || email.split('@')[0];
    } else {
      return response(400, {
        error: 'Email is required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response(400, {
        error: 'Invalid email format',
      });
    }

    console.log(`Generating OTP for email: ${email}`);

    // Generate OTP
    const otp = generateOTP(process.env.OTP_LENGTH ? parseInt(process.env.OTP_LENGTH) : 6);
    const expiryMinutes = process.env.OTP_EXPIRY_MINUTES ? parseInt(process.env.OTP_EXPIRY_MINUTES) : 5;

    // Store OTP in DynamoDB
    await storeOTP(email, otp, expiryMinutes);

    // Send OTP via SES
    const messageId = await sendOTPViaSES(email, username, otp, expiryMinutes);

    console.log(`OTP successfully sent to: ${email}`);

    // Return success response
    return response(200, {
      message: 'OTP sent successfully',
      email: email,
      messageId: messageId,
      expiryMinutes: expiryMinutes,
    });
  } catch (error) {
    console.error('Error in OTP handler:', error);

    return response(500, {
      error: 'Failed to send OTP',
      message: error.message,
    });
  }
};
