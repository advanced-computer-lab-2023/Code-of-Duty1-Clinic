import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { products } from 'src/_mock/products';

import ProductCard from '../products/product-card';
import ProductSort from '../products/product-sort';
import ProductFilters from '../products/product-filters';
import { useQuery } from 'react-query';
import { axiosInstance } from 'src/utils/axiosInstance';
import OrderCard from './order-card';
import { typography } from 'src/theme/typography';
import axios from 'axios';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------
export default function OrdersView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/orders', { withCredentials: true });
        setOrders(response.data.order);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const handleCancelOrder = async (id) => {
    try {
      await axios.put(`http://localhost:3000/orders/${id}/cancel`, null, { withCredentials: true });
    } catch (err) {
      console.log(`the error happening is${err.message}`);
    }

    const response = await axios.get('http://localhost:3000/orders', { withCredentials: true });
    setOrders(response.data.order);
  };

  const handleChangeOrderState = async ({ orderID, newStatus }) => {
    console.log('does i got to the handle change order state part or not ');
    try {
      await axios.put(`http://localhost:3000/orders/${orderID}`, { status: newStatus }, { withCredentials: true });
    } catch (err) {
      console.log(`the error happening is${err.message}`);
    }

    const response = await axios.get('http://localhost:3000/orders', { withCredentials: true });
    setOrders(response.data.order);
  };

  if (loading) return <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />;
  if (error) return <Typography variant="body1">Error fetching orders: {error.message}</Typography>;

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Previous Orders
      </Typography>

      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters openFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} />

          <ProductSort />
        </Stack>
      </Stack>

      {orders ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 100 }}>
          {orders.map((order) => (
            <OrderCard
              order={order}
              key={order.id}
              onCancelOrder={() => handleCancelOrder(order._id)}
              onChangeOrderStatus={(newStatus) => handleChangeOrderState({ orderID: order._id, newStatus })}
            />
          ))}
        </Box>
      ) : (
        <typography>There is no orders to show</typography>
      )}
      {/* <Stack
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      ></Stack> */}
    </Container>
  );
}
