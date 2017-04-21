'use strict'

const merge = require('./merge')

module.exports = class Response {

  constructor(client, request) {
    this.client = client
    this.request = request

    this.send = this.send.bind(this)
    this.error = this.error.bind(this)
    this.end = this.end.bind(this)
  }

  send(data) {
    this.client.outstream.next(merge(this.request, {
      data: data,
      action: 'response',
      token: this.token
    }))
  }

  error(error) {
    this.client.outstream.next(merge(this.request, {
      data: error,
      action: 'error',
      token: this.token
    }))
  }

  end(message) {
    this.client.outstream.next(merge(this.request, {
      data: message,
      action: 'end',
      token: this.token
    }))
  }
}
