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
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const validatePassword = (password) => {
    // Check if the password has at least one uppercase letter and one number
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;
    return uppercaseRegex.test(password) && numberRegex.test(password);
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setNewPassword(password);
    setIsPasswordValid(validatePassword(password));
  };

  const {
    isLoading,
    mutate: resetPassword,
    error
  } = useMutation(() =>
    axiosInstance.put('/auth/reset-password', { email, newPassword }).then((res) => {
      if (res.status === 200) handleFinish();
      else console.log(res.data);
    })
  );

  return (
    <Box>
      <Typography sx={{ mt: 2, mb: 1 }}>Enter your new password</Typography>
      <TextField
        onChange={handlePasswordChange}
        type={showPassword ? 'text' : 'password'}
        helperText="Enter your new password"
        error={!isPasswordValid}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {!isPasswordValid && (
        <Typography variant="body1" color="error" sx={{ pl: 1, pt: 1 }}>
          Password must contain at least one uppercase letter and one number.
        </Typography>
      )}

      <Stack sx={{ pt: 2 }}>
        <LoadingButton
          onClick={resetPassword}
          loading={isLoading}
          loadingIndicator="Loading…"
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          disabled={!isPasswordValid}
        >
          Send
        </LoadingButton>
        {error && (
          <Typography variant="body1" color="error" sx={{ pl: 1, pt: 2 }}>
            {error.response.data.message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
