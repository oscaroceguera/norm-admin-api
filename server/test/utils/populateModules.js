const { Module } = require('../../models/module')
const { moduleFixture } = require('../fixtures')

const populateModules = (done) => {
  Module.remove({})
    .then(() => {
      return Module.insertMany(moduleFixture)
    })
    .then(() => done())
}

module.exports = { populateModules }
