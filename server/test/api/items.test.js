const expect = require('expect')
const request = require('supertest')
const { app } = require('../../server')
const { Item } = require('../../models/item')
const { Module } = require('../../models/module')
const { populateItems } = require('../utils/populateItems')
const { moduleFixture } = require('../fixtures')
const { ObjectID } = require('mongodb')

function test() {
  return request(app)
}

beforeEach(populateItems)

describe('[POST] /modules/:uuidModule/schema', () => {
  it('should create a new item', done => {
    const _item = {
      question: '¿Question test...?',
      comment: 'comment test...',
      value: '20',
      number: '2.4',
      order: 5
    }

    test()
      .post(`/modules/${moduleFixture[2].uuid}/items`)
      .send(_item)
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject(_item)
        expect(typeof res.body.order).toBe('number')
        expect(res.body.module).toBe(moduleFixture[2]._id)
      })
      .end((err, res) => {
        if (err) {
          return donde(err)
        }

        Item.find({ question: _item.question }).then(items => {
          expect(items.length).toBe(1)
          expect(items[0].comment).toBe(_item.comment)
          return items
        }).then(item => {
          return Module.find({ _id: item[0].module})
        }).then(module => {
          const idModule = new ObjectID(module[0].items[0]).toHexString()

          expect(module[0].items.length).toBe(1)
          expect(idModule).toBe(res.body._id)
          done()
        }).catch(e => done(e))
      })
  })
})
