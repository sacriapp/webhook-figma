const express = require('express')
const path = require('path')
const bodyParser = require("body-parser")

// Initialize express and define a port
const app = express()
const PORT = process.env.PORT || 5000
// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

app.post('/figma', (req, res) => {
  const body = req.body;
  console.log(req, body) // Call your action on the request here
  res.status(200).end()
})

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
