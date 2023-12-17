import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'react-query';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import LoadingButton from '@mui/lab/LoadingButton';

import axios from 'axios';

const AddressForm = () => {
  // State to store the user's address
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    isLoading: isLoadingData,
    error,
    data: addresses,
    refetch
  } = useQuery(
    `Addresses`,
    (res) =>
      axios
        .get('http://localhost:3000/me/info', {
          withCredentials: true
        })
        .then((res) => res.data.result[0].addresses),
    {
      refetchOnWindowFocus: false
    }
  );

  const { isLoading: isLoadingMutate, mutate: handleSubmit } = useMutation(async (e) => {
    e.preventDefault();
    try {
      // You can perform actions with the address data here
      const res = await axios.post('http://localhost:3000/me/addNewAddress', { address }, { withCredentials: true });

      setMessage(res.response?.data.message || 'Success');
      setOpenSnackbar(true);

      setAddress('');
      await refetch();
    } catch (err) {
      setMessage(err.response?.data.message || 'Network error');
      setOpenSnackbar(true);
    }
  });

  if (isLoadingData) return <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />;
  if (error) return <Typography>An error has occurred: {error.response?.data.message || 'Network error'}</Typography>;

  // Handler to update the address state when the user types
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <Grid container spacing={2}>
      {/* Form */}
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
          <form onSubmit={handleSubmit}>
            <Typography>add new Address</Typography>
            <TextField label="Address" fullWidth value={address} onChange={handleAddressChange} margin="normal" />
            <LoadingButton
              loading={isLoadingMutate}
              loadingIndicator="Loading…"
              disabled={isLoadingMutate}
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              Add address
            </LoadingButton>
          </form>
        </Paper>
      </Grid>

      {/* Display Address */}
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
          <Typography variant="h6" gutterBottom>
            User's Address
          </Typography>
          {/* <Typography>{addresses ? addresses[0] : 'no addresses'}</Typography> */}
          {addresses.map((addrs) => (
            <Typography>{addrs}</Typography>
          ))}
        </Paper>
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={message}
      />
    </Grid>
  );
};

export default AddressForm;
