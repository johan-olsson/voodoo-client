'use strict'

const nock = require('nock')
const assert = require('assert')
const Client = require('../')

var scope = nock('http://localhost:5353/login')
  .post('')
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

    client.outstream.subscribe((data) => {
      assert.equal(data.type, 'event')
      assert.equal(data.name, 'event-name')
      assert.equal(data.data, 'event-data')
      assert.equal(data.action, 'emit')

      done()
    })

    client.emit('event-name', 'event-data')
  })
})
