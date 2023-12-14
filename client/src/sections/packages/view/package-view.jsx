import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';

import PlanCard from '../plan-view';

import { axiosInstance } from 'src/utils/axiosInstance';
import { useRouter } from 'src/routes/hooks';

export default function PackageView() {
  const router = useRouter();

  const {
    isLoading: isLoadingPackages,
    error,
    data: userPackages
  } = useQuery('packages', () => axiosInstance.get('/packages').then((res) => res.data.result), {
    refetchOnWindowFocus: false
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedPackage, setPackage] = useState({});
  const [family, setFamily] = useState([]);
  const [selectedUser, setSelectedUser] = useState({ id: '', name: '' });
  const [alignment, setAlignment] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');

  const user = { _id: localStorage.getItem('userID'), name: localStorage.getItem('userName') };

  const { isLoading, mutate: subscribe } = useMutation(async () => {
    if (!alignment || !selectedUser.id) {
      setMessage('Some fields are not filled correctly');
      return setOpenSnackbar(true);
    }

    try {
      if (alignment === 'Card') {
        const res = await axiosInstance.post(`/payment/session/oneTimePayment`, {
          products: [{ name: selectedPackage.name, price: selectedPackage.price, quantity: 1 }]
        });

        await axiosInstance.post('/me/package', { packageID: selectedPackage._id, patientID: selectedUser.id });

        window.location.href = res.data.url;
      } else {
        await axiosInstance.put(`/me/wallet`, {
          amount: -selectedPackage.sessionPrice
        });

        await axiosInstance.post('/me/package', { packageID: selectedPackage._id, patientID: selectedUser.id });

        router.push('/viewPackage');
      }
    } catch (err) {
      setMessage(err.response?.data.message || 'Network error');
      setOpenSnackbar(true);
    }
  });

  if (isLoadingPackages) return 'Loading...';
  if (error) return 'An error has occurred' + error.message;

  const handleClick = async (userPackage) => {
    if (family.length == 0)
      await axiosInstance
        .get(`/me/family`)
        .then((res) => {
          setFamily(res.data.result);
        })
        .catch((err) => console.log(err));

    setOpenModal(true);
    setPackage(userPackage);
  };

  const handleSelectUser = (e, option) => {
    if (option.nationalID) option._id = user._id;
    setSelectedUser({ id: option._id, name: option.name });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;

    setOpenSnackbar(false);
  };

  return (
    <>
      <Container maxWidth="md">
        <Stack spacing={3} alignItems="center">
          <div style={{ width: '100%' }}>
            <Grid container spacing={3} pt={4}>
              {userPackages.map((plan, i) => (
                <Grid item xs={12} sm={4} md={4} key={i}>
                  <PlanCard plan={plan} handleClick={handleClick} />
                </Grid>
              ))}
            </Grid>
          </div>
        </Stack>

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Pay & Subscribe</DialogTitle>
          <DialogContent>
            <Stack alignItems="center" justifyContent="center">
              <DialogContentText>
                To subscribe to this package, please Choose for whom you want to subscribe and how to pay.
              </DialogContentText>

              <TextField
                select
                label="Select a user"
                helperText="Please select yourself or a family member"
                sx={{ my: 3 }}
                required
              >
                <MenuItem key={user.id} value={'Me'} onClick={(e) => handleSelectUser(e, user)} sx={{ fontSize: 16 }}>
                  Me
                </MenuItem>
                <Divider sx={{ fontSize: 15 }}>Family</Divider>
                {family.map((option) => (
                  <MenuItem
                    key={option._id || option.nationalID}
                    value={option.name}
                    onClick={(e) => handleSelectUser(e, option)}
                    sx={{ fontSize: 16 }}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant="h6" sx={{ my: 1 }}>
                Pay With:
              </Typography>
              <ToggleButtonGroup
                onChange={(event, newAlignment) => setAlignment(newAlignment)}
                value={alignment}
                exclusive
                aria-label="text alignment"
              >
                <ToggleButton value="Wallet" aria-label="left aligned">
                  Wallet
                </ToggleButton>
                <ToggleButton value="Card" aria-label="centered">
                  Credit Card
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <LoadingButton onClick={subscribe} loading={isLoading} loadingIndicator="Loading…">
              Subscribe
            </LoadingButton>
          </DialogActions>

          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackBar}
            message={message}
          />
        </Dialog>
      </Container>
    </>
  );
}
