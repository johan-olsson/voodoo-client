'use strict'

const assert = require('assert')
const nock = require('nock')

const Client = require('../')

var scope = nock('http://localhost:8080')
  .post('/login')
  .reply(200, {
    token: 'token'
  })

describe('transport', () => {

  const options = {
    secret: 'token'
  }

  const client = new Client()

  client.login({
    user: 'user',
    password: 'password'
  })

  it('should handle out- and in-streams', (done) => {

    client.subscribe('event-name', (event) => {
      assert.equal(JSON.stringify(event), '{"some":"payload"}')
      client.emit('another-event', 'event-data')
    })

    client.transport((createClient) => {

      createClient((instream, outstream) => {

        outstream.read((data) => {
          data = JSON.parse(data)
          assert.equal(data.name, 'another-event')
          assert.equal(data.payload, 'event-data')
          assert.equal(data.action, 'emit')
          assert.equal(data.type, 'event')
          done()
        })

        instream.write({
          id: 'id',
          name: 'event-name',
          type: 'event',
          action: 'emit',
          payload: {
            some: 'payload'
          }
        })
      })
    })
  })
})
