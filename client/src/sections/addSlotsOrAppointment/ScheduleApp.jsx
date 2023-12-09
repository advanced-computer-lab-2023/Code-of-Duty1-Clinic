import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Container, Card, Stack, TextField, Typography, Button, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { axiosInstance } from '../../utils/axiosInstance';

const ScheduleFollowUpForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axiosInstance.post('/me/appointments', {
        ...data
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        reset();
      } else {
        setMessage(response.data.message || 'An error occurred');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Card variant="outlined" sx={{ p: 3, width: '100%', maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Schedule Follow-Up Appointment
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Patient's Email"
                type="email"
                {...register('email', { required: 'Patient email is required' })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Start Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                {...register('startDate', { required: 'Start date is required' })}
                error={Boolean(errors.startDate)}
                helperText={errors.startDate?.message}
                fullWidth
                margin="normal"
              />
              <TextField
                label="End Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                {...register('endDate', { required: 'End date is required' })}
                error={Boolean(errors.endDate)}
                helperText={errors.endDate?.message}
                fullWidth
                margin="normal"
              />
              <Button type="submit" variant="contained" color="inherit" disabled={loading} fullWidth sx={{ mt: 2 }}>
                {loading ? 'Scheduling...' : 'Schedule Appointment'}
              </Button>
            </Stack>
          </form>

          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Card>
      </Box>
    </Container>
  );
};

export default ScheduleFollowUpForm;
