var React = require('react')
var {userDidSendMessage} = require('../../js/events/userEvents')
var sortBy = require('lodash/collection/sortBy')

var User = React.createClass({
  getInitialState: function() {
    return {}
  },
  sendMessage: function(evt) {
    evt.preventDefault()
    if (this.state.messageToUser) {
      userDidSendMessage(this.props.userName, this.state.messageToUser)
      this.setState({messageToUser: undefined})
    }
  },
  render: function() {
    return (
      <div>
        <div>{this.props.userName}</div>
        <ul>
        {
          sortBy(this.props.messages, ({timestamp}) => timestamp)
            .map(({fromUser, message}, index) => <li key={index}>{fromUser}: {message}</li>)
        }
        </ul>
        <form onSubmit={this.sendMessage}>
          <input
            value={this.state.messageToUser}
            onChange={evt => this.setState({messageToUser: evt.target.value})}
            placeholder={`Send message to ${this.props.userName}`} />
        </form>
      </div>
    )
  }
})

var findMessages = (userMessages, userName, anotherUserName) =>
  userMessages.filter(({fromUser, toUser}) =>
    fromUser == userName || fromUser == anotherUserName ||
      toUser == userName || toUser   == anotherUserName
  )

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Online users</h2>
        <ul>
        {
          this.props.otherUsers.map((otherUserName, index) =>
            <li key={index}>
              <User
                userName={otherUserName}
                messages={findMessages(this.props.userMessages, this.props.userName, otherUserName)}/>
            </li>
          )
        }
        </ul>
      </div>
    )
  }
})