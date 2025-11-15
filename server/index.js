import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3001
const API_ENDPOINT = process.env.AI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions'
const API_KEY = process.env.AI_API_KEY
const API_PROVIDER = process.env.AI_API_PROVIDER || 'openai'

if (!API_KEY) {
  console.warn('Warning: No API key set in environment variable AI_API_KEY')
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    port: PORT,
    hasApiKey: !!API_KEY,
    provider: API_PROVIDER,
    apiEndpoint: API_ENDPOINT
  })
})

app.post('/api/generate', async (req, res) => {
  try {
    if (!API_KEY) {
      console.error('Missing API key')
      return res.status(400).json({ error: 'API key not configured. Set AI_API_KEY environment variable.' })
    }

    const body = req.body
    console.log('Forwarding request to', API_PROVIDER, 'API...')
    console.log('Model:', body.model)
    console.log('Endpoint:', API_ENDPOINT)

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    })

    let data
    try {
      data = await response.json()
    } catch (parseErr) {
      console.error('Failed to parse response as JSON:', parseErr)
      const text = await response.text()
      return res.status(500).json({ error: 'Failed to parse API response', details: text })
    }
    
    if (!response.ok) {
      console.error('OpenAI API error:', response.status, data)
      return res.status(response.status).json(data)
    }

    console.log('Success! Response received from OpenAI')
    res.json(data)
  } catch (err) {
    console.error('Server error:', err.message, err.stack)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`API endpoint: POST http://localhost:${PORT}/api/generate`)
})
