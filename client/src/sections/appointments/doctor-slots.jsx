import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';

import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { axiosInstance } from '../../utils/axiosInstance';

export default function DoctorSlots({
  _id,
  weekSlots,
  setOpenSnackbar,
  setMessage,
  openModal,
  setOpenModal,
  functionlity
}) {
  const [selectedSlot, setSelectedSlot] = useState({});

  const { isLoading: isLoadingSchedule, mutate: scheduleFollowUp } = useMutation(async () =>
    axiosInstance
      .post(`me/appointments/${_id}`, {
        startDate: selectedSlot.startDate,
        endDate: selectedSlot.endDate,
        sessionPrice: 0,
        isFollowUp: true
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        setMessage(err.response.data.message ?? 'Network Error');
        setOpenSnackbar(true);
      })
  );

  const { isLoading: isLoadingReschedule, mutate: rescheduleAppointment } = useMutation(async () =>
    axiosInstance
      .put(`me/appointments/${_id}/reschedule`, {
        startDate: selectedSlot.startDate,
        endDate: selectedSlot.endDate,
        sessionPrice: selectedSlot.sessionPrice
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        setMessage(err.response.data.message ?? 'Network Error');
        setOpenSnackbar(true);
      })
  );

  const handleClick = (event, slot) => {
    setSelectedSlot(slot);

    const clickedButton = event.currentTarget;
    clickedButton.style.backgroundColor = 'DodgerBlue';
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;

    setOpenSnackbar(false);
  };

  return (
    <Dialog open={openModal} onClose={() => setOpenModal(false)}>
      <DialogTitle>{functionlity}</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <DialogContentText>To {functionlity} this appointment, please choose an available slot.</DialogContentText>

          <Stack direction={'row'} spacing={1} alignItems="center" justifyContent="center" sx={{ width: '800px' }}>
            {Object.keys(weekSlots).map((day) => {
              const slots = weekSlots[day];
              let i = 0;

              return (
                <Stack
                  key={day}
                  sx={{
                    border: 1,
                    borderColor: 'primary.main',
                    height: '200px',
                    overflowY: 'hidden',
                    overflowX: 'hidden',
                    '&:hover': {
                      overflowY: 'auto'
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ mx: 1 }}>
                    {day}
                  </Typography>
                  <Divider sx={{ border: 1, borderColor: 'primary.gray' }}></Divider>

                  <Stack alignItems="center" justifyContent="center" sx={{}}>
                    {slots.map((slot) => {
                      const from = `${new Date(slot.startDate).getUTCHours()}:${new Date(
                        slot.startDate
                      ).getUTCMinutes()}`;
                      const to = `${new Date(slot.endDate).getUTCHours()}:${new Date(slot.endDate).getUTCMinutes()}`;

                      return (
                        <Stack key={i++}>
                          <Button
                            onClick={(event) => handleClick(event, slot)}
                            color="inherit"
                            variant="subtitle2"
                            underline="hover"
                          >
                            {from} - {to}
                          </Button>
                          <Divider></Divider>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
        <LoadingButton
          loadingIndicator="Loading…"
          loading={functionlity == 'Reschedule' ? isLoadingReschedule : isLoadingSchedule}
          disabled={functionlity == 'Reschedule' ? isLoadingReschedule : isLoadingSchedule}
          onClick={functionlity == 'Reschedule' ? rescheduleAppointment : scheduleFollowUp}
        >
          {functionlity}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
