import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';

import { axiosInstance } from '../../utils/axiosInstance';

export default function DoctorDaySlots({ day, slots, doctorID, doctorName }) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = daysOfWeek[new Date().getDay()];
  if (today == day) day = 'Today';

  const user = { _id: localStorage.getItem('userID'), name: localStorage.getItem('userName') };

  const [openModal, setOpenModal] = useState(false);
  const [slot, setSlot] = useState({});
  const [family, setFamily] = useState([]);
  const [selectedUser, setSelectedUser] = useState({ id: '', name: '' });
  const [alignment, setAlignment] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = async (slot) => {
    if (family.length == 0)
      await axiosInstance
        .get(`/me/family`)
        .then((res) => {
          setFamily(res.data.result);
        })
        .catch((err) => console.log(err));

    setOpenModal(true);
    setSlot(slot);
  };

  const handleSelectUser = (e, option) => {
    if (option.nationalID) option._id = user._id;
    setSelectedUser({ id: option._id, name: option.name });
  };

  const createAppointment = async () => {
    if (slot.startDate < new Date()) {
      setMessage('This appointment is not available anymore');
      return setOpenSnackbar(true);
    }

    return axiosInstance.post(`/doctors/${doctorID}/appointments`, {
      patientID: selectedUser.id,
      patientName: selectedUser.name,
      startDate: slot.startDate,
      endDate: slot.endDate,
      sessionPrice: slot.sessionPrice
    });
  };

  const handleReserve = async () => {
    if (!alignment || !selectedUser.id) {
      setMessage('Some fields are not filled correctly');
      return setOpenSnackbar(true);
    }

    try {
      if (alignment === 'Card') {
        const res = await axiosInstance.post(`/payment/session/oneTimePayment`, {
          products: [
            {
              name: `Appointment with Dr. ${doctorName} on ${new Date(slot.startDate).toString().slice(0, 16)}
              from ${new Date(slot.startDate).toString().slice(16, 31)} to ${new Date(slot.endDate)
                .toString()
                .slice(16, 31)}`,
              price: slot.sessionPrice,
              quantity: 1
            }
          ]
        });

        await createAppointment();

        window.location.href = res.data.url;
      } else {
        await axiosInstance.put(`/me/wallet`, {
          amount: -selectedPackage.sessionPrice
        });

        await createAppointment();

        window.location.reload();
      }
    } catch (err) {
      setMessage(err.response?.data.message || 'Network error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;

    setOpenSnackbar(false);
  };

  let i = 0;
  return (
    <>
      <Stack
        key={day}
        alignItems="center"
        justifyContent="center"
        sx={{
          border: 1,
          // borderColor: 'primary.main',
          height: '170px',
          width: '8em'
        }}
      >
        <Typography variant="h5" sx={{ mx: 1 }}>
          {day}
        </Typography>
        <Divider sx={{ border: 1, borderColor: 'primary.gray' }}></Divider>

        <Stack
          sx={{
            border: 1,
            borderColor: 'primary.gray',
            height: '180px',
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'primary.light'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent'
            }
          }}
        >
          {slots.map((slot) => {
            // const from = `${new Date(slot.startDate).getUTCHours()}:${new Date(slot.startDate).getUTCMinutes()}`;
            // const to = `${new Date(slot.endDate).getUTCHours()}:${new Date(slot.endDate).getUTCMinutes()}`;
            const startDate = new Date(slot.startDate);
            const endDate = new Date(slot.endDate);
            startDate.setHours(startDate.getHours() - 2);
            endDate.setHours(endDate.getHours() - 2);
            const from = startDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            const to = endDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

            return (
              <Stack key={i++}>
                <Button
                  onClick={() => handleClick(slot)}
                  color="inherit"
                  underline="hover"
                  variant="subtitle2"
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {`${from}\n- ${to}`}
                </Button>
                <Divider></Divider>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Book and Pay</DialogTitle>
        <DialogContent>
          <Stack alignItems="center" justifyContent="center">
            <DialogContentText sx={{ mt: 1 }}>
              To book this appointment, please choose for whom you want to book.
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

            <Typography variant="h6">Pay With:</Typography>
            <ToggleButtonGroup
              onChange={(event, newAlignment) => setAlignment(newAlignment)}
              value={alignment}
              exclusive
            >
              <ToggleButton value="Wallet" aria-label="left aligned">
                Wallet
              </ToggleButton>
              <ToggleButton value="Card" aria-label="centered">
                Credit Card
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="h6" color={'green'} sx={{ mt: 5 }}>
              Total Price: {slot.sessionPrice} USD
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleReserve}>Book</Button>
        </DialogActions>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackBar}
          message={message}
        />
      </Dialog>
    </>
  );
}
