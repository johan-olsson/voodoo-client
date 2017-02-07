'use strict'

const validator = require('argument-validator')
const Objectstreamer = require('objectstreamer')
const uuid = require('uuid').v4

module.exports = function (name, payload) {
  validator.string(name, 'name')
  validator.isType('undefined', payload)

  const id = uuid()

  this._queue.push((next) => {

    this.outstream.write({
      id: id,
      name: name,
      action: 'emit',
      type: 'event',
      payload: payload
    })

    next()
  })

  return this
}
