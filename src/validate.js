'use strict'

const Objectstreamer = require('objectstreamer')
const uuid = require('uuid').v4

module.exports = function (name, handler) {

  this._queue.push((next) => {

    this.refinedstream = this.refinedstream.filter((data, done) => {
      if (data.type !== 'rpc' || data.action !== 'make' || data.name !== name)
        return true;

      handler({
        user: data.user,
        data: data.payload
      }, (valid) => {
        if (!valid) this.outstream.write(Object.assign({}, data, {
          action: 'error',
          payload: 'NOT_VALID'
        }))

        done(valid)
      })
    })

    next()
  })

  return this
}
