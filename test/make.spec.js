'use strict'

const nock = require('nock')
const assert = require('assert')
const Client = require('../')

var scope = nock('http://localhost:5353')
  .post('/login')
  .reply(200, {
    token: 'token'
  })

describe('make', () => {

  const client = new Client()
  client.login({
    user: 'user',
    password: 'password'
  })

  it('should handle out- and in-streams', (done) => {

    client.outstream.read((data) => {
      assert.equal(data.type, 'rpc')
      assert.equal(data.name, 'rpc-name')
      assert.equal(data.payload, 'request-payload')
      assert.equal(data.action, 'make')

      client.instream.write({
        id: data.id,
        type: 'rpc',
        name: 'rpc-name',
        payload: 'response-data',
        action: 'make'
      })
    })

    client.make('rpc-name', 'request-payload', (res) => {
      assert.equal(res, 'response-data')
      done()
    })
  })
})
