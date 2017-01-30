'use strict'

const Objectstreamer = require('objectstreamer')
const uuid = require('uuid').v4

module.exports = function (name, payload, handler) {

  const id = uuid()

  this._queue.push((next) => {

    this.refinedstream.filter((data) => {
        return data.id === id
      })
      .read((data) => {
        if (handler) handler(data.payload)
      })

    this.outstream.write({
      id: id,
      name: name,
      action: 'make',
      type: 'rpc',
      payload: payload
    })

    next()
  })

  return this
}
