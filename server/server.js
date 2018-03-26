require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')
const _ = require('lodash')

const { Norm } = require('./models/norm')
const { Module } = require('./models/module')
const { Item } = require('./models/item')
const { addWithRef } = require('./helpers')

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

app.delete('/schemas/:uuid', async (req, res) => {
  const uuid = req.params.uuid
  try {
    const data = await Norm.findOne({ uuid })

    let items = []
    for (let key of data.modules) {
      const item = await Item.find({ module: key })
      items.push(item)
    }

    const _items = items.reduce((a, b) => a.concat(b), [])
    for (let key of _items) {
      await Item.findByIdAndRemove(key)
    }

    for (let key of data.modules) {
      await Module.findByIdAndRemove(key)
    }

    const norm = await Norm.findOneAndRemove({ uuid: uuid })

    if (!norm) {
      return res.status(404).send()
    }

    res.send({ norm: norm.toPublic() })
  } catch (e) {
    res.status(404).send()
  }
})

app.post('/schemas/:schemaUuid/modules', async (req, res) => {
  const uuid = req.params.schemaUuid
  const body = await addWithRef(
    uuid,
    req.body,
    Norm,
    'norm',
    Module,
    'modules'
  )

  res.status(body.status).send(body.data)
})

app.get('/schemas/:schemaUuid/modules', async (req, res) => {
  const uuid = req.params.schemaUuid

  try {
    const norm = await Norm.findOne({ uuid })

    if (!norm) {
      return res.status(404).send()
    }

    const modules = await Module.find({ norm: norm._id }).populate('norm')

    res.send(modules.map(m => m.toParentRef()))
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/modules/:moduleUuid', async (req, res) => {
  const uuid = req.params.moduleUuid

  try {
    const module = await Module.findOne({ uuid }).populate('items')
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

app.delete('/modules/:uuid', async (req, res) => {
  const uuid = req.params.uuid
  try {
    const module = await Module.findOneAndRemove({
      uuid: uuid
    })

    if (!module) {
      return res.status(404).send()
    }

    for (let key of module.items) {
      await Item.findByIdAndRemove(key)
    }

    res.send({ module: module.toPublic() })
  } catch (e) {
    res.status(404).send()
  }
})

app.post('/modules/:moduleUuid/items', async (req, res) => {
  const uuid = req.params.moduleUuid

  const body = await addWithRef(
    uuid,
    req.body,
    Module,
    'module',
    Item,
    'items'
  )

  res.status(body.status).send(body.data)
})

app.get('/modules/:moduleUuid/items', async (req, res) => {
  const uuid = req.params.moduleUuid

  try {
    const module = await Module.findOne({ uuid })
    if (!module) {
      return res.status(404).send()
    }

    const items = await Item.find({ module: module._id }).populate('module')
    res.send(items)
  } catch (e) {
    res.send(400).send(e)
  }
})

app.get('/items/:itemUuid', async (req, res) => {
  const uuid = req.params.itemUuid

  try {
    const item = await Item.findOne({ uuid })
    if (!item) {
      return res.status(404).send()
    }

    res.send(item.toPublic())
  } catch (e) {
    res.status(400).send(e)
  }
})

app.patch('/items/:uuid', async (req, res) => {
  const uuid = req.params.uuid
  const body = _.pick(req.body, ['question', 'comment', 'value', 'number', 'order'])

  if (body.question === '') {
    return res.status(400).send({ message: 'question is required' })
  }

  if (body.comment === '') {
    return res.status(400).send({ message: 'comment is required' })
  }

  if (body.value === '') {
    return res.status(400).send({ message: 'value is required' })
  }

  if (body.number === '') {
    return res.status(400).send({ message: 'Number is required' })
  }

  if (body.order === '') {
    return res.status(400).send({ message: 'Order is required' })
  }

  try {
    const item = await Item.findOneAndUpdate({ uuid: uuid }, { $set: body }, { new: true })

    if (!item) {
      return res.status(404).send()
    }

    res.send({ item: item.toPublic() })
  } catch (e) {
    res.status(400).send()
  }
})

app.delete('/items/:uuid', async (req, res) => {
  const uuid = req.params.uuid
  try {
    const item = await Item.findOneAndRemove({
      uuid: uuid
    })

    if (!item) {
      return res.status(404).send()
    }
    res.send({ item: item.toPublic() })
  } catch (e) {
    res.status(404).send()
  }
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = { app }
