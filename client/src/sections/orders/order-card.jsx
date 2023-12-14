// import { Stack, Avatar } from '@mui/material';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack, Avatar, Modal, Fade } from '@mui/material';
import OrderDetails from './order-details';
const lightGreen = '#90EE90';
const lightRed = '#FFB6C1';
export default function OrderCard({ order, onCancelOrder }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const status = order.status;
  const color = status == 'Cancelled' ? 'red' : status === 'Delivered' ? 'green' : 'black';
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
              {status != 'Processing' && status != 'Not Processed' && (
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
            <Button size="small">Help</Button>
            <Button size="small" onClick={handleOpenModal}>
              Details
            </Button>
            {(status === 'Processing' || status === 'Not Processed') && (
              <Button size="small" onClick={onCancelOrder}>
                cancel
              </Button>
            )}
          </CardActions>
        </React.Fragment>
      </Card>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="order-details-modal"
        aria-describedby="order-details-description"
      >
        {/* Pass the order details to the modal component */}
        {/* <OrderDetailsModal order={order} /> */}
        <OrderDetails order={order} onCLoseModal={handleCloseModal}></OrderDetails>
      </Modal>
    </Box>
  );
}
