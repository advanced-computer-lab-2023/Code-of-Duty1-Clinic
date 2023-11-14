import React, { useState } from 'react';
import { useMutation } from 'react-query';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import { axiosInstance } from '../../utils/axiosInstance';

export default function EnterOTP({ email, handleNext }) {
  const [otp, setOTP] = useState(0);

  const {
    isLoading,
    mutate: verifyOTP,
    error
  } = useMutation(() =>
    axiosInstance.post('/auth/verify-otp', { email, otp }).then((res) => {
      if (res.status == 200) handleNext();
      else console.log(res.data);
    })
  );

  return (
    <Box>
      <Typography sx={{ mt: 2, mb: 1 }}>Enter the OTP</Typography>
      <TextField
        onChange={(e) => setOTP(e.target.value)}
        type="number"
        helperText="Enter the OTP we sent you to reset your password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end">
                <Iconify icon="mdi:numeric-1-circle-outline" />
              </IconButton>
            </InputAdornment>
          )
        }}
      ></TextField>

      <Stack sx={{ pt: 2 }}>
        <LoadingButton
          onClick={verifyOTP}
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
