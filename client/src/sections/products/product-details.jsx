import PropTypes from 'prop-types';
import axios from 'axios';
import { useState, useEffect } from 'react';
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
import { MedicineImageUpload } from '../upload/medicineImageUpload';
import ProductEdit from './product-edit';
// ----------------------------------------------------------------------

export default function ProductDetails({ product, onCloseProductDetails }) {
  const user = localStorage.getItem('userRole');
  const [medicineProduct, setMedicineProduct] = useState(product);
  const [isArchived, setIsArchived] = useState(product.isArchived);
  const [uploadImg, setUploadImg] = useState('');
  const [alternativeProducts, setAlternativeProducts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const alternatives = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/medicine`);
      setAlternativeProducts(response.data.result);
      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    alternatives();
  }, []);
  const renderAlternatives = () => {
    if (filteredAlternatives.length === 0) {
      return (
        <Box
          sx={{
            textAlign: 'center',
            paddingTop: 4,
            paddingLeft: 7
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            No alternatives available.
          </Typography>
        </Box>
      );
    }

    return (
      <Card sx={{ mt: 3 }}>
        <Typography variant="h3" mt={3}>
          Alternative Products
        </Typography>
        {filteredAlternatives.map((alternative) => (
          <Card key={alternative._id} sx={{ mt: 2, p: 2, borderRadius: 8, boxShadow: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {alternative.name}
            </Typography>
            <Typography color="textSecondary">{alternative.description}</Typography>
          </Card>
        ))}
      </Card>
    );
  };
  // useEffect(() => {
  //   const loadMedicineProduct = async () => {
  //     try {
  //       medicines = await axios.get(`http://localhost:3000/medicine/${product._id}`, { withCredentials: true });
  //       if (medicines.data.result[0]) {
  //         setMedicineProduct(medicines.result[0]);
  //       }
  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   };
  //   loadMedicineProduct();
  // }, []);
  const handleArchiveClick = async () => {
    try {
      await axios.put(
        `http://localhost:3000/medicine/${medicineProduct._id}`,
        { isArchived: !medicineProduct.isArchived },
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
      color={(medicineProduct.status === 'sale' && 'error') || 'info'}
      sx={{
        textTransform: 'uppercase'
      }}
    >
      {medicineProduct.numStock != 0 ? 'available' : 'sold out'}
      {/* suppose here to be the medicineProduct.status */}
    </Label>
  );

  const renderImg = !medicineProduct.image ? (
    <Box
      component="img"
      alt={medicineProduct.name}
      src={'assets/images/avatars/avatar_1.jpg'}
      sx={{
        maxWidth: 200,
        maxHeight: 200
      }}
    />
  ) : (
    <Box
      sx={{
        maxHeight: 200,
        maxWidth: 200
      }}
    >
      <MedicineImage MedicineID={medicineProduct._id} />
    </Box>
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      &nbsp;
      {fCurrency(medicineProduct.price)}
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
  const handleAddNewImageClick = (medicineID) => {
    setUploadImg(medicineID);
  };
  const renderAddNewImageButton = (
    <Button
      variant="outlined"
      sx={{ textTransform: 'uppercase' }}
      onClick={() => {
        handleAddNewImageClick(medicineProduct._id);
      }}
    >
      add New Image
    </Button>
  );

  const renderDescription = (
    <Stack spacing={2}>
      <Stack>
        <Typography fontWeight="bold">Description : </Typography>
        <Typography>{medicineProduct.description} </Typography>
      </Stack>
      <Stack direction={'row'} spacing={1}>
        <Typography fontWeight="bold">Medical use : </Typography>
        <Typography>{medicineProduct.medicalUse} </Typography>
      </Stack>
      <Stack direction={'row'} spacing={1}>
        <Typography fontWeight="bold">Active Ingredients :</Typography>
        {medicineProduct.activeIngredients && medicineProduct.activeIngredients.length > 0 ? (
          <Typography>{medicineProduct.activeIngredients.join(', ')}</Typography>
        ) : (
          <Typography>No active ingredients available</Typography>
        )}
      </Stack>
    </Stack>
  );
  const handleCloseUploadImage = async () => {
    try {
      const medicines = await axios.get(`http://localhost:3000/medicine/${medicineProduct._id}`, {
        withCredentials: true
      });
      if (medicines.result[0]) {
        setMedicineProduct(medicines.result[0]);
      }
    } catch (err) {
      console.log(err.message);
    }

    setUploadImg('');
  };
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = async () => {
    try {
      const medicines = await axios.get(`http://localhost:3000/medicine/${product._id}`, { withCredentials: true });
      if (medicines.data.result[0]) {
        setMedicineProduct(medicines.data.result[0]);
      }
    } catch (err) {
      console.log(err.message);
    }
    setIsEditModalOpen(false);
  };
  const renderEditMedicineButton = (
    <Button variant="outlined" sx={{ textTransform: 'uppercase' }} onClick={handleOpenEditModal}>
      Edit Medicine
    </Button>
  );
  if (isEditModalOpen) return <ProductEdit onClose={handleCloseEditModal} productID={product._id} />;
  if (uploadImg != '') {
    return (
      <Card>
        <IconButton onClick={handleCloseUploadImage} color="primary" aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <MedicineImageUpload medicineID={medicineProduct._id} />
      </Card>
    );
  }

  const filteredAlternatives =
    alternativeProducts?.filter((alternative) =>
      alternative.activeIngredients.some((ingredient) => medicineProduct.activeIngredients.includes(ingredient))
    ) || [];
  return (
    <Box>
      <Card>
        <IconButton onClick={onCloseProductDetails} color="primary" aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Stack sx={{ position: 'relative' }} direction="row">
          {renderImg}
          <Stack direction={'row'} justifyContent={'space-between'} sx={{ width: '100%', marginLeft: 2 }}>
            {renderDescription}
            <Stack spacing={2} sx={{ marginRight: 1 }}>
              {medicineProduct._id && renderStatus}
              {user === 'Pharmacist' && renderArchiveButton}
              {user == 'Pharmacist' && renderAddNewImageButton}
              {user == 'Pharmacist' && renderEditMedicineButton}
            </Stack>
          </Stack>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-evenly'}>
          <Stack spacing={1} sx={{ p: 3 }}>
            <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
              {medicineProduct.name}
            </Link>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pl: 2 }}>
              {/* <ColorPreview colors={['red', 'blue', 'yellow', 'green']} /> */}
              {/* it suppose here to be medicineProduct.colors */}
              {renderPrice}
            </Stack>
          </Stack>
          {user === 'Pharmacist' && (
            <Stack spacing={1} sx={{ p: 3 }}>
              <Typography color="inherit" underline="hover" variant="subtitle2">
                Items left in the stock
              </Typography>
              <Typography color="inherit" underline="hover" variant="subtitle2" sx={{ pl: 7 }}>
                {medicineProduct.numStock}
              </Typography>
            </Stack>
          )}
          {user === 'Pharmacist' && (
            <Stack spacing={1} sx={{ p: 3 }}>
              <Typography color="inherit" underline="hover" variant="subtitle2">
                Items sold
              </Typography>
              <Typography color="inherit" underline="hover" variant="subtitle2" sx={{ pl: 4 }}>
                {medicineProduct.numSold}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Card>
      {renderAlternatives()}
    </Box>
  );
}

ProductDetails.propTypes = {
  product: PropTypes.object
};
