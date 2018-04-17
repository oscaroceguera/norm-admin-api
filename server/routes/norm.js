const { Norm } = require('../models/norm')
const { Item } = require('../models/item')
const { Module } = require('../models/module')
const _ = require('lodash')

exports.addSchema = async (req, res) => {
  const norm = new Norm(req.body)

  try {
    const doc = await norm.save()
    res.send(doc.toPublic())
  } catch (e) {
    res.status(400).send(e)
  }
}

exports.getSchemas = async (req, res) => {
  try {
    const schemas = await Norm.find().populate('modules').sort('-createdAt')
    res.send(schemas.map(i => i.toPublic()))
  } catch (e) {
    res.status(400).send(e)
  }
}

exports.getSchemaByUuid = async (req, res) => {
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
}

exports.updateSchema = async (req, res) => {
  const uuid = req.params.uuid
  const body = _.pick(req.body, ['name', 'version', 'description'])

  if (body.name === '') {
    return res.status(400).send({ message: 'Name is required' })
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
}

exports.deleteSchema = async (req, res) => {
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
}
