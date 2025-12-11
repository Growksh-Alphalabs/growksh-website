const AWS = require('aws-sdk')
const crypto = require('crypto')

const dynamo = new AWS.DynamoDB.DocumentClient()
const TABLE = process.env.CONTACTS_TABLE

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST'
    },
    body: JSON.stringify(body)
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return response(200, { ok: true })
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const { name, email, phone, interest, message } = body

    if (!name || !email || !message) {
      return response(400, { error: 'Missing required fields: name, email, message' })
    }

    const id = crypto.randomBytes(8).toString('hex')
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

    return response(200, { ok: true, id })
  } catch (err) {
    console.error('Handler error', err)
    return response(500, { error: 'Internal server error' })
  }
}
