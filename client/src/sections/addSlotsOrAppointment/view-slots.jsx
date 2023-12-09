import { useState } from 'react';
import { useQuery } from 'react-query';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { axiosInstance } from '../../utils/axiosInstance';

export default function ViewSlots() {
  const {
    isLoading,
    error,
    data: weeklySlots
  } = useQuery(`mySlots`, () => axiosInstance.get(`/me/weeklySlots`).then((res) => res.data.result), {
    refetchOnWindowFocus: false
  });

  if (isLoading) return null;

  if (error) return 'An error has occurred';

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

            let i = 0;
            return (
              <Stack key={i++}>
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

  return (
    <Stack direction={'row'} spacing={1} alignItems="center" justifyContent="center" sx={{ width: '900px' }}>
      {days.map((day) => daySlots(weeklySlots[day], day))}
    </Stack>
  );
}
