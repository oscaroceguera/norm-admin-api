const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')

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
  modules: [{ type: String }]
}, { timestamps: true })

const Norm = mongoose.model('Norm', NormSchema)
module.exports = { Norm }
