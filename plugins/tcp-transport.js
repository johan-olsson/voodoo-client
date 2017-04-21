'use strict'

var net = require('net')
var Rx = require('rxjs')

module.exports = function(options = {}) {

  return (createClient) => {

    console.log('Connecting to tcp transport...')

    const client = net.createConnection(options, (err) => {
      if (err) console.error(err);

      console.log('Connected to tcp transport!')

      createClient((instream, outstream) => {

        outstream.subscribe(data => {
          client.write(data + '·')
        })

        Rx.Observable.create(observer => {
          client.on('data', (data) => {
            data.toString('utf8')
              .split('·')
              .forEach((data) => {
                observer.next(data)
              })
          })
        })
        .subscribe(instream)
      })
    })
  }
}
