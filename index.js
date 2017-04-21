'use strict'

const Request = require('./lib/Request')
const validator = require('argument-validator')
const jwt = require('jsonwebtoken')
const Queue = require('ssfq')
const axios = require('axios')
const EventEmitter = require('events')
const merge = require('./lib/merge')
const Rx = require('rxjs')

class Client {

  constructor(options = {}) {
    validator.objectOrEmpty(options, 'options')

    this.options = Object.assign({
      host: 'localhost',
      port: 5353
    }, options)

    this.queue = new Queue()
    this.queue.pause()

    this.user = null
    this.token = null

    this.outstream = new Rx.Subject()
    this.instream = new Rx.Subject()
  }

  login(credentials) {
    validator.object(credentials, 'credentials')

    const options = this.options

    return axios.post(`http://${options.host}:${options.port}/login`, credentials)
      .then(res => {

        if (!res.data.token) return Promise.reject('No token received');

        this.user = jwt.decode(res.data.token)
        this.token = res.data.token

        setTimeout(() => {
          console.log('Authentication successful!')
          this.queue.resume()
        })

        return this.user
      })
      .catch(err => {
        console.log('Authentication request failed!')

        setTimeout(() => {
          console.log('Retrying...')
          this.login(credentials)
        }, 1000)

        return Promise.reject(err);
      })

  }

  transport(transportHandler) {
    validator.function(transportHandler, 'transportHandler')

    transportHandler((constuctor) => {
      validator.function(constuctor, 'constuctor')

      const instream = new Rx.Subject()
      const outstream = this.outstream.map(data => {
        return JSON.stringify(merge(data, {
          token: this.token
        }))
      })

      instream
        .map(data => (data instanceof Buffer) ? data.toString() : data)
        .map(data => (typeof data === 'string') ? JSON.parse(data) : data)
        .map(data => new Request(data))
        .subscribe(data => {
          this.instream.next(data)
        })

      constuctor(instream, outstream)
    })

    return this
  }
}

Client.prototype.emit = require('./src/emit')
Client.prototype.subscribe = require('./src/subscribe')
Client.prototype.run = require('./src/run')
Client.prototype.define = require('./src/define')
Client.prototype.permission = require('./src/permission')
Client.prototype.validate = require('./src/validate')

module.exports = Client
