'use strict'

const nock = require('nock')
const assert = require('assert')
const Client = require('../')

var scope = nock('http://localhost:8080')
  .post('/login')
  .reply(200, {
    token: 'token'
  })

describe('emit', () => {

  const client = new Client()
  client.login({
    user: 'user',
    password: 'password'
  })

  it('should handle out- and in-streams', (done) => {

    client.outstream.read((data) => {
      assert.equal(data.type, 'event')
      assert.equal(data.name, 'event-name')
      assert.equal(data.payload, 'event-data')
      assert.equal(data.action, 'emit')

      done()
    })

    client.emit('event-name', 'event-data')
  })
})
