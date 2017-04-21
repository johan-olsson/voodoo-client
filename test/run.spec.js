'use strict'

const nock = require('nock')
const assert = require('assert')
const Request = require('../lib/Request')
const Client = require('../')

describe('run', () => {

  var scope = nock('http://localhost:5353')
    .post('/login', {
      user: 'user',
      password: 'password'
    })
    .reply(200, {
      token: 'token'
    })

  const client = new Client()
  client.login({
    user: 'user',
    password: 'password'
  })

  it('should handle out- and in-streams', (done) => {

    client.outstream.subscribe((data) => {
      assert.equal(data.type, 'rpc')
      assert.equal(data.name, 'rpc-name')
      assert.equal(data.data, 'request-data')
      assert.equal(data.action, 'run')

      client.instream.next(new Request({
        id: data.id,
        type: 'rpc',
        name: 'rpc-name',
        data: 'response-data',
        action: 'run'
      }))
    })

    client.run('rpc-name', 'request-data', (res) => {
      assert.equal(res, 'response-data')
      done()
    })
  })
})
