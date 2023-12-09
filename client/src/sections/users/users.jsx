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
  Select,
  MenuItem
} from '@mui/material';
import { axiosInstance } from 'src/utils/axiosInstance';
import DetailedViewModal from './DetailedViewModal';

const ReqTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const url = `requests`;

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(url);
      // Assuming each request has a 'medicID' object with 'username' and 'email'
      setUsers(response.data.result.map((req) => ({ ...req.medicID, status: req.status })));
      setFilteredUsers(response.data.result.map((req) => ({ ...req.medicID, status: req.status })));
    } catch (error) {
      console.error('Error in getting requests', error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAccept = async (email) => {
    try {
      await axiosInstance.put('requests/accept', { email });
      fetchUsers();
    } catch (error) {
      console.error('Error in accepting request', error);
    }
  };

  const handleReject = async (email) => {
    try {
      console.log(email);
      await axiosInstance.put('requests/reject', { email });
      fetchUsers();
    } catch (error) {
      console.error('Error in rejecting request', error);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filterUsers = (status) => {
    if (status === 'all') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => user.status.toString().toLowerCase() === status.toString().toLowerCase());
      setFilteredUsers(filtered);
    }
  };

  const handleStatusFilterChange = (event) => {
    filterUsers(event.target.value);
  };

  return (
    <>
      <Select defaultValue="all" onChange={handleStatusFilterChange}>
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="accepted">Approved</MenuItem>
        <MenuItem value="rejected">Rejected</MenuItem>
      </Select>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.username} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell align="right">{user.status}</TableCell>
                <TableCell align="right">
                  {user.status === 'Pending' && <Button onClick={() => handleAccept(user.email)}>Accept</Button>}
                  {user.status === 'Pending' && <Button onClick={() => handleReject(user.email)}>Reject</Button>}
                  <Button onClick={() => handleView(user)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {<DetailedViewModal user={selectedUser} open={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default ReqTable;
