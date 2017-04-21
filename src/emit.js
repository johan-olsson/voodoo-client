'use strict'

const validator = require('argument-validator')
const Objectstreamer = require('objectstreamer')
const uuid = require('uuid').v4

module.exports = function(name, data) {
  validator.string(name, 'name')
  validator.isType('unsubscribed', data)

  const id = uuid()

  this.queue.push((next) => {

    this.outstream.next({
      id: id,
      name: name,
      action: 'emit',
      type: 'event',
      data: data
    })

    next()
  })

  return this
}
