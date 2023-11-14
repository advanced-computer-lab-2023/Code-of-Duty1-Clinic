import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

import Logo from 'src/components/logo';
import { bgGradient } from 'src/theme/css';
import EnterEmail from '../enter-email';
import EnterOTP from '../enter-otp';
import ResetPassword from '../reset-password';

import { useRouter } from 'src/routes/hooks';

const steps = ['Enter your email', 'Enter the OTP', 'Reset your password'];

export default function ForgotView() {
  const theme = useTheme();

  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFinish = () => {
    router.push('/login');
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

      <Stack alignItems="center" justifyContent="center" spacing={20} sx={{ height: 1 }}>
        <Card
          sx={{
            p: 6,
            width: 1,
            maxWidth: 700,
            minHeight: 350
          }}
        >
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <React.Fragment>
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ pt: 4 }}>
              {activeStep === 0 ? (
                <EnterEmail email={email} setEmail={setEmail} handleNext={handleNext} />
              ) : activeStep === 1 ? (
                <Stack>
                  <EnterOTP email={email} handleNext={handleNext} />

                  <Button color="inherit" disabled={activeStep != 1} onClick={() => setActiveStep(0)} sx={{ mr: 1 }}>
                    Back
                  </Button>
                </Stack>
              ) : (
                <ResetPassword email={email} handleFinish={handleFinish} />
              )}
            </Stack>
          </React.Fragment>
        </Card>
      </Stack>
    </Box>
  );
}
