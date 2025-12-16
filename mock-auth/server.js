import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

app.post('/auth/register', (req, res) => {
  const { email, name, phone } = req.body || {}
  console.log('[mock-auth] register', { email, name, phone })
  if (!email) return res.status(400).json({ message: 'email required' })
  // Simulate creating user and return 201
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
