import React, { useState } from 'react';
import { useMutation } from 'react-query';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import { axiosInstance } from '../../utils/axiosInstance';

export default function EnterEmail({ email, setEmail, handleNext }) {
  const {
    isLoading,
    mutate: sendEmail,
    error
  } = useMutation(() =>
    axiosInstance.post('/auth/forgot-password', { email }).then((res) => {
      if (res.status == 200) handleNext();
      else console.log(res.data);
    })
  );

  return (
    <Box>
      <Typography sx={{ mt: 2, mb: 1 }}>Enter your email</Typography>
      <TextField
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        helperText="We will send you an OTP to reset your password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end">
                <EmailIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      ></TextField>

      <Stack sx={{ pt: 2 }}>
        <LoadingButton
          onClick={sendEmail}
          loading={isLoading}
          loadingIndicator="Loading…"
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
        >
          Send
        </LoadingButton>
        {error && (
          <Typography variant="body1" color="error" sx={{ pl: 11, pt: 2 }}>
            {error.response.data.message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
