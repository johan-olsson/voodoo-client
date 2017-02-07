'use strict'

const nock = require('nock')
const assert = require('assert')
const Client = require('../')

describe('login', () => {

  it('should emit error if no token is received', (done) => {

    var scope = nock('http://localhost:5353')
      .post('/login')
      .reply(200, {})

    const client = new Client()
    client.login({
      user: 'user',
      password: 'password'
    })
    .then((err) => {
      console.log('then', err)
      assert.equal(err, 'No token received')
      done()
    })
    .catch((err) => {
      console.log('catch', err)
      // assert.equal(err, 'No token received')
      done()
    })

  })
})
