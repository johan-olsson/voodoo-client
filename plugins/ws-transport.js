'use strict'

var engineClient = require('engine.io-client')

module.exports = (url) => {

  const socket = engineClient(url)

  return (createClient) => {

    createClient((writeStream, readStream) => {

      socket.on('message', (data) => {
        writeStream.write(data)
      })

      readStream.read((data) => {
        socket.send(data)
      })
    })
  }
}
