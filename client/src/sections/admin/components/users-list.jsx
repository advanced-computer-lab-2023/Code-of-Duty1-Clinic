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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { axiosInstance } from 'src/utils/axiosInstance';
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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tempUsers, setTempUsers] = useState([]);
    const [searchField, setSearchField] = useState('name');
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/users');
            console.log("7887878787878787878", response)
            setUsers(response.data.result);
            setTempUsers(response.data.result);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    useEffect(() => {
        if (searchQuery) {
            let filteredUsers = tempUsers.filter((user) =>
                user[searchField].toLowerCase().includes(searchQuery.toLowerCase())
            );
            setUsers(filteredUsers);
        } else {
            setUsers(tempUsers);
        }
    }, [searchQuery, searchField]);
    const handleView = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (userId) => {
        const userToDelete = users.find((user) => user._id === userId);
        setSelectedUser(userToDelete);
        setIsDeleteDialogOpen(true);
    };
    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/users/${selectedUser._id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user', error);
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
        }
    };


    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };
    const handleCloseDeleteDialog = () => {
        setSelectedUser(null);
        setIsDeleteDialogOpen(false);
    };


    return (
        <>
            <FormControl variant="outlined" style={{ margin: '10px' }}>
                <InputLabel id="search-field-label">Search Field</InputLabel>
                <Select
                    labelId="search-field-label"
                    id="search-field"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    label="Search Field"
                >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="username">Username</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                </Select>
            </FormControl>

            <TextField
                label={`Search by ${searchField}`}
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ margin: '10px' }}
            />
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
                <div style={{
                    backgroundColor: '#fff', borderRadius: '8px', margin: 'auto', padding: '15px', border: '1px solid black', alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <h2>User Details</h2>


                    {selectedUser && (
                        <><div style={{
                            display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Typography variant="body1">
                                    <strong>Username:</strong> {selectedUser.username}
                                    <br />
                                    <strong>Name:</strong> {selectedUser.name}
                                    <br />
                                    <strong>Email:</strong> {selectedUser.email}
                                    <br />
                                    <strong>Phone:</strong> {selectedUser.phone}
                                    <br />

                                </Typography>
                            </div>
                            <div style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Typography variant="body1">

                                    {selectedUser.role !== 'Admin' && (
                                        <>
                                            <strong>Gender:</strong> {selectedUser.gender}
                                            <br />
                                            <strong>Birth Date:</strong> {new Date(selectedUser.birthDate).toLocaleDateString()}
                                            <br />
                                        </>
                                    )}
                                    <strong>Role:</strong> {selectedUser.role}
                                    <br />
                                </Typography>
                            </div>
                            {(selectedUser.role == 'Doctor' || selectedUser.role == 'Pharmacist') && <div>
                                <Typography variant="body1">


                                    <strong>Contract Accepted:</strong> {selectedUser.isContractAccepted ? 'Yes' : 'No'}
                                    <br />

                                    <strong>Education Background:</strong> {selectedUser.educationBackground}
                                    <br />
                                    <strong>Hospital:</strong> {selectedUser.hospital}
                                    <br />
                                    {selectedUser.role != 'Pharmacist' &&
                                        (<>
                                            <strong>Specialty:</strong> {selectedUser.specialty}
                                            <br />
                                        </>)
                                    }
                                </Typography>
                            </div>}
                        </div><div>
                                {selectedUser.role && (selectedUser.role.toLowerCase() === 'doctor' || selectedUser.role.toLowerCase() === 'pharmacist') ? (

                                    <div style={{
                                        padding: '50px', alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <DisplayRequests doctorID={selectedUser._id} />
                                    </div>

                                ) : null}
                            </div></>


                    )}
                    <Button onClick={handleCloseModal} style={{ marginTop: '20px' }}>
                        Close
                    </Button>
                </div>
            </Modal>
            <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the user:
                        <br />
                        <strong>Name:</strong> {selectedUser?.name}
                        <br />
                        <strong>Email:</strong> {selectedUser?.email}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="primary">
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default UsersTable;
