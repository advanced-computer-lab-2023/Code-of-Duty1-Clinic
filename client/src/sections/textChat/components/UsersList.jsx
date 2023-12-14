import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/axiosInstance';
import Chat from './Chat';
import { Typography, List, ListItem, ListItemText, Paper, Box, Divider } from '@mui/material';
import io from 'socket.io-client';

function UsersList({ ioUrl, contactUrl }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessagesCount, setUnseenMessagesCount] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [newSocket, setNewSocket] = useState(null);
    const [oldUsers, setOldUsers] = useState([]);
    const [isSavedOld, setIsSavedOld] = useState(false);
    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleChatClose = () => {
        setSelectedUser(null);
        console.log("in chat close ");
        let otherUsersIDs = users.map((user) => user.userID._id);
        console.log("in chat close ", otherUsersIDs);
        newSocket.emit('unSeenCount', {
            userID: localStorage.getItem('userID'),
            others: otherUsersIDs
        });
    };

    const handleSearchChange = (event) => {
        console.log(event.target.value);
        setSearchQuery((prev) => event.target.value);
    };

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(contactUrl);
            console.log('Response from /chat/users:', response.data);

            const unseenMessagesCounts = await Promise.all(
                response.data.map(async (user) => {
                    const countResponse = await axiosInstance.get(`/chat/room/${user.userID._id}/count`);
                    return { userID: user.userID._id, count: countResponse.data.count };
                })
            );
            const countMap = {};
            unseenMessagesCounts.forEach((item) => {
                countMap[item.userID] = item.count;
            });
            const sortedUsers = response.data.sort((a, b) => {
                const countA = unseenMessagesCount[a.userID._id] || 0;
                const countB = unseenMessagesCount[b.userID._id] || 0;
                return countB - countA;
            });
            setUsers((prev) => sortedUsers);
            // setUsers(response.data);
            setUnseenMessagesCount(countMap);
            console.log('Unseen messages counts:', unseenMessagesCounts);
            console.log('Count map:', countMap);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const updateCountMap = (data) => {
        console.log('in updateCountMap');
        for (const [key, value] of Object.entries(data.countMap)) {
            setUnseenMessagesCount(prevCount => ({ ...prevCount, [key]: value }));
            console.log(`Key: ${key}, Value: ${value}`);
        }
    }

    useEffect(() => {
        const socket = io(ioUrl, {
            withCredentials: true
        });
        setNewSocket(socket);
        socket.on('connect', () => {
            console.log('Connected to the socket server');
        });
        socket.on('unSeenCount', updateCountMap);

        return () => {
            socket.disconnect(); // Disconnect socket when component unmounts
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [contactUrl]);

    useEffect(() => {
        if (searchQuery == '') {
            fetchData();
            return;
        }
        const filteredUsers = users.filter((user) =>
            user.userID.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const sortedUsers = filteredUsers.sort((a, b) => {
            const countA = unseenMessagesCount[a.userID._id] || 0;
            const countB = unseenMessagesCount[b.userID._id] || 0;
            return countB - countA;
        });
        setUsers((prev) => sortedUsers);
    }, [searchQuery]);

    return (
        <Box maxWidth="800px" m="0 auto" p="20px">
            {/* <Typography variant="h4" mb={3} color="primary">
                Your Users
            </Typography> */}
            <Paper elevation={3} sx={{ borderRadius: '8px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{
                        width: '100%',
                        padding: '12px',
                        boxSizing: 'border-box',
                        border: 'none',
                        borderBottom: '1px solid #ccc',
                        fontSize: '16px',
                    }}
                />
            </Paper>
            <Paper elevation={3} sx={{ borderRadius: '8px', backgroundColor: '#f0f0f0', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <List style={{ padding: '0' }}>
                    {users.map((user) => (
                        <React.Fragment key={user.userID._id}>
                            <ListItem
                                style={{
                                    backgroundColor: '#e6f7ff', // Light Blue
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    '&:hover': {
                                        backgroundColor: '#c2e2ff', // Lighter Blue on Hover
                                    },
                                }}
                                onClick={() => handleUserClick(user)}
                            >
                                <img
                                    src={`/assets/contact-image.svg`}
                                    alt={user.userID.name}
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '16px' }}
                                />
                                <ListItemText primary={user.userID.name} />
                                {unseenMessagesCount[user.userID._id] > 0 && (
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                        <div
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: 'red',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px',
                                            }}
                                        >
                                            {unseenMessagesCount[user.userID._id]}
                                        </div>
                                    </div>
                                )}
                            </ListItem>
                            <Divider sx={{ backgroundColor: '#bdbdbd' }} />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
            {selectedUser && (
                <Chat
                    other={selectedUser.userID}
                    onClose={handleChatClose}
                    ioUrl={ioUrl}
                    fetchUrl={`/chat/room/${selectedUser.userID._id}`}
                />
            )}
        </Box>
    );
}

export default UsersList;
