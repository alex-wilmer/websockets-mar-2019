import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      inputValue: '',
      username: 'alex',
      messages: []
    }
  }
  componentDidMount() {
    console.log('do something here, we mounted!')
        // Create WebSocket connection.
    this.socket = new WebSocket('ws://localhost:8080');

    // Connection opened
    this.socket.addEventListener('open', (event) => {
      // this.socket.send('Hello Server!');
    });

    // Listen for messages
    this.socket.addEventListener('message', (event) => {
      let message = JSON.parse(event.data)
      
      if (message.type === 'history') {
        this.setState({ messages: message.data })
      }
      
      if (message.type === 'single_message') {
        this.setState(state => {
          return {
            messages: [message.data, ...state.messages]
          }
        })
      }
    });
  }
  
  render() {
    return (
      <div className="App">
        <input 
          onChange={event => 
            this.setState({ username: event.target.value })
          } 
          value={this.state.username}
        />
        <input 
          onChange={event => {
            this.setState({ inputValue: event.target.value })
            this.socket.send(JSON.stringify({
              message: event.target.value,
              username: this.state.username,
            }))
          }}
          value={this.state.inputValue}
        />
        <hr />
        {this.state.messages.map((msg, i) => 
          <div key={i}>
            <span>{`${new Date(msg.date)}`} - </span>
            <b>{msg.username}: </b>
            <span>{msg.message}</span>
          </div>
        )}
      </div>
    );
  }
}

export default App;
