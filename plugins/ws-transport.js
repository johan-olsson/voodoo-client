'use strict'

const engineClient = require('engine.io-client')
const Rx = require('rxjs')

module.exports = (url) => {

  const socket = engineClient(url)

  return (createClient) => {

    console.log('Connecting to WebSocket transport...')

    createClient((instream, outstream) => {

      console.log('Connected to WebSocket transport!')

      socket.on('message', (data) => {
        instream.next(data)
      })

      outstream.subscribe((data) => {
        socket.send(data)
      })
    })
  }
}
