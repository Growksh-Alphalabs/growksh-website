const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event) => {
  // After successful authentication/confirmation, ensure user profile exists in UsersTable
  const usersTable = process.env.USERS_TABLE
  if (!usersTable) return event

  const userId = event.userName
  const attrs = event.request.userAttributes || {}
  const email = attrs.email
  const name = attrs.name || ''
  const phone = attrs.phone_number || ''

  try {
    await ddb.put({
      TableName: usersTable,
      Item: {
        userId,
        email,
        name,
        phone,
        createdAt: new Date().toISOString()
      },
      ConditionExpression: 'attribute_not_exists(userId)'
    }).promise()
    console.log('Created user profile for', userId)
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      // already exists
    } else {
      console.warn('Failed to write user profile', err)
    }
  }

  return event
}
