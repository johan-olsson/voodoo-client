'use strict'

const nock = require('nock')
const assert = require('assert')
const Request = require('../lib/Request')
const Client = require('../')

describe('define', () => {

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

    client.define('rpc-name', (req, res) => {
      assert.equal(req.data, 'data-data')
      res.send('response-data-data')
    })

    client.outstream.subscribe((req) => {
      assert.equal(req.id, 'ID')
      assert.equal(req.type, 'rpc')
      assert.equal(req.name, 'rpc-name')
      assert.equal(req.data, 'response-data-data')
      assert.equal(req.action, 'response')

      done()
    })

    client.instream.next(new Request({
      id: 'ID',
      type: 'rpc',
      name: 'rpc-name',
      data: 'data-data',
      action: 'run'
    }))
  })
})
