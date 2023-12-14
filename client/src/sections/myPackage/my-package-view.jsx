import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';

import PlanCard from './plan-view';

import { axiosInstance } from 'src/utils/axiosInstance';

export default function PackageView() {
  const {
    isLoading,
    error,
    data: ourPackages
  } = useQuery(
    'packages',
    () =>
      axiosInstance
        .get('me/package')
        .then((res) => res.data.result)
        .catch(),
    {
      refetchOnWindowFocus: false
    }
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');

  if (isLoading) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;

    setOpenSnackbar(false);
  };

  return (
    <>
      <Container maxWidth="md">
        <Stack spacing={3} alignItems="center">
          <div style={{ width: '100%' }}>
            <Grid container spacing={3} pt={4}>
              {ourPackages.reverse().map((plan, i) => {
                const cols = i == 0 ? 12 : 6;

                return (
                  <Grid item xs={cols} sm={cols} md={cols} key={i}>
                    <PlanCard plan={plan} setOpenSnackbar={setOpenSnackbar} setMessage={setMessage} />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </Stack>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackBar}
          message={message}
        />
      </Container>
    </>
  );
}
