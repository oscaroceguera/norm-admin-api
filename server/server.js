require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')

const { Norm } = require('./models/norm')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/schemas', async (req, res) => {
  const norm = new Norm(req.body)

  try {
    const doc = await norm.save()
    res.send(doc)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = { app }
