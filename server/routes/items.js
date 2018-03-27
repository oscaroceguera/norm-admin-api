const _ = require('lodash')
const { Module } = require('../models/module')
const { Item } = require('../models/item')
const { addWithRef } = require('../helpers')

exports.addItem = async (req, res) => {
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
}

exports.getItemsByModuleUuid = async (req, res) => {
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
}

exports.getItemByUuid = async (req, res) => {
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
}

exports.updateItem = async (req, res) => {
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
}

exports.deleteItem = async (req, res) => {
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
}
