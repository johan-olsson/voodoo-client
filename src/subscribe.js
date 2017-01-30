'use strict'

const Objectstreamer = require('objectstreamer')
const uuid = require('uuid').v4

module.exports = function (name, handler) {

  const id = uuid()

  this._queue.push((next) => {

    this.refinedstream.filter((data) => {
        return data.type === 'event' &&
          data.action === 'emit' &&
          data.name === name &&
          data.id === id
      })
      .read((data) => {
        handler({
          user: data.user,
          data: data.payload
        })
      })

    this.outstream.write({
      id: id,
      name: name,
      action: 'subscribe',
      type: 'event'
    })

    next()
  })

  return this
}
