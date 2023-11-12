import { useQuery } from 'react-query';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

import DoctorCard from '../doctor-card';

import { axiosInstance } from '../../../utils/axiosInstance';

export default function DoctorsView() {
  const {
    isLoading,
    error,
    data: doctors
  } = useQuery('slots', () => axiosInstance.get(`/doctors`).then((res) => res.data.result), {
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Doctors
      </Typography>
      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          Search
        </Stack>
      </Stack>
      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid>
            <DoctorCard key={doctor._id} doctor={doctor} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
