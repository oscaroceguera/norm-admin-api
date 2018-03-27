const _ = require('lodash')
const { Module } = require('../models/module')
const { Norm } = require('../models/norm')
const { addWithRef } = require('../helpers')

exports.addModule = async (req, res) => {
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
}

exports.getModulesBySchemaUuid = async (req, res) => {
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
}

exports.getModuleByUuid = async (req, res) => {
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
}

exports.updateModule = async (req, res) => {
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
}

exports.deleteModule = async (req, res) => {
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
}