const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const _ = require('lodash')

const ModuleSchema = new Schema({
  uuid: { type: String, default: v4 },
  name: {
    type: String,
    required: true,
    trim: true
  },
  number: { type: String, required: true },
  order: { type: Number, required: true },
  norm: {
    type: Schema.Types.ObjectId,
    ref: 'Norm'
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }]
}, { timestamps: true })

ModuleSchema.methods.toPublic = function () {
  const module = this
  const moduleObj = module.toObject()

  return _.omit(moduleObj, ['_id', '__v'])
}

ModuleSchema.methods.toParentRef = function () {
  const module = this
  const moduleObj = module.toObject()

  return _.omit(moduleObj, ['_id', '__v', 'norm.modules'])
}

const Module = mongoose.model('Module', ModuleSchema)
module.exports = { Module }
