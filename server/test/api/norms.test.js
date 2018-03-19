const expect = require('expect')
const request = require('supertest')
const { app } = require('../../server')
const { Norm } = require('../../models/norm')
const { populateNorms } = require('../utils/populateNorms')
const { normFixture } = require('../fixtures')

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
          expect(norms.length).toBe(3)
          done()
        }).catch(e => done(e))
      })
  })
})

describe('[GET] /schemas', () => {
  it('should get all schemas', done => {
    test()
      .get('/schemas')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(3)
      })
      .end(done)
  })
})

describe('[GET] /schemas/:uuid', () => {
  it('should return schema by uuid', done => {
    test()
      .get(`/schemas/${normFixture[0].uuid}`)
      .expect(200)
      .expect(res => {
        expect(res.body.schema.name).toBe(normFixture[0].name)
      })
      .end(done)
  })

  it('should return 404 if schema not found', done => {
    test()
      .get('/schemas/66a14dc1-8ef4-40ff-9390-6bdb46ddc643')
      .expect(404)
      .end(done)
  })
})

describe('[PATCH] /schemas/:uuid', () => {
  it('should update the schema', done => {
    const uuid = normFixture[0].uuid
    const body = {
      name: 'Schema updated',
      version: 'version updated',
      description: 'description updated'
    }

    test()
      .patch(`/schemas/${uuid}`)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.schema.name).toBe(body.name)
        expect(res.body.schema.version).toBe(body.version)
        expect(res.body.schema.description).toBe(body.description)
        expect(typeof res.body.schema.version).toBe('string')
      })
      .end(done)
  })

  it('should not update shcema with invalid body data', done => {
    const uuid = normFixture[0].uuid
    const body = {
      name: '',
      version: '',
      description: 'description updated'
    }

    test()
      .patch(`/schemas/${uuid}`)
      .send(body)
      .expect(400)
      .end(done)
  })
})
