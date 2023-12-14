import { useState } from 'react';
import { useQuery } from 'react-query';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';

import Iconify from 'src/components/iconify';

import DoctorDaySlots from './doctor-slot';

import { axiosInstance } from '../../utils/axiosInstance';

export default function DoctorCard({ i, doctor }) {
  const {
    isLoading,
    error,
    data: weekSlots
  } = useQuery(
    `slots${i}`,
    () => axiosInstance.get(`/doctors/${doctor._id}/availableAppointments`).then((res) => res.data.result),
    {
      refetchOnWindowFocus: false
      //  refetchOnMount: false }
    }
  );

  const [displayedDays, setDisplayedDays] = useState(0);
  const [check, setCheck] = useState(true);

  if (isLoading) return null;

  if (error) return 'An error has occurred';

  let ii = 0;
  return (
    <Card type="section">
      <Stack direction={'row'} spacing={0} mx={3} my={4}>
        <Box alignItems="center" justifyContent="center">
          <Avatar
            alt="User Img"
            src="assets/images/avatars/avatar_13.jpg"
            sx={{
              width: 125,
              height: 125,
              border: 1,
              borderColor: 'primary.main'
            }}
          />
        </Box>

        <Stack
          sx={{ width: { xs: '100%', sm: '30%' }, ml: { xs: '0', sm: '50px' }, mr: { xs: '0', sm: '20px' } }}
          spacing={0}
          alignItems="baseline"
          justifyContent="center"
        >
          <Typography variant="h5" color={'Highlight'} mb={1}>
            Dr. {doctor.name}
          </Typography>
          <Typography variant="subtitle1">Specialty: {doctor.specialty}</Typography>
          <Typography variant="subtitle1">Education: {doctor.educationBackground}</Typography>
          <Typography variant="subtitle1" mb={1}>
            Hospital: {doctor.hospital}
          </Typography>
          <Typography variant="subtitle1" fontSize={18} fontFamily={'Segoe UI'}>
            Hourly Rate: {doctor.hourRate}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          onClick={() => {
            setCheck((prev) => !prev);
            setTimeout(() => {
              setDisplayedDays((prev) => prev - 3);
              setCheck((prev) => !prev);
            }, 400);
          }}
          sx={{
            borderRadius: '50%', // Make the button circular
            width: '40px', // Set a fixed width for a smaller size
            height: '40px', // Set a fixed height for a smaller size
            minWidth: 'unset', // Remove minimum width
            padding: '0' // Remove default padding
          }}
        >
          <Iconify icon="system-uicons:backward" sx={{ mr: 2 }} />
        </Button>
        <Slide in={check} direction="left" timeout={500} appear={false}>
          <Stack direction={'row'} spacing={1} alignItems="center" justifyContent="center" sx={{ width: '30%' }}>
            {Object.keys(weekSlots)
              .slice(displayedDays, displayedDays + 3)
              .map((day) => (
                <DoctorDaySlots
                  key={ii++}
                  day={day}
                  slots={weekSlots[day]}
                  doctorID={doctor._id}
                  doctorName={doctor.name}
                />
              ))}
          </Stack>
        </Slide>
        <Button
          variant="contained"
          onClick={() => {
            setCheck((prev) => !prev);
            setTimeout(() => {
              setDisplayedDays((prev) => prev + 3);
              setCheck((prev) => !prev);
            }, 400);
          }}
          sx={{
            borderRadius: '50%', // Make the button circular
            width: '40px', // Set a fixed width for a smaller size
            height: '40px', // Set a fixed height for a smaller size
            minWidth: 'unset', // Remove minimum width
            padding: '0' // Remove default padding
          }}
        >
          <Iconify icon="system-uicons:forward" sx={{ mr: 2 }} />
        </Button>
      </Stack>
    </Card>
  );
}
