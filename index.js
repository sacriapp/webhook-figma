const express = require('express')
const ngrok = require('ngrok')
const axios = require('axios')
const crypto = require('crypto')
const bodyParser = require("body-parser")
const endpoint = "https://heroku-test-figma.herokuapp.com"

// Initialize express and define a port
const app = express()
const PORT = process.env.PORT || 5000
const passcode = crypto.randomBytes(48).toString('hex')
app.use(bodyParser.json())

app.post('/', (request, response) => {
  const { body } = request
  console.log(body)
  if (body.passcode === passcode) {
    const { timestamp } = body
    console.log(`comment was updated at ${timestamp}`)
    response.sendStatus(200)
  } else {
    response.sendStatus(403)
  }
})

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

ngrok.connect(PORT).then(async () => {
  const response = await axios({
    url: 'https://api.figma.com/v2/webhooks',
    method: 'post',
    headers: {
      'X-Figma-Token': process.env.FIGMA_TOKEN,
    },
    data: {
      event_type: 'FILE_COMMENT',
      team_id: '829209809582428090',
      passcode,
      endpoint,
    },
  })
  console.log(`🎣 Webhook ${response.data.id} successfully created`)
})