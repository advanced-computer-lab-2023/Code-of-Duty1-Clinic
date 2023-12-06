import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import { axiosInstance } from '../../utils/axiosInstance';
import { RegistrationUpload } from 'src/sections/upload';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [currentTab, setCurrentTab] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (e, tabIndex) => {
    e.preventDefault();

    setCurrentTab(tabIndex);
  };

  const onSubmit = async (body) => {
    try {
      setLoading(true);

      let role = '';
      switch (currentTab) {
        case 0:
          role = 'Patient';
          break;
        case 1:
          role = 'Doctor';
          break;
        case 2:
          role = 'Pharmacist';
          break;
      }

      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        // credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...body, role })
      });

      const data = await res.json();

      if (res.ok) router.push('/upload-document');
      else setError(data.message);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
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
              maxWidth: 500
            }}
          >
            <Typography variant="h4">Sign Up to Minimal</Typography>

            <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
              already have an account?
              <Link href="/login" variant="subtitle2" sx={{ ml: 0.5 }}>
                Login
              </Link>
            </Typography>

            <Divider sx={{ mb: 1 }}>OR</Divider>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Tabs centered sx={{ mb: 2 }} onChange={handleTabChange}>
                <Tab label="Register as a Patient" value={0} />
                <Tab label="Register as a Doctor" value={1} />
                <Tab label="Register as a Pharmacist" value={2} />
              </Tabs>

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
                  label="Name"
                  {...register('name', {
                    required: true
                  })}
                  error={!!errors?.name}
                  helperText={errors?.name ? 'Required' : null}
                />

                <TextField
                  type="email"
                  label="Email"
                  {...register('email', {
                    required: true
                  })}
                  error={!!errors?.email}
                  helperText={errors?.email ? 'Required' : null}
                />

                <TextField
                  type="password"
                  label="Password"
                  {...register('password', {
                    required: true
                  })}
                  error={!!errors?.password}
                  helperText={errors?.password ? 'Required' : null}
                />

                <TextField
                  label="Phone"
                  {...register('phone', {
                    required: true
                  })}
                  error={!!errors?.phone}
                  helperText={errors?.phone ? 'Required' : null}
                />

                <TextField
                  select
                  label="Gender"
                  {...register('gender', {
                    required: true
                  })}
                  error={!!errors?.gender}
                  helperText={errors?.gender ? 'Required' : null}
                >
                  <MenuItem key="Male" value="Male">
                    Male
                  </MenuItem>
                  <MenuItem key="Female" value="Female">
                    Female
                  </MenuItem>
                </TextField>

                <TextField
                  type="date"
                  defaultValue={new Date()}
                  label="Birth Date"
                  {...register('birthDate', {
                    required: true
                  })}
                  error={!!errors?.birthDate}
                  helperText={errors?.birthDate ? 'Required' : null}
                />
                <Stack spacing={3}>
                  {currentTab === 1 && (
                    <TextField
                      label="Speciality"
                      {...register('specialty', {
                        required: true
                      })}
                      error={!!errors?.specialty}
                      helperText={errors?.specialty ? 'Required' : null}
                    />
                  )}

                  {(currentTab === 1 || currentTab === 2) && (
                    <>
                      <TextField
                        label="Hour Rate"
                        {...register('hourRate', {
                          required: true
                        })}
                        error={!!errors?.hourRate}
                        helperText={errors?.hourRate ? 'Required' : null}
                      />

                      <TextField
                        label="Hospital"
                        {...register('hospital', {
                          required: true
                        })}
                        error={!!errors?.hospital}
                        helperText={errors?.hospital ? 'Required' : null}
                      />

                      <TextField
                        label="Educational Background"
                        {...register('educationBackground', {
                          required: true
                        })}
                        error={!!errors?.educationBackground}
                        helperText={errors?.educationBackground ? 'Required' : null}
                      />
                      <RegistrationUpload />
                    </>
                  )}
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
                  Register
                </LoadingButton>
              </Stack>
            </form>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
}
