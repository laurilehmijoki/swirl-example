var Bacon = require('baconjs')
var socket = require('socket.io-client')()

var userNameBus = new Bacon.Bus()
userNameBus.onValue(userName => socket.emit('userDidEnterName', userName))

var userMessagesBus = new Bacon.Bus()
userMessagesBus.combine(
  userNameBus,
  ({toUser, message}, fromUser) => ({ fromUser, toUser, message })
).onValue(
  ({ fromUser, toUser, message }) => socket.emit(
    'userDidSendMessage',
    {fromUser, toUser, message, timestamp: new Date()}
  )
)

module.exports = {
  userDidEnterName: userName => userNameBus.push(userName),
  userDidSendMessage: (toUser, message) => userMessagesBus.push({toUser, message}),
  userNameProperty: userNameBus.toProperty()
}