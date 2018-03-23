require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')
const _ = require('lodash')

const { Norm } = require('./models/norm')
const { Module } = require('./models/module')
const { Item } = require('./models/item')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/schemas', async (req, res) => {
  const norm = new Norm(req.body)

  try {
    const doc = await norm.save()
    res.send(doc.toPublic())
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/schemas', async (req, res) => {
  try {
    const schemas = await Norm.find().populate('modules')

    res.send(schemas.map(i => i.toPublic()))
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
    res.send({ schema: schema.toPublic() })
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

    res.send({ schema: schema.toPublic() })
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

    res.send(doc.toPublic)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/schemas/:schemaUuid/modules', async (req, res) => {
  const uuid = req.params.schemaUuid

  try {
    const norm = await Norm.findOne({ uuid })

    if (!norm) {
      return res.status(404).send()
    }

    const modules = await Module.find({ norm: norm._id }).populate('norm')

    res.send(modules.map(m => m.toPublic()))
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/modules/:moduleUuid', async (req, res) => {
  const uuid = req.params.moduleUuid

  try {
    const module = await Module.findOne({ uuid }).populate('norm')
    if (!module) {
      return res.status(404).send()
    }

    res.send(module.toPublic())
  } catch (e) {
    res.status(400).send(e)
  }
})

app.patch('/modules/:uuid', async (req, res) => {
  const uuid = req.params.uuid
  const body = _.pick(req.body, ['name', 'order', 'number'])

  if (body.name === '') {
    return res.status(400).send({ message: 'Name is required' })
  }

  if (body.order === '') {
    return res.status(400).send({ message: 'Order is required' })
  }

  if (body.number === '') {
    return res.status(400).send({ message: 'Number is required' })
  }

  try {
    const module = await Module.findOneAndUpdate({ uuid: uuid }, { $set: body }, { new: true })

    if (!module) {
      return res.status(404).send()
    }

    res.send({ module: module.toPublic() })
  } catch (e) {
    res.status(400).send()
  }
})

app.post('/modules/:moduleUuid/items', async (req, res) => {
  const uuid = req.params.moduleUuid

  try {
    const { _id } = await Module.findOne({ uuid })
    req.body.module = _id

    const _item = new Item(req.body)
    const doc = await _item.save()

    await Module.findOneAndUpdate(
      { uuid: uuid },
      {$push: {'items': doc._id}}
    )

    res.send(doc.toPublic())
  } catch (e) {
    res.status(400).send(e)
  }
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = { app }
