/**
 * Custom Message Lambda Trigger
 * Produces a magic-link verification email.
 * Cognito sends the email using the configured email provider.
 */

const nodeCrypto = require('crypto');

function buildMagicLink(email, verifyBaseUrl, verifySecret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const token = nodeCrypto
    .createHmac('sha256', verifySecret)
    .update(`${email}:${timestamp}`)
    .digest('hex');

  const verificationLink = `${verifyBaseUrl}?email=${encodeURIComponent(email)}&token=${token}&t=${timestamp}`;
  return verificationLink;
}

exports.handler = async (event) => {
  console.log('CustomMessage event:', JSON.stringify(event, null, 2));

  const { triggerSource, request, response } = event;

  try {
    const shouldSendMagicLink =
      triggerSource === 'CustomMessage_SignUp' ||
      triggerSource === 'CustomMessage_AdminCreateUser' ||
      triggerSource === 'CustomMessage_ResendCode';

    if (!shouldSendMagicLink) {
      return event;
    }

    const email = request?.userAttributes?.email;
    const username = request?.userAttributes?.name || (email ? email.split('@')[0] : 'User');
    const verifyBaseUrl = process.env.VERIFY_BASE_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!email) {
      console.error('CustomMessage: missing userAttributes.email');
      return event;
    }

    if (!verifyBaseUrl || !verifySecret) {
      console.error('CustomMessage: VERIFY_BASE_URL / VERIFY_SECRET not configured; falling back to code message');
      response.emailSubject = 'Your verification code for Growksh';
      response.emailMessage = `
Hello ${username},

Your verification code is: ${request.codeParameter || '<<code>>'}

Best regards,
Growksh Team
      `;
      return event;
    }

    const verificationLink = buildMagicLink(email, verifyBaseUrl, verifySecret);

    if (process.env.DEBUG_LOG === '1') {
      console.log('Email:', email);
      console.log('Username:', username);
      console.log('Verification Link:', verificationLink);
    }

    response.emailSubject = 'Verify your email for Growksh';
    response.emailMessage = `
Hello ${username},

Welcome to Growksh! To complete your signup, please click the link below to verify your email:

${verificationLink}

This link will expire in 24 hours.

Best regards,
Growksh Team
    `;
  } catch (error) {
    console.error('Error in custom message handler:', error);
    // Always try to provide *some* message so Cognito can still send an email.
    try {
      response.emailSubject = 'Your verification code for Growksh';
      response.emailMessage = `Your verification code is: ${event?.request?.codeParameter || '<<code>>'}`;
    } catch {}
  }

  return event;
};
