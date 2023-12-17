import { useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

import { axiosInstance } from 'src/utils/axiosInstance';

export default function AddPackage({ setOpenSnackbar, setMessage }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const { isLoading, mutate: onSubmit } = useMutation(
    async (data) =>
      await axiosInstance
        .post('/packages', data)
        .then((res) => {
          setMessage('Package added successfully');
          setOpenSnackbar(true);
          reset();
        })
        .catch((err) => {
          setMessage(err.response?.data.message || 'Network error');
          setOpenSnackbar(true);
        })
  );

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Card variant="outlined" sx={{ p: 3, width: '100%', maxWidth: 700 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Add new health package
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <TextField
                label="Name"
                {...register('name', { required: 'Name is required' })}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                fullWidth
                margin="normal"
              />

              <TextField
                type="number"
                label="Price"
                {...register('price', { required: 'Price is required', min: 0 })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
                fullWidth
                margin="normal"
              />

              <TextField
                type="number"
                label="Session Discount %"
                {...register('sessionDiscount', { required: 'Session Discount is required', min: 0, max: 100 })}
                error={Boolean(errors.sessionDiscount)}
                helperText={errors.sessionDiscount?.message}
                fullWidth
                margin="normal"
              />

              <TextField
                type="number"
                label="Medicine Discount %"
                {...register('medicineDiscount', {
                  required: 'Medicine Discount is required',
                  min: 0,
                  max: 100,
                  valueAsNumber: true
                })}
                error={Boolean(errors.medicineDiscount)}
                helperText={errors.medicineDiscount?.message}
                fullWidth
                margin="normal"
              />

              <TextField
                type="number"
                label="Family Discount %"
                {...register('familyDiscount', { required: 'Family Discount is required', min: 0, max: 100 })}
                error={Boolean(errors.familyDiscount)}
                helperText={errors.familyDiscount?.message}
                fullWidth
                margin="normal"
              />

              <LoadingButton
                loading={isLoading}
                disabled={isLoading}
                loadingIndicator="Loading…"
                variant="contained"
                color="inherit"
                type="submit"
                sx={{ mt: 1, width: '50%', height: '45px' }}
              >
                Add Package
              </LoadingButton>
            </Stack>
          </form>
        </Card>
      </Box>
    </Container>
  );
}
