require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')
const _ = require('lodash')

const { Norm } = require('./models/norm')
const { Module } = require('./models/module')

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

app.get('/schemas', async (req, res) => {
  try {
    const schemas = await Norm.find().populate('modules')
    res.send(schemas)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/schemas/:uuid', async (req, res) => {
  const uuid = req.params.uuid

  try {
    const schema = await Norm.findOne({ uuid: uuid }).populate('modules')
    if (!schema) {
      return res.status(404).send()
    }
    res.send({ schema })
  } catch (e) {
    res.status(400).send(e)
  }
})

app.patch('/schemas/:uuid', async (req, res) => {
  const uuid = req.params.uuid
  const body = _.pick(req.body, ['name', 'version', 'description'])

  if (body.name === '') {
    return res.status(400).send({message: 'Name is required'})
  }

  if (body.version === '') {
    return res.status(400).send({ message: 'Version is required' })
  }

  try {
    const schema = await Norm.findOneAndUpdate({ uuid: uuid }, { $set: body }, { new: true })

    if (!schema) {
      return res.status(404).send()
    }

    res.send({schema})
  } catch (e) {
    res.status(400).send(e)
  }
})

app.post('/schemas/:schemaUuid/modules', async (req, res) => {
  const uuid = req.params.schemaUuid

  try {
    const { _id } = await Norm.findOne({ uuid })
    req.body.norm = _id

    const _module = new Module(req.body)
    const doc = await _module.save()

    await Norm.findOneAndUpdate(
      { uuid: uuid },
      { $push: { 'modules': doc._id } }
    )

    res.send(doc)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = { app }
