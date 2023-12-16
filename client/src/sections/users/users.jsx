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
  MenuItem,
  Modal
} from '@mui/material';
import { axiosInstance } from 'src/utils/axiosInstance';
import { DisplayRequests } from '../upload/displayRequests';
import Typography from '@mui/material/Typography';

const ReqTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDisplayRequestsModalOpen, setIsDisplayRequestsModalOpen] = useState(false);
  const url = `requests`;

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(url);
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
      await axiosInstance.put('requests/reject', { email });
      fetchUsers();
    } catch (error) {
      console.error('Error in rejecting request', error);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsDisplayRequestsModalOpen(true);
  };

  const handleCloseDisplayRequestsModal = () => {
    setIsDisplayRequestsModalOpen(false);
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

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    maxWidth: '1100px',
    margin: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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

      {/* DisplayRequests Modal */}
      <Modal
        style={modalStyle}
        open={isDisplayRequestsModalOpen}
        onClose={handleCloseDisplayRequestsModal}
        aria-labelledby="display-requests-modal"
        aria-describedby="display-requests-modal-description"
      >
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          {selectedUser && (
            <div style={{ padding: '20px' }}>
              <Typography variant="h6" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
                User Details
              </Typography>
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
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
              </div>
            </div>
          )}

          {selectedUser && <div style={{ padding: '20px' }}>
            <DisplayRequests doctorID={selectedUser._id} />
          </div>}
        </div>
      </Modal>
    </>
  );
};

export default ReqTable;
