import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { CognitoIdentityProviderClient, AdminCreateUserCommand } from '@aws-sdk/client-cognito-identity-provider'

dotenv.config({ path: '.env.local' })

const app = express()
app.use(express.json())
// Allow requests from the Vite dev server origin
app.use(cors({ origin: 'http://localhost:5173' }))
// Manual preflight handler to avoid path-to-regexp '*' parsing issues
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return res.sendStatus(204)
  }
  next()
})

// Optional Cognito client (requires AWS creds + VITE_COGNITO_USER_POOL_ID in .env.local)
let cognitoClient = null
const COGNITO_POOL_ID = process.env.VITE_COGNITO_USER_POOL_ID || process.env.COGNITO_USER_POOL_ID
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && COGNITO_POOL_ID) {
  cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'ap-south-1' })
}

app.post('/auth/register', (req, res) => {
  const { email, name, phone } = req.body || {}
  console.log('[mock-auth] register', { email, name, phone })
  if (!email) return res.status(400).json({ message: 'email required' })
  // If Cognito client is configured, attempt to create a real user there
  if (cognitoClient) {
    const params = {
      UserPoolId: COGNITO_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name || '' }
      ],
      MessageAction: 'SUPPRESS'
    }
    if (phone) params.UserAttributes.push({ Name: 'phone_number', Value: phone })

    const cmd = new AdminCreateUserCommand(params)
    cognitoClient.send(cmd)
      .then((out) => {
        console.log('[mock-auth] cognito created user', out)
        res.status(201).json({ message: 'user created (cognito)', email })
      })
      .catch((err) => {
        console.error('[mock-auth] cognito error', err)
        res.status(500).json({ message: 'Cognito error', detail: err.message })
      })
    return
  }

  // Simulate creating user and return 201 when Cognito not configured
  res.status(201).json({ message: 'user created (mock)', email })
})

app.post('/auth/login', (req, res) => {
  const { email } = req.body || {}
  console.log('[mock-auth] login', { email })
  if (!email) return res.status(400).json({ message: 'email required' })
  // Simulate sending OTP
  res.status(200).json({ challenge: true, _dev_code: '123456' })
})

app.listen(3000, () => console.log('mock-auth running on http://localhost:3000'))
