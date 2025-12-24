/**
 * Check Admin - Verifies if a user exists and is in the admin group
 * Used by admin login flow to prevent non-admin users from requesting OTP
 */

const {
  CognitoIdentityServiceProvider,
} = require('aws-sdk')

const cognito = new CognitoIdentityServiceProvider()

const USER_POOL_ID = process.env.USER_POOL_ID

/**
 * Handler function
 */
async function handler(event) {
  console.log('Check Admin event:', JSON.stringify(event))

  // Parse request body
  let body = {}
  if (typeof event.body === 'string') {
    try {
      body = JSON.parse(event.body)
    } catch (e) {
      console.error('Error parsing body:', e)
    }
  } else {
    body = event.body || {}
  }

  const email = (body.email || '').trim().toLowerCase()

  // Validate email
  if (!email) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Email is required',
      }),
    }
  }

  try {
    // Check if user exists by searching for them via AdminGetUser
    let user = null
    try {
      user = await cognito
        .adminGetUser({
          UserPoolId: USER_POOL_ID,
          Username: email,
        })
        .promise()
    } catch (err) {
      if (err.code === 'UserNotFoundException') {
        // User doesn't exist
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            success: false,
            exists: false,
            isAdmin: false,
            message: 'User not found. Please sign up first.',
          }),
        }
      }
      throw err
    }

    // User exists, now check if they're in the admin group
    const groupsResponse = await cognito
      .adminListGroupsForUser({
        UserPoolId: USER_POOL_ID,
        Username: email,
      })
      .promise()

    const groups = (groupsResponse.Groups || []).map((g) => g.GroupName)
    const isAdmin = groups.includes('admin')

    console.log(`User ${email} exists, isAdmin: ${isAdmin}, groups: ${groups.join(', ')}`)

    if (!isAdmin) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          exists: true,
          isAdmin: false,
          message: 'This email is not registered as an admin.',
        }),
      }
    }

    // User is admin
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        exists: true,
        isAdmin: true,
        message: 'User is admin. Proceed with OTP.',
      }),
    }
  } catch (error) {
    console.error('Error checking admin status:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to check admin status',
      }),
    }
  }
}

module.exports = { handler }
