'use strict'

const Objectstream = require('objectstreamer')
const validator = require('argument-validator')
const jwt = require('jsonwebtoken')
const Queue = require('ssfq')
const axios = require('axios')

class Client {

  constructor(options = {}) {
    validator.objectOrEmpty(options, 'options')

    this._options = Object.assign({
      host: 'localhost',
      port: 5353
    }, options)

    this._queue = new Queue()
    this._queue.pause()

    this.user = null
    this.outstream = new Objectstream()
    this.instream = new Objectstream()
    this.refinedstream = this.instream
      .map((data) => (data instanceof Buffer) ? data.toString() : data)
      .map((data) => (typeof data === 'string') ? JSON.parse(data) : data)
  }

  login(credentials) {
    validator.object(credentials, 'credentials')

    const options = this._options

    return axios.post(`http://${options.host}:${options.port}/login`, credentials)
      .then(res => {

        if (!res.data.token) return Promise.reject('No token received');

        this.user = jwt.decode(res.data.token)
        this._token = res.data.token

        setTimeout(() => {
          this._queue.resume()
        })

        return this.user
      })
      .catch(err => {
        console.log('Retrying')

        setTimeout(() => {
          this.login(credentials)
        }, 1000)

        return Promise.reject(err);
      })

  }

  transport(handleTransport) {
    validator.function(handleTransport, 'handleTransport')

    handleTransport((clientConstuctor) => {
      validator.function(clientConstuctor, 'clientConstuctor')

      clientConstuctor(this.instream, this.outstream
        .map((data) => Object.assign({}, data, {
          token: this._token
        }))
        .map(data => {
          return JSON.stringify(data)
        }))
    })

    return this
  }
}

Client.prototype.emit = require('./src/emit')
Client.prototype.subscribe = require('./src/subscribe')
Client.prototype.make = require('./src/make')
Client.prototype.provide = require('./src/provide')
Client.prototype.permission = require('./src/permission')
Client.prototype.validate = require('./src/validate')

module.exports = Client
