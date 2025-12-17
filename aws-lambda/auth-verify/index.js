const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()
const cognito = new AWS.CognitoIdentityServiceProvider()

exports.handler = async (event) => {
  try {
    console.log('AuthVerify invoked', { queryStringParameters: event.queryStringParameters })
    const token = event.queryStringParameters && event.queryStringParameters.token
    if (!token) return { statusCode: 400, body: 'Missing token', headers: { 'Content-Type': 'text/plain' } }

    const table = process.env.VERIFICATIONS_TABLE
    const resp = await ddb.get({ TableName: table, Key: { token } }).promise()
    if (!resp.Item) return { statusCode: 400, body: 'Invalid or expired token', headers: { 'Content-Type': 'text/plain' } }

    const email = resp.Item.email
    const userPoolId = process.env.USER_POOL_ID
    // Confirm the user in Cognito
    try {
      await cognito.adminConfirmSignUp({ UserPoolId: userPoolId, Username: email }).promise()
      // Also set email_verified attribute
      await cognito.adminUpdateUserAttributes({ UserPoolId: userPoolId, Username: email, UserAttributes: [{ Name: 'email_verified', Value: 'true' }] }).promise()
      console.log('Confirmed user', email)
    } catch (err) {
      console.warn('Error confirming user (may already be confirmed)', err && err.stack ? err.stack : err)
    }

    // delete the verification token
    await ddb.delete({ TableName: table, Key: { token } }).promise()

    // Redirect to frontend login page with success param
    const frontend = process.env.FRONTEND_URL || '/'
    const location = `${frontend.replace(/\/$/, '')}/auth/login?verified=1`
    return { statusCode: 302, headers: { Location: location, 'Access-Control-Allow-Origin': '*' }, body: '' }
  } catch (err) {
    console.warn('AuthVerify error', err && err.stack ? err.stack : err)
    return { statusCode: 500, body: 'error', headers: { 'Content-Type': 'text/plain' } }
  }
}
