'use strict'

const validator = require('argument-validator')
const Objectstreamer = require('objectstreamer')
const uuid = require('uuid').v4

module.exports = function(name, handler) {
  validator.string(name, 'name')
  validator.function(handler, 'handler')

  const id = uuid()

  this.queue.push((next) => {

    this.instream.filter((req) => req.match({
        type: 'event',
        action: 'emit',
        name,
        id
      }))
      .subscribe(handler)

    this.outstream.next({
      id: id,
      name: name,
      action: 'subscribe',
      type: 'event'
    })

    next()
  })

  return this
}
