const expect = require('expect')
const request = require('supertest')
const { app } = require('../../server')
const { Item } = require('../../models/item')
const { Module } = require('../../models/module')
const { populateItems } = require('../utils/populateItems')
const { moduleFixture } = require('../fixtures')
const { itemFixture } = require('../fixtures')

function test() {
  return request(app)
}

beforeEach(populateItems)

describe('[POST] /modules/:uuidModule/items', () => {
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
          return done(err)
        }

        Item.find({ question: _item.question }).then(items => {
          expect(items.length).toBe(1)
          expect(items[0].comment).toBe(_item.comment)
          return items
        }).then(item => {
          return Module.find({ _id: item[0].module})
        }).then(module => {
          expect(module[0].items.length).toBe(1)
          done()
        }).catch(e => done(e))
      })
  })

  it('should not create a item with invalid body data', done => {
    test()
      .post(`/modules/${moduleFixture[2].uuid}/items`)
      .send({})
      .expect(400)
      .end(done)
  })
})

describe('[GET] /modules/:moduleUuid/items', () => {
  it('should return items by module uuid', done => {
    test()
      .get(`/modules/${moduleFixture[0].uuid}/items`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(3)
        expect(res.body[0].module.name).toBe(moduleFixture[0].name)
      })
      .end(done)
  })

  it('should return 404 if items not found by moduleUuid', done => {
    test()
      .get('/modules/66a14dc1-8ef4-40ff-9390-6bdb46ddc643/items')
      .expect(404)
      .end(done)
  })
})

describe('[GET] /items/:itenUuid', () => {
  it('should return item by uuid', done => {
    test()
      .get(`/items/${itemFixture[0].uuid}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(itemFixture[0].name)
      })
      .end(done)
  })

  it('should not return module to incorrectly uuid', (done) => {
    test()
      .get('/items/66a14dc1-8ef4-40ff-9390-6bdb46ddc643/modules')
      .expect(404)
      .end(done)
  })
})

describe('[PATCH] /items/:uuid', () => {
  it('should update the item', done => {
    const uuid = itemFixture[0].uuid
    test()
      .patch(`/items/${uuid}`)
      .send(itemFixture[2])
      .expect(200)
      .expect(res => {
        expect(res.body.item.name).toBe(itemFixture[2].name)
        expect(res.body.item.order).toBe(itemFixture[2].order)
        expect(res.body.item.number).toBe(itemFixture[2].number)
        expect(typeof res.body.item.order).toBe('number')
      })
      .end(done)
  })

  it('should not update with invalid data', done => {
    const uuid = itemFixture[0].uuid
    const body = {
      question: '',
      comment: 'Comment one..',
      value: '35',
      number: '1.1',
      order: 1
    }
    test()
      .patch(`/items/${uuid}`)
      .send(body)
      .expect(400)
      .end(done)
  })

  it('should not found item to update', done => {
    test()
      .patch('/items/abcd123456')
      .send(itemFixture[0])
      .expect(404)
      .end(done)
  })
})

describe('DELETE /items/:uuid', () => {
  it('should remove a item', done => {
    const uuid = itemFixture[0].uuid

    test()
      .delete(`/items/${uuid}`)
      .expect(200)
      .expect(res => {
        expect(res.body.item.uuid).toBe(uuid)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Item.findOne({ uuid: uuid }).then(item => {
          expect(item).toBeFalsy()
          done()
        }).catch(e => done(e))
      })
  })

  it('should return 404 if item not found', done => {
    test()
      .delete('/items/123-123asda')
      .expect(404)
      .end(done)
  })
})