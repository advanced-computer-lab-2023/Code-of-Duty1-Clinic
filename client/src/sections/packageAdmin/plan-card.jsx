import { useMutation } from 'react-query';

import { Box, Card, Stack, Typography, Divider } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LoadingButton from '@mui/lab/LoadingButton';

import { axiosInstance } from 'src/utils/axiosInstance';

export default function PlanCard({ plan, setMessage, setOpenSnackbar, refetch, setOpenModal, setPackage }) {
  const { _id: id, name: packageName, price, sessionDiscount, medicineDiscount, familyDiscount } = plan ?? {};

  const { isLoadingDelete, mutate: deletePackage } = useMutation(() => {
    axiosInstance
      .delete(`packages/${id}`)
      .then((res) => refetch())
      .catch((err) => {
        setMessage(err.response?.data.message || 'Network error');
        setOpenSnackbar(true);
      });
  });

  const handleEdit = () => {
    setPackage(plan);
    setOpenModal(true);
  };

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }} type="none">
      <Box height={50} width={50} position="absolute" top={-10} right={10} />

      <Typography
        variant="h4"
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
        {packageName}
      </Typography>

      <Stack spacing={1} alignItems="center" p={2}>
        <Typography
          textAlign="center"
          variant="h2"
          component="h5"
          borderBottom={2}
          borderColor="secondary.main"
          sx={{}}
        >
          {price} <Typography variant="caption">/Year</Typography>
        </Typography>

        <Stack spacing={2} height="100%" sx={{ py: 1 }}>
          <Feature title={`Session Discount: ${sessionDiscount}%`} />
          <Feature title={`Medicine Discount: ${medicineDiscount}%`} />
          <Feature title={`Family Discount: ${familyDiscount}%`} />
        </Stack>

        <LoadingButton
          loading={isLoadingDelete}
          loadingIndicator="Loading…"
          onClick={handleEdit}
          fullWidth
          size="large"
          variant="contained"
          sx={{ backgroundColor: 'info.darker' }}
        >
          Modify Plan
        </LoadingButton>
        <LoadingButton
          loading={isLoadingDelete}
          loadingIndicator="Loading…"
          onClick={deletePackage}
          fullWidth
          size="large"
          variant="contained"
          sx={{ backgroundColor: 'error.dark' }}
        >
          Delete Plan
        </LoadingButton>
      </Stack>
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
