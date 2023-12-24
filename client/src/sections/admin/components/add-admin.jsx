import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';

import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { TextField, Button, Paper, Typography, Container, FormHelperText } from '@mui/material';

import { axiosInstance } from 'src/utils/axiosInstance';

const AddAdminForm = () => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false); // New state variable for name touched
  const [username, setUsername] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false); // New state variable for username touched
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false); // New state variable for password touched
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false); // New state variable for email touched
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [feedBack, setFeedBack] = useState('');
  const [color, setColor] = useState('green');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { isLoading: isLoadingMutate, mutate: handleAddAdmin } = useMutation(async () => {
    setFeedBack('');
    setNameTouched(true);
    setUsernameTouched(true);
    setPasswordTouched(true);
    setEmailTouched(true);
    setPhoneTouched(true);
    if (!name || !username || !password || !email || !phone) return;
    if (!emailRegex.test(email)) {
      setFeedBack('Invalid email format');
      setColor('red');
      return;
    }

    console.log('Adding admin:', { name, username, password, email, phone });

    try {
      let response = await axiosInstance.post('/users', { name, username, password, email, phone });
      console.log(response);
      if (response && response.status == 200) {
        setFeedBack('Admin added successfully');
        setColor('green');
      } else {
        setFeedBack(response.data?.message | 'Error adding admin');
        setColor('red');
      }
    } catch (error) {
      setMessage(error.response?.data.message || 'Network error');
      setOpenSnackbar(true);
    }
  });

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;

    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h5" gutterBottom>
          Add New Admin
        </Typography>
        <Typography variant="body1" gutterBottom color={color}>
          {feedBack}
        </Typography>
        <form>
          <TextField
            label="Name *"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameTouched(true);
            }}
            onBlur={() => setNameTouched(true)}
          />
          {nameTouched && !name && <FormHelperText error>Required</FormHelperText>}
          <TextField
            label="Username *"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameTouched(true);
            }}
            onBlur={() => setUsernameTouched(true)}
          />
          {usernameTouched && !username && <FormHelperText error>Required</FormHelperText>}
          <TextField
            label="Password *"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordTouched(true);
            }}
            onBlur={() => setPasswordTouched(true)}
          />
          {passwordTouched && !password && <FormHelperText error>Required</FormHelperText>}
          <TextField
            label="Email *"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailTouched(true);
            }}
            onBlur={() => setEmailTouched(true)}
          />
          {emailTouched && !email && <FormHelperText error>Required</FormHelperText>}

          <TextField
            label="Phone *"
            fullWidth
            margin="normal"
            variant="outlined"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneTouched(true);
            }}
            onBlur={() => setPhoneTouched(true)}
          />
          {phoneTouched && !phone && <FormHelperText error>Required</FormHelperText>}
          <LoadingButton
            loading={isLoadingMutate}
            loadingIndicator="Loading…"
            disabled={isLoadingMutate}
            variant="contained"
            color="primary"
            onClick={handleAddAdmin}
            style={{ marginTop: '20px' }}
          >
            Add Admin
          </LoadingButton>
        </form>
      </Paper>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={message}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenSnackbar(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default AddAdminForm;
