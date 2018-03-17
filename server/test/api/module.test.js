const expect = require('expect')
const request = require('supertest')
const { app } = require('../../server')
const { Module } = require('../../models/module')
const { Norm } = require('../../models/norm')
const { populateModules } = require('../utils/populateModules')
// const { moduleFixture } = require('../fixtures')
const { ObjectID } = require('mongodb');

function test () {
  return request(app)
}

beforeEach(populateModules)

describe('[POST] /modules/:shcemaUuid', () => {
  it('should createa new module', done => {
    const _module = {
      name: 'Modulo primero para senasica BPPA',
      number: '1.2',
      order: 1
    }

    test()
      .post('/schemas/0596a329-2d31-4762-9b77-8bd58ad83a1d/modules')
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

        console.log('res.body._id', res.body._id)

        Module.find({ name: _module.name }).then(modules => {
          expect(modules.length).toBe(1)
          expect(modules[0].name).toBe(_module.name)
          return modules
        })
        .then(module => {
          return Norm.find({ _id: module[0].norm })
        }).then(norm => {
          const idLastModule = new ObjectID(norm[0].modules[3]).toHexString()
          console.log('norm[0].modules[0]', norm[0].modules)
          expect(norm[0].modules.length).toBe(4)
          expect(idLastModule).toBe(res.body._id)
          done()
        })
        .catch(e => done(e))
      })
  })

  it('should not create module with invalid body data', (done) => {
    test()
      .post('/schemas/0596a329-2d31-4762-9b77-8bd58ad83a1d/modules')
      .send({})
      .expect(400)
      .end(done)
  })
})