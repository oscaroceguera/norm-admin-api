const expect = require('expect')
const request = require('supertest')
const { app } = require('../../server')
const { Module } = require('../../models/module')
const { Item } = require('../../models/item')
const { Norm } = require('../../models/norm')
const { populateModules } = require('../utils/populateModules')
const { moduleFixture } = require('../fixtures')
const { normFixture } = require('../fixtures')
const { ObjectID } = require('mongodb')

function test () {
  return request(app)
}

beforeEach(populateModules)

describe('[POST] /modules/:shcemaUuid', () => {
  it('should create a new module', done => {
    const _module = {
      name: 'Modulo primero para senasica BPPA',
      number: '1.2',
      order: 1
    }

    test()
      .post(`/api/schemas/${normFixture[0].uuid}/modules`)
      .send(_module)
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject(_module)
        expect(typeof res.body.order).toBe('number')
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Module.find({ name: _module.name }).then(modules => {
          expect(modules.length).toBe(1)
          expect(modules[0].name).toBe(_module.name)
          return modules
        }).then(module => {
          return Norm.find({ _id: module[0].norm }).populate('modules')
        }).then(norm => {
          expect(norm[0].modules.length).toBe(4)
          expect(norm[0].modules[3].uuid).toBe(res.body.uuid)
          done()
        }).catch(e => done(e))
      })
  })

  it('should not create module with invalid body data', (done) => {
    test()
      .post(`/api/schemas/${normFixture[0].uuid}/modules`)
      .send({})
      .expect(400)
      .end(done)
  })
})

describe('[GET] /schemas/:schemaUuid/modules', () => {
  it('should return modules by schema uuid', (done) => {
    test()
      .get(`/api/schemas/${normFixture[0].uuid}/modules`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(3)
        expect(res.body[0].norm.name).toBe(normFixture[0].name)
      })
      .end(done)
  })

  it('should return 404 if modules not fount by schema-uuid', done => {
    test()
      .get('/api/schemas/66a14dc1-8ef4-40ff-9390-6bdb46ddc643/modules')
      .expect(404)
      .end(done)
  })
})

describe('[GET] /modules/:moduleUuid', () => {
  it('should return module by uuid', (done) => {
    test()
      .get(`/api/modules/${moduleFixture[3].uuid}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(moduleFixture[3].name)
      })
      .end(done)
  })

  it('should not return module to incorrectly uuid', (done) => {
    test()
      .get('/api/modules/66a14dc1-8ef4-40ff-9390-6bdb46ddc643/modules')
      .expect(404)
      .end(done)
  })
})

describe('[PATCH] /modules/:uuid', () => {
  it('should update the module', done => {
    const uuid = moduleFixture[3].uuid
    test()
      .patch(`/api/modules/${uuid}`)
      .send(moduleFixture[2])
      .expect(200)
      .expect(res => {
        expect(res.body.module.name).toBe(moduleFixture[2].name)
        expect(res.body.module.order).toBe(moduleFixture[2].order)
        expect(res.body.module.number).toBe(moduleFixture[2].number)
        expect(typeof res.body.module.order).toBe('number')
      })
      .end(done)
  })

  it('should not update with invalid data', done => {
    const uuid = moduleFixture[3].uuid
    const body = {
      name: 'as',
      number: 'as',
      order: ''
    }
    test()
      .patch(`/api/modules/${uuid}`)
      .send(body)
      .expect(400)
      .end(done)
  })

  it('should not found module to update', done => {
    test()
      .patch('/api/modules/abcd123456')
      .send(moduleFixture[1])
      .expect(404)
      .end(done)
  })
})

describe('[DELETE] /modules/:uuid', () => {
  it('should remove a module', done => {
    const uuid = moduleFixture[0].uuid
    const _id = moduleFixture[0]._id
    const normId = moduleFixture[0].norm
    test()
      .delete(`/api/modules/${uuid}`)
      .expect(200)
      .expect(res => {
        expect(res.body.module.uuid).toBe(uuid)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Module.findOne({ uuid }).then(module => {
          expect(module).toBeFalsy()
        })
        .then(() => {
          return Norm.findOne({ _id: normId }, {modules: {$elemMatch: {$eq: _id }}})
        })
        .then(norm => {
          expect(norm.modules.length).toBe(0)
          return Item.find({ module: _id })
        })
        .then(items => {
          expect(items.length).toBe(0)
          done()
        })
        .catch(e => done(e))
      })
  })

  it('should return 404 if module not found', done => {
    test()
      .delete('/api/items/123-123asda')
      .expect(404)
      .end(done)
  })
})
