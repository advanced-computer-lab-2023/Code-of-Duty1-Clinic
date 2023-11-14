import { useQuery } from 'react-query';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

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
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );

  if (isLoading) return null;

  if (error) return 'An error has occurred';

  return (
    <Card type="section">
      <Stack direction={'row'} spacing={3} m={4}>
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

        <Stack spacing={0} alignItems="center" justifyContent="center">
          <Typography variant="h5" color={'Highlight'} noWrap>
            Dr. {doctor.name}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            Specialty: {doctor.specialty}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            Education: {doctor.educationBackground}
          </Typography>
          <Typography variant="subtitle1" mb={1} noWrap>
            Hospital: {doctor.hospital}
          </Typography>
          <Typography variant="subtitle1" fontSize={18} fontFamily={'Segoe UI'}>
            Hourly Rate: {doctor.hourRate}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={0} alignItems="center" justifyContent="center">
          {Object.keys(weekSlots).map((day) => (
            <DoctorDaySlots key={day} day={day} slots={weekSlots[day]} doctorID={doctor._id} />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
