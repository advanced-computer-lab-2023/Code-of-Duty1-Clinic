import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { axiosInstance } from '../../utils/axiosInstance';

const DoctorContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    if (error) {
      setMessage(error.response?.data?.message || error.message);
      setOpen(true);
    } else if (loading) {
      setMessage('Loading...');
      setOpen(true);
    }
  }, [loading, error]);

  const fetchContracts = () => {
    axiosInstance
      .get('/me/contract')
      .then((response) => {
        setContracts(response.data.result);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleAcceptContract = () => {
    axiosInstance
      .put('/me/contract')
      .then((response) => {
        setMessage(response.data.message);
        setOpen(true);
        fetchContracts();
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Doctor Contract
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>MarkUp Profit</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.doctorID}>
                <TableCell>{contract.status}</TableCell>
                <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{contract.markUpProfit}</TableCell>
                <TableCell>
                  {contract.status === 'Pending' && (
                    <Button variant="contained" color="inherit" onClick={() => handleAcceptContract()}>
                      Accept
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={message}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default DoctorContract;
