var React = require('react')
var {userDidEnterName} = require('../../js/events/userEvents')

module.exports = React.createClass({
  handleFormSubmit: function (evt) {
    evt.preventDefault()
    userDidEnterName(this.refs.username.getDOMNode().value)
  },
  render: function() {
    return (
      <div>
        <h1>Welcome!</h1>
        <p>Start by entering your name</p>
        <form onSubmit={this.handleFormSubmit}>
          <input type="text" ref="username" placeholder="Name" />
          <button type="submit">Start chat</button>
        </form>
      </div>
    )
  }
})