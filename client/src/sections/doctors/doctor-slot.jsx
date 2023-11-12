import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function DoctorDaySlots({ day, slots }) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  if (today.getDay() == day) day = 'Today';
  else if (today.getDay() + 1 == day) day = 'Tomorrow';
  else day = daysOfWeek[day];

  if (!slots) return null;

  return (
    <Box sx={{ border: 1, borderColor: 'primary.main' }}>
      <Typography variant="h5" sx={{ mx: 1 }}>
        {day}
      </Typography>
      <Divider sx={{ border: 1, borderColor: 'primary.gray' }}></Divider>

      <Stack alignItems="center" justifyContent="center" sx={{}}>
        {/* {slots.map((slot) => {
          const from = `${slot.from.getHours()}: ${slot.from.getMinutes()}`;
          const to = `${slot.to.getHours()}: ${slot.to.getMinutes()}`;

          return (
            <> */}
        <Typography variant="h6" sx={{ m: 1 }}>
          {`hbk`}
        </Typography>
        <Divider></Divider>
        {/* </>
          );
        })} */}
      </Stack>
    </Box>
  );
}
