'use strict'

const nock = require('nock')
const assert = require('assert')
const Client = require('../')

var scope = nock('http://localhost:5353')
  .post('/login')
  .reply(200, {
    token: 'token'
  })

describe('subscribe', () => {

  const client = new Client()
  client.login({
    user: 'user',
    password: 'password'
  })

  it('should handle out- and in-streams', (done) => {

    client.outstream.read((message) => {

      assert.equal(message.type, 'event')
      assert.equal(message.name, 'event-name')
      assert.equal(message.action, 'subscribe')

      client.instream.write({
        id: message.id,
        type: 'event',
        name: 'event-name',
        payload: 'event-data',
        action: 'emit'
      })

      done()
    })

    client.subscribe('event-name', (event) => {
      assert.equal(event.data, 'event-data')
    })
  })
})
