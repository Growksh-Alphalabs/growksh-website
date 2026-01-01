/**
 * Custom Message Lambda Trigger
 * Sends signup verification link via email using Amazon SES
 * Triggered on SignUp and AdminCreateUser events
 */

const nodeCrypto = require('crypto');
const { SESClient, SendTemplatedEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({ region: process.env.AWS_REGION });

async function sendEmailViaSES(email, templateName, templateData) {
  try {
    const command = new SendTemplatedEmailCommand({
      Source: process.env.FROM_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Template: templateName,
      TemplateData: JSON.stringify(templateData),
      ConfigurationSetName: process.env.SES_CONFIG_SET || undefined,
    });

    const response = await sesClient.send(command);
    console.log('Email sent successfully:', response.MessageId);
    return { success: true, messageId: response.MessageId };
  } catch (error) {
    console.error('Error sending email via SES:', error);
    throw error;
  }
}

exports.handler = async (event) => {
  console.log('CustomMessage event:', JSON.stringify(event, null, 2));

  const { triggerSource, request, response } = event;

  try {
    if (triggerSource === 'CustomMessage_SignUp' || triggerSource === 'CustomMessage_AdminCreateUser') {
      // Generate email verification link for signup
      const email = request.userAttributes.email;
      const username = request.userAttributes.name || request.userAttributes.email.split('@')[0];
      const secret = process.env.VERIFY_SECRET;
      const timestamp = Math.floor(Date.now() / 1000);

      if (!secret) {
        throw new Error('VERIFY_SECRET is not configured');
      }

      // Create HMAC signature for token
      const token = nodeCrypto
        .createHmac('sha256', secret)
        .update(`${email}:${timestamp}`)
        .digest('hex');

      const verificationLink = `${process.env.VERIFY_BASE_URL}?email=${encodeURIComponent(
        email
      )}&token=${token}&t=${timestamp}`;

      if (process.env.DEBUG_LOG === '1') {
        console.log('Email:', email);
        console.log('Username:', username);
        console.log('Verification Link:', verificationLink);
      }

      // Get template name from environment or use default
      const templateName = process.env.MAGIC_LINK_TEMPLATE_NAME || 
        `growksh-${process.env.ENVIRONMENT}-magic-link-verification`;

      // Send email using SES template
      if (process.env.USE_SES === '1') {
        const templateData = {
          username: username,
          verification_link: verificationLink,
        };

        await sendEmailViaSES(email, templateName, templateData);

        // Update response to indicate email was sent via SES
        response.autoConfirmUser = false;
        response.autoVerifyPhone = false;
      } else {
        // Fallback to Cognito's built-in email sending (non-production)
        response.emailSubject = 'Verify your email for Growksh';
        response.emailMessage = `
Hello ${username},

Welcome to Growksh! To complete your signup, please click the link below to verify your email:

${verificationLink}

This link will expire in 24 hours.

Best regards,
Growksh Team
        `;
      }
    }
  } catch (error) {
    console.error('Error in custom message handler:', error);
    // Don't throw - let Cognito proceed but log the error
    // In production, you might want to handle this differently
  }

  return event;
};
