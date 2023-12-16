import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { axiosInstance } from '../../../utils/axiosInstance';
import io from 'socket.io-client';
import { Modal, Paper, Typography, Button, Input, Box } from '@mui/material';

const Chat = ({ other, onClose, ioUrl, fetchUrl }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
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
    const getMessagesToBeUpdated = (messages) => {
        let messagesIDArray = [];
        let messagesFilter = []

        messages.filter((m) => !m.isSeen).forEach((m) => {
            messagesIDArray.push(m._id);
            messagesFilter.push({
                message: m.content,
                title: localStorage.getItem('userName')
            });
        });


        console.log("!@##2222")
        console.log(messagesIDArray);
        let messagesToBeUpdated = {
            messagesIDArray,
            messagesFilter
        }
        return messagesToBeUpdated;
    };
    const fetchMessages = async () => {
        try {
            const response = await axiosInstance.get(fetchUrl);
            setMessageToSeen(getMessagesToBeUpdated(response.data.messages));
            setMessages(response.data.messages.map((m) => ({ ...m, isSeen: true })));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleChatMessage = (message) => {

        console.log("!@##")
        setMessageToSeen(getMessagesToBeUpdated([message]));

        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, message];
            console.log('Before state update:', prevMessages);
            console.log('Updated state:', updatedMessages);
            return updatedMessages;
        });

        console.log('Inside the handle m ', message);
    };
    const setMessageToSeen = (messages) => {
        console.log('in set seeeeeeeeeeen', socket);
        if (socket) {

            socket.emit('setSeen', { messages, toID: other._id });
        }
    }


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


    const initializeSocket = () => {
        const newSocket = io(ioUrl, {
            withCredentials: true
        });
        setSocket((s) => newSocket);

        return () => {
            newSocket.disconnect();
        };
    };

    const handleSocketEvents = () => {
        if (socket) {

            const handleConnect = () => {
                console.log('Connected to the socket server');
                joinRoom();
            };
            socket.on('connect', handleConnect);
            socket.on('chatMessage', handleChatMessage);


            fetchMessages();
            return () => {
                socket.off('connect', handleConnect);
                socket.off('chatMessage', handleChatMessage);
            };
        }
    };

    const scrollToBottom = () => {
        const chatContainer = chatContainerRef.current;

        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };

    useEffect(initializeSocket, [other._id]);
    useEffect(handleSocketEvents, [socket]);
    useEffect(scrollToBottom, [messages]);


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
