var Bacon = require('baconjs')
var socket = require('socket.io-client')('')

var onlineUsers = Bacon.fromEventTarget(socket, 'onlineUsers')
var userMessages = Bacon.fromEventTarget(socket, 'userMessages')

module.exports = {
  onlineUsers,
  userMessages
}

