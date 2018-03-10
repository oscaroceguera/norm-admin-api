const expect = require('expect')
const request = require('supertest')
const { app } = require('../../server')
const { Norm } = require('../../models/norm')
const { populateNorms } = require('../utils/populateNorms')

function test () {
  return request(app)
}

beforeEach(populateNorms)

describe('[POST] /schemas', () => {
  it('Should create a new schema', (done) => {
    const norm = {
      name: 'HACCP',
      version: 'v2550',
      description: 'SENASICA: Buenas Prácticas de Manufactura'
    }

    test()
      .post('/schemas')
      .send(norm)
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject(norm)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Norm.find({ name: norm.name }).then(norms => {
          expect(norms.length).toBe(1)
          expect(norms[0].name).toBe(norm.name)
          done()
        }).catch(e => done(e))
      })
  })

  it('should not create schema with invalid body data', done => {
    test()
      .post('/schemas')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Norm.find().then(norms => {
          expect(norms.length).toBe(2)
          done()
        }).catch(e => done(e))
      })
  })
})

describe('[GET] /schemas', () => {
  it('should get all todos', done => {
    test()
      .get('/schemas')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(2)
      })
      .end(done)
  })
})