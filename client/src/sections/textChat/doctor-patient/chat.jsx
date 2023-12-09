import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { axiosInstance } from '../../../utils/axiosInstance';
import io from 'socket.io-client';
import { Modal, Paper, Typography, Button, Input, Box } from '@mui/material';

const Chat = ({ other, onClose, ioUrl, fetchUrl }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatContainerRef = useRef(null);
  const userId = localStorage.getItem('userId');

  const joinRoom = () => {
    if (socket) {
      socket.emit('joinRoom', { toID: other._id });
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit('leaveRoom', { toID: other._id });
    }
  };

  useEffect(() => {
    const newSocket = io(ioUrl, {
      withCredentials: true
    });
    setSocket(newSocket);

    const fetchMessages = async () => {
      try {
        const role = localStorage.getItem('userRole');
        const response = await axiosInstance.get(fetchUrl);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      newSocket.disconnect();
      // Optionally, unsubscribe from specific socket events here
    };
  }, [other._id]);
  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    const scrollToBottom = () => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };

    scrollToBottom();
  }, [messages, socket, other._id]);

  // useEffect(() => {
  //     console.log("01")
  //     const chatContainer = chatContainerRef.current;

  //     const scrollToBottom = () => {
  //         console.log("017")
  //         console.log(chatContainer, "-- ", chatContainerRef, "018")

  //         if (chatContainer) {
  //             chatContainer.scrollTop = chatContainer.scrollHeight;
  //         }
  //     };

  //     scrollToBottom();
  //     const messagesToSeen = () => {
  //         return messages.filter((m) => m.isSeen == false).map((m) => m._id);
  //     };
  //     setMessages((pre) => {
  //         pre.filter((m) => m.isSeen == false).map((m) => m.isSeen = true);
  //     });
  //     if (socket)
  //         socket.emit('setSeen', { messages: messagesToSeen, toID: other._id });

  // }, [messages]);

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log('Connected to the socket server');
        joinRoom();
      };

      const handleChatMessage = (message) => {
        console.log(message, '97*****');

        if (socket) {
          console.log('in set seeeeeeeeeeen');
          socket.emit('setSeen', {
            messages: [message._id],
            toID: other._id,
            message: message.content,
            title: localStorage.getItem('userName')
          });
        }
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          console.log('Before state update:', prevMessages);
          console.log('Updated state:', updatedMessages);
          return updatedMessages;
        });

        console.log('Inside the handle m ', message);
      };
      // const handleSetSeen = (){

      // }

      socket.on('connect', handleConnect);
      socket.on('chatMessage', handleChatMessage);
      // socket.on('setSeen', handleSetSeen);
      return () => {
        socket.off('connect', handleConnect);
        socket.off('chatMessage', handleChatMessage);
      };
    }
  }, [socket]);

  const handleSend = () => {
    console.log('Message length:', newMessage.trim().length);
    try {
      if (newMessage.trim().length > 0) {
        console.log('Sending message:', newMessage);
        const updatedMessages = [...messages, { content: newMessage, sender: userId }];
        setMessages(updatedMessages);
        socket.emit('chatMessage', { toID: other._id, content: newMessage });
        setNewMessage('');
      } else {
        console.log('Message is empty. Not sending.');
      }
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const getMessageStyle = (sender) => ({
    marginBottom: '5px',
    padding: '5px',
    borderRadius: '3px',
    backgroundColor: sender === userId ? '#e1f5fe' : '#f5f5f5',
    border: '1px solid #ccc',
    textAlign: sender === userId ? 'right' : 'left',
    wordWrap: 'break-word'
  });

  return (
    <Modal
      open={true}
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '999',
        background: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <Paper
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '600px',
          width: '80%',
          padding: '20px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2" sx={{ margin: '0' }}>
            Chat with {other.name}
          </Typography>
          <Button
            onClick={onClose}
            sx={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', background: '#ddd', border: 'none' }}
          >
            Close
          </Button>
        </Box>
        <Box sx={{ maxHeight: '200px', overflowY: 'auto' }} ref={chatContainerRef}>
          {messages.map((message, index) => (
            <Box key={index} sx={getMessageStyle(message.sender)}>
              {message.content}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ flex: '1', padding: '5px' }}
          />
          <Button
            onClick={handleSend}
            sx={{ marginLeft: '10px', cursor: 'pointer', padding: '5px', borderRadius: '3px' }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default Chat;
