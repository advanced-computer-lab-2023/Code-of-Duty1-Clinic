import PropTypes from 'prop-types';
import axios from 'axios';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
// import { ColorPreview } from 'src/components/color-utils';
import Iconify from 'src/components/iconify/iconify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  let count = 1;

  const handleAddToCart = async (id, clickNumber) => {
    if (clickNumber === 1) {
      try {
        await axios.post('http://localhost:3000/cart', { medID: id }, { withCredentials: true });
        toast.success('Product added to the cart successfully!', {
          position: toast.POSITION.TOP_RIGHT
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Error adding to cart. Please try again later.', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } else {
      alert('The item is already added to the cart!');
    }
    console.log(count);
    count++;
  };
  const renderStatus = (
    <Label
      variant="filled"
      color={(product.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase'
      }}
    >
      {product.numStock != 0 ? 'available' : 'sold out'}
      {/* suppose here to be the product.status */}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={'assets/images/avatars/avatar_1.jpg'}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute'
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      {/* <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {
          product.price
          // && fCurrency(product.price)
        }
      </Typography> */}
      &nbsp;
      {fCurrency(product.price)}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {product._id && renderStatus}
        {/* suppose here to be the product status */}
        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.name}
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={['red', 'blue', 'yellow', 'green']} /> */}
          {/* it suppose here to be product.colors */}
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => handleAddToCart(product._id, count)}
          >
            add to cart
          </Button>
          {renderPrice}
        </Stack>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object
};
