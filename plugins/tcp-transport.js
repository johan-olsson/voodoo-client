'use strict'

var net = require('net')

module.exports = function(options = {}) {

  return (createClient) => {

    const client = net.createConnection(options, (err) => {
      if (err) console.log(err)

      console.log('Connected to tcp server')

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
    })
  }
}
