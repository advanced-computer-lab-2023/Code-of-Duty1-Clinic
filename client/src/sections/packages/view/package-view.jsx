import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import { axiosInstance } from "src/utils/axiosInstance";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';

const StyledPackageContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
  padding: theme.spacing(6),
  marginBottom: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
}));

const PackageView = () => {
  
  const { isLoading, error, data: userPackages } = useQuery('packages', () =>
    axiosInstance.get('/packages').then((res) => res.data.result), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const [subscribeMessage, setSubscribeMessage] = useState('');


  const subscribe = async(packageID) => {
    const res = await axiosInstance.post('/me/package',{packageID:packageID});
    if(res.data.message === 'Unauthorized')
      setSubscribeMessage('Please login first');
    else
    {
      setSubscribeMessage(res.data.message);
    }
  }

  const useSubscribe = () =>
  {
    return useMutation(subscribe);
  }

  const{mutate,isLoading:isLoadingSubscribe} = useSubscribe();

  const handleClick = (packageID) => {
    return mutate(packageID);
  }

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred' + error.message;



  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Packages
      </Typography>
      {subscribeMessage && (<Typography variant="body1" sx={{ mt: 2 }}>{subscribeMessage}</Typography>)}
      {!userPackages &&  (<Typography variant="body1" sx={{ mt: 2 }}>There are currently no packages</Typography>)}
      <Grid container spacing={3} direction="row" justifyContent="center" alignItems="center" sx={{ mb: 3, mt:5 }}>
        {userPackages.map((userPackage) => (
          <StyledPackageContainer key={userPackage._id} spacing={5}>
            <Typography variant='h6' sx={{ mt: -2, mb: 3 , textAlign: 'center' }}>{userPackage.name}</Typography>
            <Typography sx={{ mb: 2 }}>Price: {userPackage.price}</Typography>
            <Typography sx={{ mb: 2 }}>Session Discount: {userPackage.sessionDiscount}</Typography>
            <Typography sx={{ mb: 2 }}>Medicine Discount: {userPackage.medicineDiscount}</Typography>
            <Typography sx={{ mb: 2 }}>Family Discount: {userPackage.familyDiscount}</Typography>
            <LoadingButton
              onClick={() => handleClick(userPackage._id)}
              loading={isLoadingSubscribe}
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
};

export default PackageView;
