const express = require('express')
const ngrok = require('ngrok')
const axios = require('axios')
const { IncomingWebhook } = require('@slack/webhook');

const bodyParser = require("body-parser")
const endpoint = "https://heroku-test-figma.herokuapp.com"

const slackURL = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);


// Initialize express and define a port
const app = express()
const PORT = process.env.PORT || 5000
const passcode = process.env.PASSCODE
app.use(bodyParser.json())

app.post('/', (request, response) => {
  const { body } = request
  if (body.passcode === passcode) {
    const { comment, file_key, file_name, mentions, triggerd_by, timestamp } = body
    notifySlack({comment, file_key, file_name, mentions, triggerd_by})
    console.log(`comment was updated at ${timestamp}`)
    response.sendStatus(200)
  } else {
    console.log(`inValid`)
    response.sendStatus(403)
  }
})

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

// toDo DBにIDを保存
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

const notifySlack = ({
  comment,
  file_key,
  file_name,
  mentions,
  triggerd_by
}) => {
  const triggerdName = triggerd_by.handle
  const url = parseFigmaUrl(file_key)
  const commentText = comment.map((n) => {
    return n.text
  })
  (async () => {
    await webhook.send([
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "New Comment Figma"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `
            ${triggerdName} がコメントをしました【<${url}|${file_name}】
          `
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `
            ${commentText}
          `
      }      
    ]
    );
  })();  
}

const parseFigmaUrl = (file_key) => {
  return `figma.com/file/${file_key}/`
}