'use strict'

const assert = require('assert')
const nock = require('nock')
const Request = require('../lib/Request')

const Client = require('../')

describe('transport', () => {

  const options = {
    secret: 'token'
  }

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

    client.transport((createClient) => {

      createClient((instream, outstream) => {

        outstream.subscribe((data) => {
          data = JSON.parse(data)
          assert.equal(data.name, 'event-name')
          assert.equal(data.action, 'subscribe')
          assert.equal(data.type, 'event')

          instream.next(new Request({
            id: data.id,
            name: 'event-name',
            type: 'event',
            action: 'emit',
            data: {
              some: 'data'
            }
          }))
        })
      })

      client.subscribe('event-name', (event) => {
        assert.equal(JSON.stringify(event.data), '{"some":"data"}')
        done()
      })
    })
  })
})
