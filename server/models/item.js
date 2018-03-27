const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const _ = require('lodash')

const ItemSchema = new Schema({
  uuid: { type: String, default: v4 },
  question: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  comment: { type: String, required: true },
  value: { type: String, required: true },
  number: { type: String, required: true },
  order: { type: Number, required: true },
  module: {
    type: Schema.Types.ObjectId,
    ref: 'Module'
  }
}, { timestamps: true })

ItemSchema.methods.toPublic = function () {
  const item = this
  const itemObj = item.toObject()
  return _.omit(itemObj, ['_id', '__v'])
}

ItemSchema.methods.toParentRef = function () {
  const item = this
  const itemObj = item.toObject()
  return _.omit(itemObj, ['_id', '__v', 'module.items'])
}

const Item = mongoose.model('Item', ItemSchema)
module.exports = { Item }
