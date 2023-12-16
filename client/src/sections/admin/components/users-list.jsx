import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Modal,
    Typography,
} from '@mui/material';
import { axiosInstance } from 'src/utils/axiosInstance'; // Adjust the import based on your project structure
import { DisplayRequests } from 'src/sections/upload/displayRequests';

const UsersTable = () => {
    const modalStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        maxWidth: '1100px',
        margin: 'auto',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/users'); // Adjust the API endpoint
            console.log("7887878787878787878", response)
            setUsers(response.data.result);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleView = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axiosInstance.delete(`/users/${userId}`); // Adjust the API endpoint
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleView(user)}>View</Button>
                                    <Button onClick={() => handleDelete(user._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* User Details Modal */}
            <Modal open={isModalOpen} onClose={handleCloseModal}
                style={modalStyle}
                aria-labelledby="display-requests-modal"
                aria-describedby="display-requests-modal-description"
            >
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', margin: 'auto', padding: '10px' }}>
                    {selectedUser && (
                        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                            <div>
                                <Typography variant="body1">
                                    <strong>Username:</strong> {selectedUser.username}
                                    <br />
                                    <strong>Name:</strong> {selectedUser.name}
                                    <br />
                                    <strong>Hospital:</strong> {selectedUser.hospital}
                                    <br />
                                    <strong>Specialty:</strong> {selectedUser.specialty}
                                    <br />
                                    <strong>Gender:</strong> {selectedUser.gender}
                                    <br />
                                    <strong>Role:</strong> {selectedUser.role}
                                    <br />
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="body1">
                                    <strong>Phone:</strong> {selectedUser.phone}
                                    <br />
                                    <strong>Email:</strong> {selectedUser.email}
                                    <br />
                                    <strong>Status:</strong> {selectedUser.status}
                                    <br />
                                    <strong>Contract Accepted:</strong> {selectedUser.isContractAccepted ? 'Yes' : 'No'}
                                    <br />
                                    <strong>Birth Date:</strong> {new Date(selectedUser.birthDate).toLocaleDateString()}
                                    <br />
                                    <strong>Education Background:</strong> {selectedUser.educationBackground}
                                </Typography>
                            </div>


                            {selectedUser.role && (selectedUser.role.toLowerCase() === 'doctor' || selectedUser.role.toLowerCase() === 'pharmacist') ? (

                                <div style={{ padding: '20px' }}>
                                    <DisplayRequests doctorID={selectedUser._id} />
                                </div>

                            ) : null}
                        </div>

                    )}
                    <Button onClick={handleCloseModal} style={{ marginTop: '20px' }}>
                        Close
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default UsersTable;
