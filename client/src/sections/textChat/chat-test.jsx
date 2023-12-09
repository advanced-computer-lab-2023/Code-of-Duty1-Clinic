import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [secondPerson, setSecondPerson] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    // Connect to the socket.io server
    const socketInstance = io('http://localhost:3000/chat/doctor/patient', {
      withCredentials: true
    }); // Replace with your actual backend URL
    setSocket(socketInstance);

    return () => {
      // Disconnect the socket when the component unmounts
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Set up socket event listeners
      socket.on('connect', () => {
        console.log('Connected to the socket server');
      });

      socket.on('chatMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('getMessages', (fetchedMessages) => {
        console.log(fetchedMessages, '\n fvnfvnfjvnj');
        setMessages(fetchedMessages.messages);
      });
    }
  }, [socket]);

  const joinRoom = () => {
    console.log('in room before ', socket);
    if (socket && secondPerson) {
      socket.emit('joinRoom', { toID: secondPerson });
      console.log('in room after ');
    }
  };

  const leaveRoom = () => {
    if (socket && secondPerson) {
      socket.emit('leaveRoom', { toID: secondPerson });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && secondPerson && currentMessage) {
      socket.emit('chatMessage', { toID: secondPerson, message: currentMessage });
      setCurrentMessage('');
    }
  };

  const getMessages = () => {
    if (socket && secondPerson) {
      socket.emit('getMessages', { toID: secondPerson });
    }
  };

  return (
    <div>
      <div>
        <label>
          Your Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Second Person's Username:
          <input type="text" value={secondPerson} onChange={(e) => setSecondPerson(e.target.value)} />
        </label>
        <button onClick={joinRoom}>Join Room</button>
        <button onClick={leaveRoom}>Leave Room</button>
        <button onClick={getMessages}>Get Messages</button>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.content}</li>
          ))}
        </ul>
      </div>
      <div>
        <label>
          Your Message:
          <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} />
        </label>
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default ChatComponent;
