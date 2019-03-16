import React, { useState, useEffect } from 'react';
import './App.css';

let socket = new WebSocket('ws://localhost:8080');

function App () {
  let [inputValue, setInputValue] = useState('')
  let [username, setUsername] = useState('alex')
  let [messages, setMessages] = useState([])
  
  useEffect(() => {    
    socket.addEventListener('message', event => {
      let message = JSON.parse(event.data)
      
      if (message.type === 'history') {
        setMessages(message.data)
      }
      
      if (message.type === 'single_message') {
        setMessages(prevMessages => [message.data, ...prevMessages])
      }
    })
  }, [])
  
  return (
    <div className="App">
      <input 
        onChange={event => 
          setUsername(event.target.value)
        } 
        value={username}
      />
      <input 
        onChange={event => {
          setInputValue(event.target.value)
          socket.send(JSON.stringify({
            message: event.target.value,
            username,
          }))
        }}
        value={inputValue}
      />
      <hr />
      {messages.map((msg, i) => 
        <div key={i}>
          <span>{`${new Date(msg.date)}`} - </span>
          <b>{msg.username}: </b>
          <span>{msg.message}</span>
        </div>
      )}
    </div>
  );
}
    
export default App;
