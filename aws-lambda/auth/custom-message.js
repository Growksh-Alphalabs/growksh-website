/**
 * Custom Message Lambda Trigger
 * Sends signup verification link via email
 */

const crypto = require('crypto');

exports.handler = async (event) => {
  console.log('CustomMessage event:', JSON.stringify(event, null, 2));

  const { trigger_source, request, response } = event;

  if (trigger_source === 'CustomMessage_SignUp') {
    // Generate email verification link for signup
    const email = request.userAttributes.email;
    const secret = process.env.VERIFY_SECRET;
    const timestamp = Math.floor(Date.now() / 1000);

    // Create HMAC signature for token
    const token = crypto
      .createHmac('sha256', secret)
      .update(`${email}:${timestamp}`)
      .digest('hex');

    const verificationLink = `${process.env.VERIFY_BASE_URL}?email=${encodeURIComponent(
      email
    )}&token=${token}&t=${timestamp}`;

    if (process.env.DEBUG_LOG === '1') {
      console.log('Email:', email);
      console.log('Verification Link:', verificationLink);
    }

    response.emailSubject = 'Verify your email for Growksh';
    response.emailMessage = `
Hello ${request.userAttributes.name || 'User'},

Welcome to Growksh! To complete your signup, please click the link below to verify your email:

${verificationLink}

This link will expire in 24 hours.

Best regards,
Growksh Team
    `;
  }

  return event;
};
