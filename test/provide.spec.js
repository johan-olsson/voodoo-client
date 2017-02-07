'use strict'

const nock = require('nock')
const assert = require('assert')
const Client = require('../')

var scope = nock('http://localhost:5353')
  .post('/login')
  .reply(200, {
    token: 'token'
  })

describe('provide', () => {

  const client = new Client()
  client.login({
    user: 'user',
    password: 'password'
  })

  it('should handle out- and in-streams', (done) => {

    client.provide('rpc-name', (req, res) => {
      assert.equal(req.data, 'payload-data')
      res.send('response-payload-data')
    })

    client.outstream.read((data) => {
      assert.equal(data.id, 'ID')
      assert.equal(data.type, 'rpc')
      assert.equal(data.name, 'rpc-name')
      assert.equal(data.payload, 'response-payload-data')
      assert.equal(data.action, 'response')

      done()
    })

    client.instream.write({
      id: 'ID',
      type: 'rpc',
      name: 'rpc-name',
      payload: 'payload-data',
      action: 'make'
    })
  })
})
