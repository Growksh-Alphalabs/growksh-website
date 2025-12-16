const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()

exports.handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { email, name, phone } = body || {}
    const userPoolId = process.env.USER_POOL_ID
    if (!email || !userPoolId) return { statusCode: 400, body: JSON.stringify({ message: 'Missing email or userPoolId' }) }

    // Create the user with a random temp password, suppress messaging (we'll send OTP via custom auth)
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'

    await cognito.adminCreateUser({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        ...(name ? [{ Name: 'name', Value: name }] : []),
        ...(phone ? [{ Name: 'phone_number', Value: phone }] : [])
      ],
      TemporaryPassword: tempPassword,
      MessageAction: 'SUPPRESS'
    }).promise()

    return { statusCode: 201, body: JSON.stringify({ message: 'User created' }) }
  } catch (err) {
    console.warn('user-register error', err)
    return { statusCode: 500, body: JSON.stringify({ message: err.message || 'error' }) }
  }
}
