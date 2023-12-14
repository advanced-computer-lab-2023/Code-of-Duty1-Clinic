import { useMutation } from 'react-query';

import { Box, Card, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LoadingButton from '@mui/lab/LoadingButton';

import { axiosInstance } from 'src/utils/axiosInstance';

export default function PlanCard({ plan, setMessage, setOpenSnackbar }) {
  const { user: patient, status, package: userPackage, endDate } = plan;
  const { name, _id: patientID } = patient ?? {};
  const { name: packageName, price, sessionDiscount, medicineDiscount, familyDiscount } = userPackage ?? {};

  const { isLoading, mutate: unsubscribe } = useMutation(() => {
    axiosInstance
      .delete('/me/package', { patientID })
      .then((res) => window.location.reload())
      .catch((err) => {
        setMessage(err.response?.data.message || 'Network error');
        setOpenSnackbar(true);
      });
  });

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }} type="none">
      <Box height={50} width={50} position="absolute" top={-10} right={10} />

      <Typography
        variant="h3"
        sx={{
          backgroundColor: 'primary.main',
          textAlign: 'center',
          fontWeight: 'light',
          width: '100%',
          p: 2,
          backgroundColor: 'secondary.main',
          color: 'secondary.contrastText'
        }}
      >
        {packageName} - {name}
      </Typography>

      {userPackage ? (
        <Stack spacing={3} alignItems="center" p={3}>
          <Typography
            textAlign="center"
            variant="h2"
            component="h5"
            borderBottom={2}
            borderColor="secondary.main"
            //   sx={{ color: 'primary.main' }} // Use primary color for the text
          >
            {price} <Typography variant="caption">/Year</Typography>
          </Typography>

          <Stack spacing={2} height="100%">
            <Feature title={`Session Discount: ${sessionDiscount}`} />
            <Feature title={`Medicine Discount: ${medicineDiscount}`} />
            <Feature title={`Family Discount: ${familyDiscount}`} />
          </Stack>

          <LoadingButton
            loading={isLoading}
            loadingIndicator="Loading…"
            onClick={unsubscribe}
            fullWidth
            size="large"
            variant="contained"
            sx={{ color: 'secondary.contrastText' }} // Use secondary color for the button
          >
            Cancel
          </LoadingButton>
        </Stack>
      ) : null}
    </Card>
  );
}

function Feature({ title, addSX, ...props }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        transition: 'transform .3s',
        '&:hover': {
          transform: 'translateX(5px)',
          '& .MuiTypography-root': {
            color: (theme) => theme.palette.secondary.dark
          }
        },
        ...addSX
      }}
      {...props}
    >
      <CheckIcon color="success" fontSize="small" />
      <Typography variant="body1" color="textSecondary">
        {title}
      </Typography>
    </Stack>
  );
}
