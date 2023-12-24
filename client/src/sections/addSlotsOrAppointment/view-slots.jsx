import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useQuery, useMutation } from 'react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { axiosInstance } from '../../utils/axiosInstance';

export default function ViewSlots() {
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const {
    isLoading,
    error,
    data: weeklySlots
  } = useQuery(`mySlots`, () => axiosInstance.get(`/me/weeklySlots`).then((res) => res.data.result), {
    refetchOnWindowFocus: false
  });
  if (isLoading) return <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />;
  if (error) {
    // setOpenSnackbar(true);
    // setMessage(error.response?.data.message || 'Network error');
    return <div>Something went wrong ...</div>;
  }
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const daySlots = (slots, day) => {
    return (
      <Box sx={{ border: 1, borderColor: 'primary.main' }}>
        <Typography variant="h5" sx={{ mx: 1 }}>
          {day}
        </Typography>
        <Divider sx={{ border: 1, borderColor: 'primary.gray' }}></Divider>

        <Stack
          key={day}
          sx={{
            border: 1,
            borderColor: 'primary.main',
            height: '150px',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&:hover': {
              overflowY: 'auto'
            }
          }}
        >
          {slots.map((slot) => {
            const from = `${slot.from.hours}:${slot.from.minutes}`;
            const to = `${slot.to.hours}:${slot.to.minutes}`;

            return (
              <Stack key={slot.id}>
                <Button color="inherit" underline="hover" variant="subtitle2">
                  {from} - {to}
                </Button>
                <Divider></Divider>
              </Stack>
            );
          })}
        </Stack>
      </Box>
    );
  };

  const handleCloseSnackBar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Stack direction={'row'} spacing={1} alignItems="center" justifyContent="center" sx={{ width: '900px' }}>
      {weeklySlots && days.map((day) => daySlots(weeklySlots[day], day))}

      {/* <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={message}
      /> */}
    </Stack>
  );
}
