import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { useState, useEffect } from 'react';
const lightGreen = '#90EE90';
const lightRed = '#FFB6C1';
export default function OrderDetails({ order, onCLoseModal }) {
  const status = order.status;
  const color = status == 'Cancelled' ? 'red' : status === 'Delivered' ? 'green' : 'black';
  const formattedDate = new Date(order.date).toLocaleDateString('en-GB');
  let totalAmount = 0;
  let count = 0;
  order.items.forEach((item) => {
    totalAmount += item.price;
    count += item.count;
  });
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medicinesData = await Promise.all(
          order.items.map(async (item) => {
            const response = await axios.get(`http://localhost:3000/medicine/${item.id}`, {
              withCredentials: true
            });
            return response.data.result[0];
          })
        );
        setMedicines(medicinesData);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchData();
  }, [order.items]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card variant="outlined">
        <React.Fragment>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={'row'} justifyContent={'space-between'} spacing={4}>
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
                <Typography>#{order._id}</Typography>
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <Avatar
                  alt="location point"
                  src="assets/images/orders/location.jpg"
                  sx={{
                    width: 30,
                    height: 30,
                    border: 0,
                    borderColor: 'primary.main'
                  }}
                ></Avatar>
                <Stack>
                  <Typography sx={{ mb: 0.5 }} color="text.secondary">
                    Delivery to
                  </Typography>
                  <Typography sx={{ mb: 0.5 }} variant="p">
                    {order.address}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Typography variant="h5" component="div">
              Order Details
            </Typography>
            <Stack spacing={2}>
              {medicines.map((medicine, index) => (
                <Stack key={medicine.id} direction={'row'} spacing={2}>
                  <Stack justifyContent={'center'}>
                    <Avatar
                      alt="product img"
                      src="assets/images/orders/product.jpg"
                      sx={{
                        width: 40,
                        height: 40,
                        border: 0,
                        borderColor: 'primary.main'
                      }}
                    ></Avatar>
                  </Stack>

                  <Stack>
                    <Typography>{medicine.name}</Typography>
                    <Typography>{medicine.description}</Typography>
                    <Typography>
                      {medicine.price}$ for each item x{order.items[index].count}
                    </Typography>
                    <Typography>{order.items[index].price}$</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant="body2">payment method</Typography>
              <Typography variant="body2">{order.paymentType}</Typography>
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant="body2">total</Typography>
              <Typography variant="body2">{totalAmount}$</Typography>
            </Stack>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={onCLoseModal}>
              close
            </Button>
          </CardActions>
        </React.Fragment>
      </Card>
    </Box>
  );
}
