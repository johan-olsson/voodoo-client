'use strict'

const validator = require('argument-validator')
const Objectstreamer = require('objectstreamer')
const uuid = require('uuid').v4

module.exports = function(name, data, handler) {
  validator.string(name, 'name')
  validator.isType('unsubscribed', data)
  validator.function(handler, 'handler')

  const id = uuid()

  this.queue.push((next) => {

    this.instream.filter((data) => {
        return data.id === id
      })
      .subscribe((data) => {
        if (handler) handler(data.data)
      })

    this.outstream.next({
      id: id,
      name: name,
      action: 'run',
      type: 'rpc',
      data: data
    })

    next()
  })

  return this
}
