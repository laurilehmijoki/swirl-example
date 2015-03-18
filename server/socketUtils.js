var Bacon = require('baconjs')

var POSSIBLE_EVENT_TYPES = [
  'userDidEnterName',
  'userDidSendMessage'
]

module.exports = function(http) {
  var io = require('socket.io')(http)

  var incomingSockets = Bacon.fromBinder(function(sink) {
    io.on('connection', function(socket) {
      sink(socket)
    })
  })

  var listenToSocket = (socket, eventType) =>
    Bacon.fromBinder(function (sink) {
      socket.on(eventType, function (socketData) {
        sink({eventType, socket, socketData})
      })
      socket.on('disconnect', function () {
        sink(new Bacon.End())
      })
    })

  var allEvents = incomingSockets.flatMap(socket =>
    Bacon.mergeAll(POSSIBLE_EVENT_TYPES.map(
      eventType => listenToSocket(socket, eventType))
    )
  )

  var disconnectingSockets = incomingSockets.flatMap(socket =>
      Bacon.fromBinder(function(sink) {
        socket.on('disconnect', function() {
          sink(socket)
        })
      })
  )

  var clientEvents = targetEventType => {
    if (POSSIBLE_EVENT_TYPES.indexOf(targetEventType) < 0) {
      console.warn(`The socket event ${targetEventType} is not a supported event type. Try adding it into the list of possible event types.`)
    }
    return allEvents
      .filter(({eventType}) => targetEventType == eventType )
      .flatMap(({socket, socketData}) => Bacon.once({ socket, socketData }))
  }

  return {
    clientEvents,
    disconnectingSockets,
    io
  }
}