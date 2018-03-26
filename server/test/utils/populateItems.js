const { Item } = require('../../models/item')
const { itemFixture } = require('../fixtures')

const populateItems = (done) => {
  Item.remove({})
    .then(() => {
      return Item.insertMany(itemFixture)
    })
    .then(() => done())
}

module.exports = { populateItems }
