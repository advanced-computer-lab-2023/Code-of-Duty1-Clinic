import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { axiosInstance } from '../../utils/axiosInstance';
import { useUserContext } from 'src/contexts/userContext';

import { bgGradient } from 'src/theme/css';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const destination = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser } = useUserContext();

  const onSubmit = async (body) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', body);

      if (res.status == 200) {
        const user = res.data.user;
        setUser({ name: user.name, role: user.role });

        router.push(destination);
      } else {
        setError(res.data.message);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg'
        }),
        height: 1
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 }
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420
          }}
        >
          <Typography variant="h4">Sign in to Minimal</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
            Don’t have an account?
            <Link href="/register" variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}

              <TextField
                label="Username"
                {...register('username', {
                  required: true
                })}
                error={!!errors?.username}
                helperText={errors?.username ? 'Required' : null}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: true
                })}
                error={!!errors?.password}
                helperText={errors?.password ? 'Required' : null}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
              <Link href="/" variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
            </Stack>

            <LoadingButton
              loading={loading}
              loadingIndicator="Loading…"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
            >
              Login
            </LoadingButton>
          </form>
        </Card>
      </Stack>
    </Box>
  );
}
