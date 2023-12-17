import { useQuery } from 'react-query';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

import MemberCard from '../member-card';

import { axiosInstance } from '../../../utils/axiosInstance';

export default function FamilyView() {
  const {
    isLoading,
    error,
    data: members
  } = useQuery('family', () => axiosInstance.get(`/me/family`).then((res) => res.data.result), {
    // refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  if (isLoading) return <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />;
  if (error) return <Typography>An error has occurred: {error.response?.data.message || 'Network error'}</Typography>;

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Family Members
      </Typography>

      <Grid container spacing={3}>
        {members.map((member) => {
          return (
            <Grid key={member._id} item xs={6} md={6} sm={12}>
              <MemberCard member={member} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
