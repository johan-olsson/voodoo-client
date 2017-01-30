'use strict'

const Objectstreamer = require('objectstreamer')
const uuid = require('uuid').v4

module.exports = function (name, handler) {

  const id = uuid()

  this._queue.push((next) => {

    const dispose = this.refinedstream.filter((data) => {
        return data.type === 'rpc' &&
          data.action === 'make' &&
          data.name === name
      })
      .read((data) => {

        const res = {
          send: (payload) => {
            this.outstream.write(Object.assign({}, data, {
                payload: payload,
                action: 'response'
              }))
          },
          error: (error) => {
            this.outstream.write(Object.assign({}, data, {
                payload: error,
                action: 'error'
              }))
          },
          end: (message) => {
            this.outstream.write(Object.assign({}, data, {
                payload: message,
                action: 'end'
              }))

            dispose()
          }
        }

        handler({
          user: data.user,
          data: data.payload
        }, res)
      })

    this.outstream.write({
      id: id,
      name: name,
      action: 'provide',
      type: 'rpc'
    })

    next()
  })

  return this
}
