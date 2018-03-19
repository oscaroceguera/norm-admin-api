const expect = require('expect')
const request = require('supertest')
const { app } = require('../../server')
const { Module } = require('../../models/module')
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
      .post(`/schemas/${normFixture[0].uuid}/modules`)
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
          return Norm.find({ _id: module[0].norm })
        }).then(norm => {
          const idLastModule = new ObjectID(norm[0].modules[3]).toHexString()

          expect(norm[0].modules.length).toBe(4)
          expect(idLastModule).toBe(res.body._id)
          done()
        })
        .catch(e => done(e))
      })
  })

  it('should not create module with invalid body data', (done) => {
    test()
      .post(`/schemas/${normFixture[0].uuid}/modules`)
      .send({})
      .expect(400)
      .end(done)
  })
})

describe('[GET] /schemas/:schemaUuid/modules', () => {
  it('should return modules by schema uuid', (done) => {
    test()
      .get(`/schemas/${normFixture[0].uuid}/modules`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(3)
        expect(res.body[1]._id).toBe(normFixture[0].modules[1])
      })
      .end(done)
  })

  it('should return 404 if modules not fount by schema-uuid', done => {
    test()
      .get('/schemas/66a14dc1-8ef4-40ff-9390-6bdb46ddc643/modules')
      .expect(404)
      .end(done)
  })
})

describe('[GET] /modules/:moduleUuid', () => {
  it('should return module by uuid', (done) => {
    test()
      .get(`/modules/${moduleFixture[3].uuid}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(moduleFixture[3].name)
      })
      .end(done)
  })

  it('should not return module to incorrectly uuid', (done) => {
    test()
      .get('/modules/66a14dc1-8ef4-40ff-9390-6bdb46ddc643/modules')
      .expect(404)
      .end(done)
  })
})