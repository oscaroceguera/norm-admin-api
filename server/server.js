require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')
const cors = require('cors')

const app = express()
app.use(cors())

const port = process.env.PORT
const routes = require('./routes')

app.use(bodyParser.json())

routes(app)

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = { app }
