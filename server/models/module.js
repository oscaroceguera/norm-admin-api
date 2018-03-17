const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')

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
  items: [{ type: String }]
})

const Module = mongoose.model('Module', ModuleSchema)
module.exports = { Module }
