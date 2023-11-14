import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';

import { axiosInstance } from '../../utils/axiosInstance';

export default function DoctorDaySlots({ day, slots, doctorID }) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = daysOfWeek[new Date().getDay()];

  if (today == day) day = 'Today';

  const reserveSlot = (slot) => {
    axiosInstance
      .post(`/doctors/${doctorID}/appointments`, {
        startDate: slot.startDate,
        endDate: slot.endDate,
        sessionPrice: slot.sessionPrice
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box sx={{ border: 1, borderColor: 'primary.main' }}>
      <Typography variant="h5" sx={{ mx: 1 }}>
        {day}
      </Typography>
      <Divider sx={{ border: 1, borderColor: 'primary.gray' }}></Divider>

      <Stack alignItems="center" justifyContent="center" sx={{}}>
        {slots.map((slot) => {
          const startDate = new Date(slot.startDate);
          const endDate = new Date(slot.endDate);

          const from = `${startDate.getHours()}: ${startDate.getMinutes()}`;
          const to = `${endDate.getHours()}: ${endDate.getMinutes()}`;

          return (
            <Stack>
              <Button onClick={() => reserveSlot(slot)} color="inherit" underline="hover" variant="subtitle2">
                {from} - {to}
              </Button>
              <Divider></Divider>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
