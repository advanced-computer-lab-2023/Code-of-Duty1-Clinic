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
        <Button
          fullWidth
          onClick={() => {
            console.log('fffff');
            window.location.href = `http://localhost:3030/profile/${doctor._id}`;
          }}
        >
          <Stack alignItems="center" justifyContent="center">
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
          </Stack>

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
        </Button>
        <Stack
          direction={'row'}
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ position: 'relative', width: '85%' }}
        >
          {/* Backward Navigation Button */}
          <Button
            variant="contained"
            onClick={() => {
              setCheck((prev) => !prev);
              setTimeout(() => {
                setDisplayedDays((prev) => prev - 3);
                setCheck((prev) => !prev);
              }, 400);
            }}
            disabled={displayedDays <= 0}
            sx={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              minWidth: 'unset',
              padding: '0',
              position: 'absolute', // Fix the position
              left: 0 // Align to the left of the parent Stack
            }}
          >
            <Iconify icon="system-uicons:backward" sx={{ mx: 1 }} />
          </Button>

          {/* Sliding Component with DoctorDaySlots */}
          <Slide in={check} direction="left" timeout={500} appear={false}>
            <Stack direction={'row'} spacing={1} alignItems="center" justifyContent="center">
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

          {/* Forward Navigation Button */}
          <Button
            variant="contained"
            onClick={() => {
              setCheck((prev) => !prev);
              setTimeout(() => {
                setDisplayedDays((prev) => prev + 3);
                setCheck((prev) => !prev);
              }, 400);
            }}
            disabled={displayedDays >= 6}
            sx={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              minWidth: 'unset',
              padding: '0',
              position: 'absolute', // Fix the position
              left: 'auto', // Reset left to its default value
              right: 0 // Align to the right of the parent Stack
            }}
          >
            <Iconify icon="system-uicons:forward" sx={{ mx: 1 }} />
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
