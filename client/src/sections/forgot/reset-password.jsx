import React, { useState } from 'react';
import { useMutation } from 'react-query';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import { axiosInstance } from '../../utils/axiosInstance';

export default function ResetPassword({ email, handleFinish }) {
  const [newPassword, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    isLoading,
    mutate: resetPassword,
    error
  } = useMutation(() =>
    axiosInstance.put('/auth/reset-password', { email, newPassword }).then((res) => {
      if (res.status == 200) handleFinish();
      else console.log(res.data);
    })
  );

  return (
    <Box>
      <Typography sx={{ mt: 2, mb: 1 }}>Enter your new password</Typography>
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ? 'text' : 'password'}
        helperText="Enter your new password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          )
        }}
      ></TextField>

      <Stack sx={{ pt: 2 }}>
        <LoadingButton
          onClick={resetPassword}
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
