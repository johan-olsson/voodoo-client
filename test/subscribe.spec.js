'use strict'

const nock = require('nock')
const assert = require('assert')
const Request = require('../lib/Request')
const Client = require('../')

describe('subscribe', () => {

  var scope = nock('http://localhost:5353')
    .post('/login', {
      user: 'user',
      password: 'password'
    })
    .reply(200, {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwibmFtZSI6IkpvaGFuIE9sc3NvbiJ9.knP61KUF1mJmBeIuVgGAIV4busRQh5RTuCfgaB-1CIo'
    })

  const client = new Client()

  client.login({
    user: 'user',
    password: 'password'
  })

  it('should handle out- and in-streams', (done) => {

    client.outstream.subscribe((req) => {

      assert.equal(req.type, 'event')
      assert.equal(req.name, 'event-name')
      assert.equal(req.action, 'subscribe')

      client.instream.next(new Request({
        id: req.id,
        type: 'event',
        name: 'event-name',
        data: 'event-data',
        action: 'emit'
      }))

      done()
    })

    client.subscribe('event-name', (event) => {
      assert.equal(event.data, 'event-data')
    })
  })
})
