/**
 * Signup Lambda Function
 * Handles user registration and creates user in Cognito User Pool
 */

const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const nodeCrypto = require('crypto');

let cognito = null;
let ses = null;

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

function getSes() {
  if (!ses) {
    ses = new SESClient({ region: process.env.AWS_REGION });
  }
  return ses;
}

function parseJsonBody(event) {
  if (!event || event.body == null) return {};

  let raw = event.body;
  if (event.isBase64Encoded && typeof raw === 'string') {
    raw = Buffer.from(raw, 'base64').toString('utf8');
  }

  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      throw new Error('Invalid JSON body');
    }
  }

  if (typeof raw === 'object') return raw;
  return {};
}

function isE164(phone) {
  return typeof phone === 'string' && /^\+[1-9]\d{1,14}$/.test(phone.trim());
}

async function sendVerificationEmail({ email, name }) {
  const sourceEmail = process.env.SES_SOURCE_EMAIL;
  const secret = process.env.VERIFY_SECRET;
  const baseUrl = process.env.VERIFY_BASE_URL;

  if (!sourceEmail || !secret || !baseUrl) {
    console.warn('Verification email not configured. Missing SES_SOURCE_EMAIL, VERIFY_SECRET, or VERIFY_BASE_URL');
    return { sent: false, reason: 'missing_config' };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const token = nodeCrypto
    .createHmac('sha256', secret)
    .update(`${email}:${timestamp}`)
    .digest('hex');

  const verificationLink = `${baseUrl}?email=${encodeURIComponent(email)}&token=${token}&t=${timestamp}`;

  const subject = 'Verify your email for Growksh';
  const body = `Hello ${name || 'User'},\n\nWelcome to Growksh! To complete your signup, please click the link below to verify your email:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nGrowksh Team\n`;

  const client = getSes();
  await client.send(
    new SendEmailCommand({
      Source: sourceEmail,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } },
      },
    })
  );

  return { sent: true };
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

    let body;
    try {
      body = parseJsonBody(event);
    } catch (e) {
      return response(400, { error: e.message || 'Invalid request body' });
    }

    const { email, name, phone_number } = body;

    if (!email || !name) {
      return response(400, { error: 'Email and name are required' });
    }

    // Generate a temporary password
    const tempPassword = 'TempPass' + Math.random().toString(36).substring(7) + '!';

    // Create user in Cognito
    const phone = typeof phone_number === 'string' ? phone_number.trim() : '';
    const hasValidPhone = phone ? isE164(phone) : false;

    const createParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      TemporaryPassword: tempPassword,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
        ...(hasValidPhone ? [{ Name: 'phone_number', Value: phone }] : [])
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

    let verificationEmailSent = false;
    try {
      const res = await sendVerificationEmail({ email, name });
      verificationEmailSent = !!res.sent;
    } catch (e) {
      console.error('Failed to send verification email:', e);
    }

    return response(201, {
      message: 'User created successfully',
      email,
      verified: true,
      verificationEmailSent
    });
  } catch (error) {
    console.error('Signup error:', error);

    if (error.name === 'InvalidParameterException' && /phone/i.test(error.message || '')) {
      return response(400, {
        error: 'Invalid phone number format. Use E.164 format like +919876543210, or leave phone blank.'
      });
    }

    if (error.name === 'UsernameExistsException') {
      return response(409, { error: 'User already exists' });
    }

    return response(500, { error: error.message || 'Internal server error' });
  }
};
