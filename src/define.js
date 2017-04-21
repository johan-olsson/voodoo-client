'use strict'

const validator = require('argument-validator')
const Objectstreamer = require('objectstreamer')
const Response = require('../lib/Response')
const uuid = require('uuid').v4

module.exports = function(name, handler) {
  validator.string(name, 'name')
  validator.function(handler, 'handler')

  const id = uuid()

  this.queue.push((next) => {

    this.instream.filter(req => req.match({
        type: 'rpc',
        action: 'run',
        name
      }))
      .subscribe((req) => {

        const res = new Response(this, req)

        Promise.resolve()
          .then(() => handler(req, res))
          .catch(res.error)
      })

    this.outstream.next({
      id: id,
      name: name,
      action: 'define',
      type: 'rpc'
    })

    next()
  })

  return this
}
