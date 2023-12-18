import { useState } from 'react';
import { useQuery } from 'react-query';
import { axiosInstance } from 'src/utils/axiosInstance';

import {
  Container,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Snackbar
} from '@mui/material';
import PlanCard from './plan-card';

export default function EditDeletePackage({ setMessage, setOpenSnackbar }) {
  const {
    isLoading,
    error,
    data: packages,
    refetch
  } = useQuery('packages', () => axiosInstance.get('packages').then((res) => res.data.result), {
    refetchOnWindowFocus: false
  });

  const [selectedPackage, setPackage] = useState({});
  const [openModal, setOpenModal] = useState(false);

  if (isLoading) return 'Loading...';
  if (error) {
    setMessage(err.response?.data.message || 'Network error');
    setOpenSnackbar(true);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPackage((prevPackage) => ({
      ...prevPackage,
      [name]: value
    }));
  };

  const onModify = () => {
    axiosInstance
      .put(`/packages/${selectedPackage._id}`, selectedPackage)
      .then((res) => {
        setMessage('Package modified successfully');
        setOpenSnackbar(true);
        setOpenModal(false);
        refetch();
      })
      .catch((err) => {
        setMessage(err.response?.data.message || 'Network error');
        setOpenSnackbar(true);
      });
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={3} alignItems="center">
        <div style={{ width: '100%' }}>
          <Grid container spacing={3} pt={4}>
            {packages.map((plan, i) => {
              return (
                <Grid item xs={12} sm={4} md={4} key={i}>
                  <PlanCard
                    plan={plan}
                    setMessage={setMessage}
                    setOpenSnackbar={setOpenSnackbar}
                    refetch={refetch}
                    setOpenModal={setOpenModal}
                    setPackage={setPackage}
                  />{' '}
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Stack>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Modify package</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ my: 1 }}>Enter the new details...</DialogContentText>
          <Stack alignItems="center" justifyContent="center">
            <Stack spacing={2} sx={{ mt: 2, mx: 15 }}>
              <TextField onChange={handleChange} label={'Name'} name="name" value={selectedPackage.name} fullWidth />

              <TextField onChange={handleChange} label={'Price'} name="price" value={selectedPackage.price} fullWidth />

              <TextField
                onChange={handleChange}
                label={'Session Discount'}
                name="sessionDiscount"
                value={selectedPackage.sessionDiscount}
                fullWidth
              />

              <TextField
                onChange={handleChange}
                label={'Medicine Discount'}
                name="medicineDiscount"
                value={selectedPackage.medicineDiscount}
                fullWidth
              />

              <TextField
                onChange={handleChange}
                label={'Family Discount'}
                name="familyDiscount"
                value={selectedPackage.familyDiscount}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={onModify}>Modify</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
