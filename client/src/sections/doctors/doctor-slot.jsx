import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// This is not accurate, but it's a start
export default function DoctorSlot({ slot }) {
  const day = slot.day; // find a way to get the day of the week starting from today
  const from = `${slot.from.hours}: ${slot.from.minutes}`;
  const to = `${slot.to.hours}: ${slot.to.minutes}`;

  return (
    <Stack>
      <Typography variant="h5" sx={{ m: 2 }}>
        day
      </Typography>

      <Stack alignItems="center" justifyContent="center" sx={{}}>
        <Typography variant="h6" sx={{ m: 1 }}>
          {from}
        </Typography>
        <Typography variant="h6" sx={{ m: 1 }}>
          {to}
        </Typography>
      </Stack>
    </Stack>
  );
}
