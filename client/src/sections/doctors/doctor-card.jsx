import { useQuery } from 'react-query';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';

import DoctorDaySlots from './doctor-slot';

import { axiosInstance } from '../../utils/axiosInstance';

export default function DoctorCard({ doctor }) {
  const {
    isLoading,
    error,
    data: weekSlots
  } = useQuery(
    'slots',
    () =>
      axiosInstance.get(`/doctors/${doctor._id}/availableAppointments`).then((res) => {
        console.log(res.data.result);
        return res.data.result;
      }),
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  if (isLoading) return null;

  if (error) return 'An error has occurred';

  return (
    <Card type="section">
      <Stack direction={'row'} spacing={5} m={6}>
        <Stack alignItems="center" justifyContent="center">
          <Avatar
            alt="User Img"
            src="assets/images/avatars/avatar_1.jpg"
            sx={{
              width: 150,
              height: 150,
              border: 1,
              borderColor: 'primary.main'
            }}
          />
        </Stack>

        <Stack spacing={0} alignItems="center" justifyContent="center">
          <Typography variant="h4" color={'Highlight'}>
            Dr.{doctor.name}
          </Typography>
          <Typography variant="subtitle1" mb={4}>
            Specialty: {doctor.specialty}
          </Typography>
          <Typography variant="subtitle1" fontSize={18} fontFamily={'Segoe UI'}>
            Hourly Rate:{' '}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={0} alignItems="center" justifyContent="center">
          {Object.keys(weekSlots).map((day) => (
            <DoctorDaySlots day={day} slots={weekSlots[day]} />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
