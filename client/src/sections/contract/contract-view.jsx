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

import { axiosInstance } from '../../utils/axiosInstance';

const DoctorContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = () => {
    axiosInstance.get('/me/contract')
      .then(response => {
        setContracts(response.data.result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching contract data:', error);
        setError(error);
        setLoading(false);
      });
  };

  const handleAcceptContract = () => {
    axiosInstance.put('/me/contract')
      .then(response => {
        fetchContracts();
      })
      .catch(error => {
        console.error('Error accepting contract:', error);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading contracts: {error.message}</p>;

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
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell>{contract.markUpProfit}</TableCell>
                <TableCell>
                  {contract.status === 'Pending' && (
                    <Button 
                      variant="contained" 
                      color="inherit" 
                      onClick={() => handleAcceptContract()}
                    >
                      Accept
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DoctorContract;
