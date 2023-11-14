import { useMutation, useQuery } from 'react-query';
import { useState } from 'react';
import { axiosInstance } from 'src/utils/axiosInstance';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

const StyledPackageContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
  padding: theme.spacing(6),
  marginBottom: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}));

export default function PackageView() {
  const router = useRouter();

  const {
    isLoading: isLoadingPackages,
    error,
    data: userPackages
  } = useQuery('packages', () => axiosInstance.get('/packages').then((res) => res.data.result), {
    refetchOnWindowFocus: false
  });

  const { isLoading, mutate: subscribe } = useMutation((selectedPackage) => {
    axiosInstance.post('/me/package', { packageID: selectedPackage._id }).then((res) => router.push('/viewPackage'));

    axiosInstance
      .post(`/payment/session/oneTimePayment`, {
        products: [{ name: selectedPackage.name, price: selectedPackage.price, quantity: 1 }]
      })
      .then((res) => {
        window.location.replace(res.data.url);
      })
      .catch((err) => console.log(err));
  });

  if (isLoadingPackages) return 'Loading...';
  if (error) return 'An error has occurred' + error.message;

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Packages
      </Typography>

      {!userPackages && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          There are currently no packages
        </Typography>
      )}
      <Grid container spacing={3} direction="row" justifyContent="center" alignItems="center" sx={{ mb: 3, mt: 5 }}>
        {userPackages.map((userPackage) => (
          <StyledPackageContainer key={userPackage._id} spacing={5}>
            <Typography variant="h6" sx={{ mt: -2, mb: 3, textAlign: 'center' }}>
              {userPackage.name}
            </Typography>
            <Typography sx={{ mb: 2 }}>Price: {userPackage.price}</Typography>
            <Typography sx={{ mb: 2 }}>Session Discount: {userPackage.sessionDiscount}</Typography>
            <Typography sx={{ mb: 2 }}>Medicine Discount: {userPackage.medicineDiscount}</Typography>
            <Typography sx={{ mb: 2 }}>Family Discount: {userPackage.familyDiscount}</Typography>

            <LoadingButton
              onClick={() => subscribe(userPackage)}
              loading={isLoading}
              loadingIndicator="Loading…"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
            >
              Subscribe
            </LoadingButton>
          </StyledPackageContainer>
        ))}
      </Grid>
    </Container>
  );
}
