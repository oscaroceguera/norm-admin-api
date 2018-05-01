const { Norm } = require('../models/norm')
const { Item } = require('../models/item')
const { Module } = require('../models/module')
const _ = require('lodash')
const pug = require('pug')
const pdf = require('html-pdf')

exports.addSchema = async (req, res) => {
  const norm = new Norm(req.body)

  try {
    const doc = await norm.save()
    res.send(doc.toPublic())
  } catch (e) {
    res.status(400).send(e)
  }
}

exports.download = async (req, res) => {
  const uuid = req.params.uuid

  try {
    const norm = await Norm.findOne({ uuid })
    if (!norm) {
      return res.status(404).send()
    }

    const modules = await Module.find({ norm: norm._id }).populate('items').sort('order')

    const schema = {
      name: norm.name,
      version: norm.version,
      description: norm.description,
      modules
    }

    // res.render('index', schema)

    const compiler = pug.compileFile('server/views/index.pug')
    const html = compiler(schema)
    const options = {
      format: 'Letter',
      border: {
        top: '0.3in',
        bottom: '0.3in'
      },
      footer: {
        height: '5mm',
        contents: {
          default: '<div style="color: #444; font-size: 10px; text-align: right;">{{page}}/{{pages}}</div>'
        }
      }
    }

    pdf.create(html, options).toBuffer((err, response) => {
      if (err) return res.status(400).send(err)
      res.attachment(`${schema.name} v${schema.version}.pdf`)
      res.send(response)
    })
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
