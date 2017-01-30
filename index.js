'use strict'

const Objectstream = require('objectstreamer')
const Queue = require('queue')
const axios = require('axios')

class Client {

  constructor(options) {

    this._options = Object.assign({
      host: 'localhost',
      port: 8080
    }, options)

    this._queue = new Queue()
    this._queue.pause()

    this.outstream = new Objectstream()
    this.instream = new Objectstream()
    this.refinedstream = this.instream
      .map((data) => (data instanceof Buffer) ? data.toString() : data)
      .map((data) => (typeof data === 'string') ? JSON.parse(data) : data)
  }

  login(credentials) {

    const options = this._options

    return axios.post(`http://${options.host}:${options.port}/login`, credentials)
      .then(res => {

        if (!res.data.token) return console.error('No token received');

        this._token = res.data.token
        this._queue.resume()
      })
      .catch(console.log)

    return this
  }

  transport(handleTransport) {

    this._queue.push((next) => {

      handleTransport((clientConstuctor) => {
        clientConstuctor(this.instream, this.outstream
          .map((data) => Object.assign({}, data, {
            token: this._token
          }))
          .map(data => {
            return JSON.stringify(data)
          }))
      })

      next()
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
