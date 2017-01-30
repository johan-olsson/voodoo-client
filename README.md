
# voodoo-client

The voodoo client is used to "communicate" with the voodoo-server over whatever transport you choose to use.

## Creating the client
```javascript

const Client = require('voodoo-client')

const client = new Client()
```

<hr>

Done. But now you have to add a transport to be able to do anything else then logging in.

## client.transport([function])
### Plugins

There are few included transport plugins:
#### tcp

The tcp transport takes the same arguments as [net.connect](https://nodejs.org/api/net.html#net_net_connect_options_connectlistener)

```javascript
const tcptransport = require('voodoo-server/plugins/tcp-transport')

vo.transport(tcptransport({
  path: '/tmp/voodoo.sock'
}))
```

#### websocket

The websocket transport is based on [engine.io-client](https://github.com/socketio/engine.io-client) takes the same arguments as [engine.io-client](https://github.com/socketio/engine.io-client)

```javascript
const wstransport = require('voodoo-server/plugins/ws-transport')

vo.transport(wstransport('ws://localhost:6344'))
```

<hr>

## client.login({credentials})

Login return a axios `Promise` and automatically store the token for future requests over the given transport.

```javascript

client.login({
  username: 'johano'
})

```

## client.provide(name, [handler])

The send command can be sent as many times as you like until you choose to end the subject.

```javascript

client.provide('say-hello', (req, res) => {

  for (let i = 0; i <= req.data.times || 1; i += 1)
    res.send(`Hello ${req.user.name}!!!`)

  res.end()
})

```

* **res.send({message})** _send the given message_
* **res.error({error})** _send the given error_
* **res.end({message})** _send the given message(optional) and end the rpc stream_

## client.make(name, {payload}, [callback])
```javascript

client.make('say-hello', {
  times: 3
}, (data) => {
  console.log(data) // Hello Johan Olsson!!!
                    // Hello Johan Olsson!!!
                    // Hello Johan Olsson!!!
})

```

## client.subscribe(name, [handler])
```javascript

client.subscribe('say', (event) => {
  console.log(`${event.user.name} said ${event.data.message}`) // Johan Olsson said Hi!!!
})

```

## client.emit(name, {payload})
```javascript

client.emit('say', {
  message: 'Hi!!!'
})

```
