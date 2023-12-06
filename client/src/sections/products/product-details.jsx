import PropTypes from 'prop-types';
import axios from 'axios';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
// import { ColorPreview } from 'src/components/color-utils';
import { MedicineImage } from '../upload/medicineImage';
import 'react-toastify/dist/ReactToastify.css';
// ----------------------------------------------------------------------

export default function ProductDetails({ product, onCloseProductDetails }) {
  const user = localStorage.getItem('userRole');
  const [isArchived, setIsArchived] = useState(product.isArchived);
  const handleArchiveClick = async () => {
    try {
      await axios.put(
        `http://localhost:3000/medicine/${product._id}`,
        { isArchived: !product.isArchived },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err.message);
    }
    setIsArchived(!isArchived);
  };
  const renderStatus = (
    <Label
      variant="filled"
      color={(product.status === 'sale' && 'error') || 'info'}
      sx={{
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
        maxWidth: 200,
        maxHeight: 200
      }}
    />
    // <MedicineImage MedicineID={product._id} />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      &nbsp;
      {fCurrency(product.price)}
    </Typography>
  );
  const renderArchiveButton = isArchived ? (
    <Button variant="outlined" sx={{ textTransform: 'uppercase' }} onClick={handleArchiveClick}>
      unArchive
    </Button>
  ) : (
    <Button variant="outlined" sx={{ textTransform: 'uppercase' }} onClick={handleArchiveClick}>
      Archive
    </Button>
  );

  const renderDescription = (
    <Stack spacing={2}>
      <Stack>
        <Typography>Description : </Typography>
        <Typography>{product.description} </Typography>
      </Stack>
      <Stack direction={'row'} spacing={1}>
        <Typography>medical use : </Typography>
        <Typography>{product.medicalUse} </Typography>
      </Stack>
    </Stack>
  );
  return (
    <Card>
      <IconButton onClick={onCloseProductDetails} color="primary" aria-label="back">
        <ArrowBackIcon />
      </IconButton>
      <Stack sx={{ position: 'relative' }} direction="row">
        {renderImg}
        <Stack direction={'row'} justifyContent={'space-between'} sx={{ width: '100%', marginLeft: 2 }}>
          {renderDescription}
          <Stack spacing={2} sx={{ marginRight: 1 }}>
            {product._id && renderStatus}
            {user === 'Pharmacist' && renderArchiveButton}
          </Stack>
        </Stack>
      </Stack>
      <Stack direction={'row'} justifyContent={'space-evenly'}>
        <Stack spacing={1} sx={{ p: 3 }}>
          <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
            {product.name}
          </Link>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pl: 2 }}>
            {/* <ColorPreview colors={['red', 'blue', 'yellow', 'green']} /> */}
            {/* it suppose here to be product.colors */}
            {renderPrice}
          </Stack>
        </Stack>
        {user === 'Pharmacist' && (
          <Stack spacing={1} sx={{ p: 3 }}>
            <Typography color="inherit" underline="hover" variant="subtitle2">
              items left in the stock
            </Typography>
            <Typography color="inherit" underline="hover" variant="subtitle2" sx={{ pl: 7 }}>
              {product.numStock}
            </Typography>
          </Stack>
        )}
        {user === 'Pharmacist' && (
          <Stack spacing={1} sx={{ p: 3 }}>
            <Typography color="inherit" underline="hover" variant="subtitle2">
              items sold
            </Typography>
            <Typography color="inherit" underline="hover" variant="subtitle2" sx={{ pl: 4 }}>
              {product.numSold}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

ProductDetails.propTypes = {
  product: PropTypes.object
};
