const { Norm } = require('../../models/norm')
const { normFixture } = require('../fixtures')

const populateNorms = (done) => {
  Norm.remove({}).then(() => {
    return Norm.insertMany(normFixture)
  }).then(() => done())
}

module.exports = { populateNorms }
