var React = require('react')
var Bacon = require('baconjs')
var {userNameProperty} = require('./events/userEvents')
var {onlineUsers, userMessages} = require('./events/serverEvents')

var applicationStateStream = Bacon.combineTemplate({
  userStatus: userNameProperty.map('USER_HAS_GIVEN_NAME').startWith('WAITING_FOR_USERNAME'),
  userName: userNameProperty.startWith(undefined),
  otherUsers: onlineUsers.combine(userNameProperty.startWith(undefined), (onlineUsers, myUserName) =>
    onlineUsers.filter(userName => userName != myUserName)
  ).startWith([]),
  userMessages: userMessages.startWith([])
}).log()

var App = React.createClass({
  getInitialState: function() { return {} },
  componentDidMount: function() {
    this.props.applicationStateStream.onValue(state => this.setState({applicationState: state}))
  },
  render: function() {
    var {applicationState} = this.state
    if (applicationState) {
      var {userStatus, otherUsers, userMessages, userName} = applicationState
      switch (userStatus) {
        case 'WAITING_FOR_USERNAME':
          var UserNameInput = require('../components/userNameInput/userNameInput')
          return <UserNameInput/>
        case 'USER_HAS_GIVEN_NAME':
          var ChatRoom = require('../components/chatRoom/chatRoom')
          return <ChatRoom otherUsers={otherUsers} userName={userName} userMessages={userMessages}/>
        default:
          return <div>Ok</div>
      }
    } else {
      return <div>Loading...</div>
    }
  }
})

document.addEventListener('DOMContentLoaded', function() {
  React.render(<App applicationStateStream={applicationStateStream}/>, document.getElementById('app'))
})
