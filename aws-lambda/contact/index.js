const AWS = require('aws-sdk')
const nodeCrypto = require('crypto')

const dynamo = new AWS.DynamoDB.DocumentClient()
const TABLE = process.env.CONTACTS_TABLE

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Content-Type': 'application/json'
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  }
}

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2))

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request')
    return response(200, { message: 'OK' })
  }

  // Handle POST request
  if (event.httpMethod !== 'POST') {
    return response(405, { error: 'Method not allowed' })
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const { name, email, phone, interest, message } = body

    if (!name || !email || !message) {
      return response(400, { error: 'Missing required fields: name, email, message' })
    }

    const id = nodeCrypto.randomBytes(8).toString('hex')
    const item = {
      id,
      name,
      email,
      phone: phone || null,
      interest: interest || null,
      message,
      createdAt: new Date().toISOString()
    }

    if (!TABLE) {
      console.error('CONTACTS_TABLE env var is not set')
      return response(500, { error: 'Server misconfigured' })
    }

    await dynamo.put({ TableName: TABLE, Item: item }).promise()
    console.log('Successfully saved contact:', id)

    return response(200, { ok: true, id })
  } catch (err) {
    console.error('Handler error', err)
    return response(500, { error: 'Internal server error' })
  }
}
