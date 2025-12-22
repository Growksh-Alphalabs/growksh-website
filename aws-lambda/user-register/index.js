const AWS = require('aws-sdk');
const crypto = require('crypto');

const cognito = new AWS.CognitoIdentityServiceProvider();
const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' });

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

// Generate a secure verification token
function generateVerificationToken(email) {
  const secret = process.env.VERIFY_SECRET;
  if (!secret) {
    throw new Error('VERIFY_SECRET not configured');
  }

  // Token payload
  const payload = {
    email: email,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours expiry
  };

  // Convert to base64
  const payloadB64 = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Create HMAC signature
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${payloadB64}.${signature}`;
}

// Send verification email
async function sendVerificationEmail(email, name, token) {
  const sourceEmail = process.env.SES_SOURCE_EMAIL;
  const verifyBaseUrl = process.env.VERIFY_BASE_URL;
  
  if (!sourceEmail || !verifyBaseUrl) {
    throw new Error('SES_SOURCE_EMAIL or VERIFY_BASE_URL not configured');
  }

  // Construct verification URL
  const verifyUrl = `${verifyBaseUrl}?token=${encodeURIComponent(token)}`;
  
  const emailSubject = 'Verify Your Email Address';
  const htmlEmailBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #00674F; 
            color: white; 
            text-decoration: none; 
            border-radius: 4px; 
            margin: 20px 0; 
        }
        .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #eee; 
            font-size: 12px; 
            color: #666; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Verify Your Email Address</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
        
        <p>
            <a href="${verifyUrl}" class="button">Verify Email Address</a>
        </p>
        
        <p>Or copy and paste this link in your browser:</p>
        <p><small>${verifyUrl}</small></p>
        
        <p>After verification, you can log in using your email and receive an OTP for authentication.</p>
        
        <p>This link will expire in 24 hours.</p>
        
        <p>If you did not create an account, please ignore this email.</p>
        
        <div class="footer">
            <p>Best regards,<br>The Team</p>
        </div>
    </div>
</body>
</html>
`;

  const params = {
    Source: sourceEmail,
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Subject: {
        Data: emailSubject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlEmailBody,
          Charset: 'UTF-8'
        },
        Text: {
          Data: `Hi ${name || 'there'},

Thank you for registering! Please verify your email address by clicking this link:

${verifyUrl}

After verification, you can log in using your email and receive an OTP for authentication.

This link will expire in 24 hours.

If you did not create an account, please ignore this email.

Best regards,
The Team`,
          Charset: 'UTF-8'
        }
      }
    }
  };

  await ses.sendEmail(params).promise();
  console.log(`Verification email sent to ${email}`);
}

exports.handler = async (event) => {
  try {
    console.log('user-register invoked');

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return response(204, {});
    }

    // Parse request body
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    console.log('Request body:', body);

    const { email, name, phone } = body || {};
    const userPoolId = process.env.USER_POOL_ID;

    // Validate required environment variables early to avoid creating users when config is missing
    const missingEnvs = []
    if (!process.env.VERIFY_SECRET) missingEnvs.push('VERIFY_SECRET')
    if (!process.env.SES_SOURCE_EMAIL) missingEnvs.push('SES_SOURCE_EMAIL')
    if (!process.env.VERIFY_BASE_URL) missingEnvs.push('VERIFY_BASE_URL')
    if (missingEnvs.length > 0) {
      console.error('Missing required env vars:', missingEnvs.join(', '))
      return response(500, {
        message: 'Server configuration error. Missing environment variables: ' + missingEnvs.join(', '),
        code: 'CONFIG_ERROR'
      })
    }

    if (!email) {
      return response(400, { 
        message: 'Email is required',
        code: 'MISSING_EMAIL' 
      });
    }

    if (!userPoolId) {
      return response(500, { 
        message: 'Server configuration error',
        code: 'CONFIG_ERROR' 
      });
    }

    console.log(`Creating passwordless user: ${email}`);

    // Helper to generate a compliant temporary password if needed
    function generateTempPassword(len = 12) {
      const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const lower = 'abcdefghijklmnopqrstuvwxyz'
      const digits = '0123456789'
      const all = upper + lower + digits
      let pw = ''
      pw += upper[Math.floor(Math.random() * upper.length)]
      pw += lower[Math.floor(Math.random() * lower.length)]
      pw += digits[Math.floor(Math.random() * digits.length)]
      for (let i = 3; i < len; i++) pw += all[Math.floor(Math.random() * all.length)]
      pw = pw.split('').sort(() => 0.5 - Math.random()).join('')
      return pw
    }

    // Prepare user attributes
    const userAttributes = [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'false' } // Start as unverified
    ];

    if (name) {
      userAttributes.push({ Name: 'name', Value: name });
    }

    if (phone) {
      userAttributes.push({ Name: 'phone_number', Value: phone });
    }

    // Create user in Cognito WITHOUT a temporary password (preferred)
    // If Cognito rejects due to a password policy validation, retry with
    // a generated compliant TemporaryPassword while still suppressing the
    // built-in Cognito email (we send our own verification link).
    try {
      await cognito.adminCreateUser({
        UserPoolId: userPoolId,
        Username: email,
        UserAttributes: userAttributes,
        MessageAction: 'SUPPRESS',
        DesiredDeliveryMediums: []
      }).promise();
    } catch (createErr) {
      console.warn('adminCreateUser failed (no temp password). Error:', createErr && createErr.message)
      // If the failure mentions password policy, retry with a compliant temp password
      if (createErr && /password/i.test(String(createErr.message || ''))) {
        const tempPassword = generateTempPassword(12)
        await cognito.adminCreateUser({
          UserPoolId: userPoolId,
          Username: email,
          UserAttributes: userAttributes,
          TemporaryPassword: tempPassword,
          MessageAction: 'SUPPRESS',
          DesiredDeliveryMediums: []
        }).promise()
        console.log('adminCreateUser succeeded with fallback TemporaryPassword for', email)
      } else {
        throw createErr
      }
    }

    console.log(`User created successfully: ${email}`);

    // Generate verification token
    const verificationToken = generateVerificationToken(email);

    // Send verification email
    try {
      await sendVerificationEmail(email, name, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      
      // Delete the user if email sending fails
      try {
        await cognito.adminDeleteUser({
          UserPoolId: userPoolId,
          Username: email
        }).promise();
        console.log(`Deleted user ${email} due to email sending failure`);
      } catch (deleteError) {
        console.error('Failed to delete user after email error:', deleteError);
      }
      
      return response(500, {
        message: 'Failed to send verification email. Please try again.',
        code: 'EMAIL_SEND_FAILED'
      });
    }

    return response(201, {
      message: 'Registration successful! Please check your email to verify your account.',
      success: true,
      email: email,
      emailSent: true
    });

  } catch (err) {
    console.error('Registration error:', err);

    // Handle specific errors
    if (err.code === 'UsernameExistsException') {
      return response(409, {
        message: 'An account with this email already exists.',
        code: 'USER_EXISTS'
      });
    }

    if (err.code === 'InvalidParameterException') {
      return response(400, {
        message: 'Invalid email format or parameters.',
        code: 'INVALID_PARAMETERS'
      });
    }

    if (err.message === 'VERIFY_SECRET not configured') {
      return response(500, {
        message: 'Server configuration error. Please contact support.',
        code: 'CONFIG_ERROR'
      });
    }

    return response(500, {
      message: 'Registration failed. Please try again.',
      code: 'INTERNAL_ERROR',
      error: err.message
    });
  }
};