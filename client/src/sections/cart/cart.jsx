import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Dialog,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosInstance } from 'src/utils/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { set } from 'lodash';
export default function CartComponent() {
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const url = `http://localhost:3000/cart`;
  const fetchCartData = async () => {
    try {
      const response = await axiosInstance.get(url);
      const items = response.data.result.items.map((item) => ({
        id: item.id._id,
        name: item.id.name,
        count: item.count,
        price: item.id.price,
        numstock: item.id.numStock
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };
  const fetchAddressesData = async () => {
    try {
      const response = await axiosInstance.get('/me/info');
      const user = response.data.result[0];
      setAddresses(user.addresses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartData();
    fetchAddressesData();
  }, []);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.count * item.price, 0);
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => {
    // Update the address when the modal is closed
    if (!isModalOpen) {
      setAddress(newAddress);
    }
  }, [isModalOpen, newAddress]);

  const handleRemoveItem = async (itemId) => {
    try {
      const deleteUrl = `${url}/${itemId}`;
      await axiosInstance.delete(deleteUrl);
      setCartItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
      setOutOfStockItems((currentItems) => ({ ...currentItems, [itemId]: false }));
      fetchCartData();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleIncreaseItem = async (itemId) => {
    try {
      const item = cartItems.find((item) => item.id === itemId);
      if (!item) return;

      if (item.numstock - item.count <= 0) {
        setOutOfStockItems((currentItems) => ({ ...currentItems, [itemId]: true }));
        return;
      }

      const url2 = `${url}/increase/${itemId}`;
      await axiosInstance.patch(url2, { itemId });
      setCartItems((currentItems) =>
        currentItems.map((item) => (item.id === itemId ? { ...item, count: item.count + 1 } : item))
      );
      fetchCartData();
    } catch (error) {
      console.error('Error increasing item count:', error);
    }
  };

  const handleDecreaseItem = async (itemId) => {
    try {
      const item = cartItems.find((item) => item.id === itemId);
      if (item && item.count <= 1) {
        await handleRemoveItem(itemId);
      } else if (item) {
        const decreaseUrl = `${url}/decrease/${itemId}`;
        await axiosInstance.patch(decreaseUrl, { itemId });
        setCartItems((currentItems) =>
          currentItems.map((item) => (item.id === itemId ? { ...item, count: item.count - 1 } : item))
        );
      }
      if (item.numstock - item.count >= 0) {
        setOutOfStockItems((currentItems) => ({ ...currentItems, [itemId]: false }));
      }
      fetchCartData();
    } catch (error) {
      console.error('Error decreasing item count:', error);
    }
  };
  const handleCheckout = () => {
    const products = cartItems.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.count
    }));

    setIsLoading(true);

    axiosInstance
      .post(`/payment/session/oneTimePayment`, {
        products: products
      })
      .then((res) => {
        axiosInstance.post('/orders', {
          paymentType: 'Card',
          StripePaymentID: res.data.id,
          address
        });
        window.location.replace(res.data.url);
        console.log(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleSelectChange = (event) => {
    setAddress(event.target.value);
    // Add your logic for handling the selected address
  };

  const handleCashPayment = async () => {
    setIsLoading(true);
    await axiosInstance
      .post('/orders', {
        paymentType: 'Cash',
        address
      })
      .then((res) => navigate('/orders'))
      .finally(() => setIsLoading(false));
  };
  const handleAddNewAddress = () => {
    // Add logic to save the new address (e.g., send to the server)
    if (!addresses) {
      setAddresses([newAddress]);
    } else {
      setAddresses([...addresses, newAddress]);
    }
    setIsModalOpen(false);
  };

  const handleWalletPayment = async (amount) => {
    setIsLoading(true);

    try {
      await axios.put('http://localhost:3000/me/wallet', { amount }, { withCredentials: true });
      toast.success('Payment done successfully!', {
        position: toast.POSITION.TOP_RIGHT
      });
      await axiosInstance
        .post('/orders', {
          paymentType: 'Wallet',
          address
        })
        .then((res) => navigate('/orders'));

      setIsLoading(false);
    } catch (error) {
      toast.error('insuffcient amount of money in the wallet', {
        position: toast.POSITION.TOP_RIGHT
      });
      setIsLoading(false);
    }
  };
  const NewAddressModal = (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <DialogTitle>Add New Address</DialogTitle>
      <DialogContent>
        <TextField
          label="New Address"
          variant="outlined"
          fullWidth
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleAddNewAddress} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleNavigateToMedicine = () => {
    navigate('/products');
  };
  return (
    <>
      <Tooltip title="Go to Medicine">
        <IconButton
          onClick={handleNavigateToMedicine}
          sx={{
            position: 'fixed', // Use 'fixed' instead of 'absolute'
            top: 40,
            left: 280,
            zIndex: 2001
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Table
        sx={{
          border: '1px solid #ddd',
          '& thead th': {
            backgroundColor: '#f5f5f5',
            color: '#333',
            fontWeight: 'bold'
          },
          '& tbody td': {
            border: '1px solid #ddd'
          },
          '& tbody tr:hover': {
            backgroundColor: '#f1f1f1'
          }
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="subtitle1" align="center">
                  Your cart is empty
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center">
                  {item.count}
                  {outOfStockItems[item.id] && (
                    <Typography variant="body2" color="error">
                      This item is out of stock
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">${item.price.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleIncreaseItem(item.id)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDecreaseItem(item.id)}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: 'red',
                      '&:hover': {
                        color: 'white',
                        backgroundColor: 'red'
                      }
                    }}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
          <TableRow>
            <TableCell colSpan={3} align="right">
              Total Price
            </TableCell>
            <TableCell align="right">${totalPrice.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
        <Stack direction={'row'} spacing={2}>
          <Tooltip title={address ? '' : 'Please select or add an address'}>
            <div>
              <Button
                onClick={handleCheckout}
                disabled={!address || address === 'Add New Address' || isLoading}
                variant="outlined"
              >
                {isLoading ? 'Loading...' : 'Pay with card'}
              </Button>
            </div>
          </Tooltip>
          <Tooltip title={address ? '' : 'Please select or add an address'}>
            <div>
              <Button
                disabled={!address || address === 'Add New Address' || isLoading}
                onClick={() => handleWalletPayment(totalPrice * -1)}
                variant="outlined"
              >
                {isLoading ? 'Loading...' : 'Pay with wallet'}
              </Button>
            </div>
          </Tooltip>
          <Tooltip title={address ? '' : 'Please select or add an address'}>
            <div>
              <Button
                onClick={handleCashPayment}
                disabled={!address || address === 'Add New Address' || isLoading}
                variant="outlined"
              >
                {isLoading ? 'Loading...' : 'Pay with cash'}
              </Button>
            </div>
          </Tooltip>
        </Stack>
      </Table>
      <br />
      <InputLabel>Select Address</InputLabel>
      <Select label="Select Address" value={address} onChange={handleSelectChange} displayEmpty>
        <MenuItem value="" disabled>
          Select an address
        </MenuItem>
        {addresses && addresses.length > 0 ? (
          addresses.map((address, index) => (
            <MenuItem key={index} value={address}>
              {address}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            No addresses available
          </MenuItem>
        )}
        <MenuItem value="addNew" onClick={() => setIsModalOpen(true)} style={{ fontWeight: 'bold', color: 'blue' }}>
          <AddIcon /> Add New Address
        </MenuItem>
      </Select>
      {NewAddressModal}
    </>
  );
}
