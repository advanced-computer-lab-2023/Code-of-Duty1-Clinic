import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Container,
  Card,
  Stack,
  TextField,
  Typography,
  Button,
  MenuItem,
  Snackbar,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { axiosInstance } from '../../utils/axiosInstance';

const AddSlotsForm = () => {
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
    const timeStringToObject = (timeString) => {
      const [hours, minutes] = timeString.split(':');
      return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
    };

    const slotData = {
      day: data.day,
      slots: [
        {
          from: timeStringToObject(data.startTime),
          to: timeStringToObject(data.endTime)
        }
      ]
    };

    setLoading(true);
    setMessage('');

    try {
      const response = await axiosInstance.put('/me/weeklyslots', slotData);

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

  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Card variant="outlined" sx={{ p: 3, width: '100%', maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Add Slots
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <TextField
                select
                label="Day of the Week"
                {...register('day', { required: 'Day is required' })}
                error={Boolean(errors.day)}
                helperText={errors.day?.message}
                fullWidth
                margin="normal"
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                {...register('startTime', { required: 'Start time is required' })}
                error={Boolean(errors.startTime)}
                helperText={errors.startTime?.message}
                fullWidth
                margin="normal"
              />
              <TextField
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                {...register('endTime', { required: 'End time is required' })}
                error={Boolean(errors.endTime)}
                helperText={errors.endTime?.message}
                fullWidth
                margin="normal"
              />

              <Button
                type="submit"
                variant="contained"
                color="inherit"
                disabled={loading}
                fullWidth
                sx={{ mt: 1, width: '50%', height: '45px' }}
              >
                {loading ? 'Adding...' : 'Add Slot'}
              </Button>
            </Stack>
          </form>

          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={5000}
            onClose={handleCloseSnackBar}
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

export default AddSlotsForm;
