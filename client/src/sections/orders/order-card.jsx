// import { Stack, Avatar } from '@mui/material';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack, Avatar, Modal, Dialog, DialogActions, DialogTitle } from '@mui/material';
import OrderDetails from './order-details';
import axios from 'axios';
const lightGreen = '#90EE90';
const lightRed = '#FFB6C1';

export default function OrderCard({ order, onCancelOrder, onChangeOrderStatus }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const user = localStorage.getItem('userRole');
  const [orderedBy, setOrderedBy] = React.useState('');
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = React.useState(false);
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] = React.useState(false);

  const handleOpenCancelConfirmation = () => {
    setIsCancelConfirmationOpen(true);
  };

  const handleCloseCancelConfirmation = () => {
    setIsCancelConfirmationOpen(false);
  };

  const handleCancelOrder = () => {
    setIsCancelConfirmationOpen(false);
    onCancelOrder(); // Call the onCancelOrder function when confirmed
  };

  const handleOpenChangeStatusModal = () => {
    setIsChangeStatusModalOpen(true);
  };

  const handleCloseChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    const loadUserName = async () => {
      if (user === 'Pharmacist') {
        try {
          const response = await axios.get(`http://localhost:3000/users/${order.userID}`, { withCredentials: true });

          if (response.data.result[0].name) setOrderedBy(response.data.result[0].name);
        } catch (err) {
          console.log('cannot find the user ');
        }
      }
    };
    loadUserName();
  }, [order.userID, user]);

  const status = order.status;
  const color = status === 'Cancelled' ? 'red' : status === 'Delivered' ? 'green' : 'black';
  const formattedDate = new Date(order.date).toLocaleDateString('en-GB');
  let totalAmount = 0;
  let count = 0;
  order.items.forEach((item) => {
    totalAmount += item.price;
    count += item.count;
  });

  return (
    <Box sx={{ minWidth: 275, marginBottom: 2 }}>
      <Card variant="outlined">
        <Stack direction={'row'} justifyContent={'space-evenly'}>
          <React.Fragment>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color={color} gutterBottom>
                your order is {status} {status != 'Processing' && status != 'Not Processed' ? formattedDate : ''}
              </Typography>
              <Stack direction="row" spacing={2}>
                {status === 'Cancelled' ? (
                  <Avatar
                    alt="order cancelled"
                    src="assets/images/orders/preview.jpg"
                    sx={{
                      width: 30,
                      height: 30,
                      border: 0,
                      borderColor: 'primary.main'
                    }}
                  ></Avatar>
                ) : status === 'Delivered' ? (
                  <Avatar
                    alt="order completed"
                    src="assets/images/orders/order-complete.jpg"
                    sx={{
                      width: 30,
                      height: 30,
                      border: 0,
                      borderColor: 'primary.main'
                    }}
                  ></Avatar>
                ) : (
                  <Avatar
                    alt="order not completed"
                    src="assets/images/orders/order-loading.jpg"
                    sx={{
                      width: 30,
                      height: 30,
                      border: 0,
                      borderColor: 'primary.main'
                    }}
                  ></Avatar>
                )}
                <Stack>
                  <Typography>
                    {count} items- {totalAmount} $
                  </Typography>
                  <Typography>#{order._id}</Typography>
                </Stack>
                {status != 'Processing' && status != 'Not Processed' && status != 'Shipped' && (
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      backgroundColor: color === 'red' ? lightRed : lightGreen, // Light red color
                      padding: '10px',
                      borderRadius: '8px',
                      color: color
                    }}
                  >
                    {status}
                  </Typography>
                )}
              </Stack>
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined">
                Help
              </Button>
              <Button size="small" onClick={handleOpenModal} variant="contained">
                Details
              </Button>
              {status !== 'Cancelled' && user === 'Patient' && status != 'Delivered' && (
                <React.Fragment>
                  <Button size="small" onClick={handleOpenCancelConfirmation} variant="outlined">
                    Cancel
                  </Button>
                  <Dialog open={isCancelConfirmationOpen} onClose={handleCloseCancelConfirmation}>
                    <DialogTitle>Are you sure you want to cancel the order?</DialogTitle>
                    <DialogActions>
                      <Button onClick={handleCloseCancelConfirmation}>No</Button>
                      <Button onClick={handleCancelOrder}>Yes</Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
              )}
              {status !== 'Cancelled' && user === 'Pharmacist' && (
                <Button size="small" onClick={handleOpenChangeStatusModal} variant="outlined">
                  Change Order State
                </Button>
              )}
            </CardActions>
          </React.Fragment>
          {user === 'Pharmacist' && <Typography sx={{ marginTop: 5 }}>{`orderedBy : ${orderedBy}`}</Typography>}
        </Stack>
      </Card>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="order-details-modal"
        aria-describedby="order-details-description"
      >
        <OrderDetails order={order} onCLoseModal={handleCloseModal}></OrderDetails>
      </Modal>
      <Dialog open={isChangeStatusModalOpen} onClose={handleCloseChangeStatusModal}>
        <DialogTitle>Choose the new status</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              onChangeOrderStatus('Cancelled');
              handleCloseChangeStatusModal(); // Close the modal after handling the status change
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onChangeOrderStatus('Processing');
              handleCloseChangeStatusModal();
            }}
            variant="outlined"
          >
            Processing
          </Button>
          <Button
            onClick={() => {
              onChangeOrderStatus('Shipped');
              handleCloseChangeStatusModal();
            }}
            variant="outlined"
          >
            Shipped
          </Button>
          <Button
            onClick={() => {
              onChangeOrderStatus('Delivered');
              handleCloseChangeStatusModal();
            }}
            variant="outlined"
          >
            Delivered
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
