require('events').EventEmitter.defaultMaxListeners = 5000
var express = require('express')
var compression = require('compression')
var server = express()
var http = require('http').Server(server)
var path = require('path')
var Bacon = require('baconjs')
var {clientEvents, disconnectingSockets, io} = require('./socketUtils')(http)

server.use(compression({threshold: 512}))

server.use(function(req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0')
  next()
})

server.use('/', express.static(path.resolve(__dirname + '/../client')))

var onlineUsers = Bacon.update([],
  [clientEvents('userDidEnterName')], (users, {socket, socketData}) => users.concat({socket, userName: socketData}),
  [disconnectingSockets], (users, disconnectedSocket) => users.filter(({socket}) => socket.id != disconnectedSocket.id)
)

var userMessages = Bacon.update([],
  [clientEvents('userDidSendMessage')], (prevMessages, {socket, socketData}) => prevMessages.concat(socketData)
)

onlineUsers.onValue(function(users) {
  var userNames = users.map(({userName}) => userName)
  io.emit('onlineUsers', userNames)
})

userMessages.sampledBy(userMessages.changes().merge(onlineUsers.changes())).onValue(function(messages) {
  io.emit('userMessages', messages)
})

module.exports = {
  startServer: function() {
    var httpPort = 3000
    http.listen(httpPort, () => console.log(`Started server at http://localhost:${httpPort}`))
  }
}
