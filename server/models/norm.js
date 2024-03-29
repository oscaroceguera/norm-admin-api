const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const _ = require('lodash')

const NormSchema = new Schema({
  uuid: { type: String, default: v4 },
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  version: { type: String, required: true },
  description: { type: String },
  modules: [{
    type: Schema.Types.ObjectId,
    ref: 'Module'
  }]
}, { timestamps: true })

NormSchema.methods.toPublic = function () {
  let norm = this
  let normObj = norm.toObject()

  return _.omit(normObj, ['_id', '__v'])
}

const Norm = mongoose.model('Norm', NormSchema)
module.exports = { Norm }
