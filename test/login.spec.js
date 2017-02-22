'use strict'

const nock = require('nock')
const assert = require('assert')
const Client = require('../')

describe('login', () => {

  it('should emit error if no token is received', (done) => {

    process.stdout.on('data', console.log.bind(this, 'stderr'))
    process.stderr.on('data', console.log.bind(this, 'stderr'))

    var scope = nock('http://localhost:5353')
      .post('/login', {
        user: 'user',
        password: 'password'
      })
      .times(2)
      .reply(200, {})

    const client = new Client()
    client.login({
      user: 'user',
      password: 'password'
    })
    .catch((err) => {
      assert.equal(err, 'No token received')
      done()
    })

  })

})
