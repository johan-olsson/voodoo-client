'use strict'

const validator = require('argument-validator')
const Objectstreamer = require('objectstreamer')
const uuid = require('uuid').v4

module.exports = function(name, handler) {
  validator.string(name, 'name')
  validator.function(handler, 'handler')

  this.queue.push((next) => {

    this.instream = this.instream.filter((data) => {
      return new Promise((resolve, reject) => {
        if (data.type !== 'rpc' || data.action !== 'run' || data.name !== name)
          resolve();

        handler({
          user: data.user,
          data: data.data
        }, (valid) => {
          if (!valid) {
            this.outstream.next(Object.assign({}, data, {
              action: 'error',
              data: 'NOT_VALID'
            }))
            reject()
          }

          resolve()
        })
      })
    })

    next()
  })

  return this
}
