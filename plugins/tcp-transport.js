'use strict'

var net = require('net')

module.exports = function(options = {}) {

  const client = net.connect(options, () => {
    console.log('Connected to server tcp-transport');
  })

  return (createClient) => {

    createClient((instream, outstream) => {

      outstream.read(data => {
        client.write(data + '·')
      })

      client.on('data', (data) => {
        data.toString('utf8')
          .split('·')
          .forEach((data) => {
            instream.write(data)
          })
      })
    })
  }
}
