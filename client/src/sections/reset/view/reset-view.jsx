import React, { useState } from 'react';
import { useMutation } from 'react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import { axiosInstance } from '../../../utils/axiosInstance';
import { useRouter } from 'src/routes/hooks';

export default function ResetView() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    isLoading,
    mutate: resetPassword,
    error
  } = useMutation(() =>
    axiosInstance.put('/auth/change-password', { oldPassword, newPassword }).then((res) => {
      if (res.status == 200) router.push('/');
      else console.log(res.data);
    })
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Reset Password</Typography>

        {/* <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New User
        </Button> */}
      </Stack>

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1, p: 5 }}>
        <Card
          sx={{
            p: 6,
            width: 1,
            maxWidth: 700,
            minHeight: 400
          }}
        >
          <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ p: 5 }}>
            <Typography sx={{ mt: 2, mb: 1 }}>Enter your old password</Typography>
            <TextField
              onChange={(e) => setOldPassword(e.target.value)}
              label="Old Password"
              type={showPassword ? 'text' : 'password'}
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

            <Typography sx={{ mt: 5, mb: 1 }}>Enter your new password</Typography>
            <TextField
              onChange={(e) => setNewPassword(e.target.value)}
              label="New Password"
              type={showPassword ? 'text' : 'password'}
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

            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ pt: 1 }}>
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
                  Reset
                </LoadingButton>
                {error && (
                  <Typography variant="body1" color="error" sx={{ pl: 11, pt: 2 }}>
                    {error.response.data.message}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
