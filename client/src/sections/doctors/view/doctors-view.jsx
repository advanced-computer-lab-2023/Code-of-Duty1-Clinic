import { useQuery } from 'react-query';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';

import DoctorFilter from '../doctor-filter';
import DoctorCard from '../doctor-card';

import { axiosInstance } from '../../../utils/axiosInstance';

export default function DoctorsView() {
  const {
    isLoading,
    error,
    data: doctors
  } = useQuery(
    'doctors',
    () =>
      axiosInstance.get(`/doctors`).then((res) => {
        const doctors = res.data.result;
        setFilteredDoctors(doctors);

        return doctors;
      }),
    {
      // refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const [filteredDoctors, setFilteredDoctors] = useState([]);

  if (isLoading) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

  const onSearch = async (filters) => {
    const params = {};

    if (filters.name) params.name = filters.name;
    if (filters.specialty) params.specialty = filters.specialty;
    if (filters.date) params.date = filters.date;

    await axiosInstance
      .get(`/doctors`, { params })
      .then((res) => setFilteredDoctors(res.data.result))
      .catch((err) => console.log(err));
  };

  let i = 0;
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Doctors
      </Typography>

      <Card sx={{ mb: 2 }}>
        <DoctorFilter onSearch={onSearch} />
      </Card>

      <Grid container spacing={3}>
        {filteredDoctors &&
          filteredDoctors.map((doctor) => {
            return (
              <Grid key={doctor._id} item xs={12} md={12} sm={12}>
                <DoctorCard i={i++} doctor={doctor} />
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
}
