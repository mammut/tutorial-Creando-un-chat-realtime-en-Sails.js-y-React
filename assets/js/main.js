/** @jsx React.DOM */

var ChatBox = React.createClass({
  getInitialState: function() {
    return {messages: []};
  },
  componentDidMount: function() {
    io.socket.on('connect', function() {

      io.socket.get(this.props.apiUrl, function(messages) {
        this.setState({messages: messages});
      }.bind(this));

      io.socket.on('new message', function(newMessage) {
        this.setState({messages: this.state.messages.concat([newMessage])});
      }.bind(this));

    }.bind(this));
  },
  handleNewMessage: function (newMessage) {
    io.socket.post(this.props.apiUrl, newMessage);
  },
  render: function() {
    return (
      <div className="ChatBox">
        <h2>Lista de mensajes</h2>
        <ChatList messages={this.state.messages} />
        <ChatForm onNewMessage={this.handleNewMessage} />
      </div>
    );
  }
});

var ChatForm = React.createClass({
  handleNewMessage: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value;
    var text = this.refs.text.getDOMNode().value;

    this.props.onNewMessage({author: author, text: text});

    this.refs.text.getDOMNode().value = '';
  },
  render: function() {
    return (
      <form className="ChatForm" onSubmit={this.handleNewMessage}>
        <input type="text" placeholder="author" className="author" ref="author"/>
        <input type="text" placeholder="message..." className="text" ref="text" />
        <input type="submit" value="Send" />
      </form>
    );
  }
});

var ChatList = React.createClass({
  render: function() {
    var messages = this.props.messages.map(function (message, index) {
      return (<ChatMessage
                author={message.author}
                text={message.text}
                key={index}/>
             );
    });
    return (
      <ul className="ChatList">
        {messages}
      </ul>
    );
  }
});

var ChatMessage = React.createClass({
  render: function() {
    return (
            <li className="ChatMessage">
              <span className="author">{this.props.author}</span>
              <span className="message">{this.props.text}</span>
            </li>
    );
  }
});

React.render(<ChatBox apiUrl="/message" />, document.getElementById('main'));
