import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { axiosInstance } from 'src/utils/axiosInstance';
import axios from 'axios';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(16),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
  borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

export default function CartWidget() {
  const [cartItems, setCartItems] = useState(0);
  const url = `http://localhost:3000/cart`;
  const fetchCartData = async () => {
    try {
      const response = await axios.get(url, { withCredentials: true });
      const items = response.data.result.items.reduce((acc, item) => acc + 1, 0);
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, 0);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/cart');
  };

  return (
    <StyledRoot onClick={handleClick}>
      <Badge showZero badgeContent={cartItems} color="error" max={99}>
        <Iconify icon="eva:shopping-cart-fill" width={24} height={24} />
      </Badge>
    </StyledRoot>
  );
}
