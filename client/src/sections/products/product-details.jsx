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
        <Typography>Description : </Typography>
        <Typography>{medicineProduct.description} </Typography>
      </Stack>
      <Stack direction={'row'} spacing={1}>
        <Typography>medical use : </Typography>
        <Typography>{medicineProduct.medicalUse} </Typography>
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
    setIsEditMadalOpen(true);
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
    setIsEditMadalOpen(false);
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
                items left in the stock
              </Typography>
              <Typography color="inherit" underline="hover" variant="subtitle2" sx={{ pl: 7 }}>
                {medicineProduct.numStock}
              </Typography>
            </Stack>
          )}
          {user === 'Pharmacist' && (
            <Stack spacing={1} sx={{ p: 3 }}>
              <Typography color="inherit" underline="hover" variant="subtitle2">
                items sold
              </Typography>
              <Typography color="inherit" underline="hover" variant="subtitle2" sx={{ pl: 4 }}>
                {medicineProduct.numSold}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Card>
      {medicineProduct.numStock === 0 && (
        <Card>
          <Typography variant="h5" mt={3}>
            Alternative Products
          </Typography>
          {filteredAlternatives.map((alternative) => (
            <Card key={alternative._id}>
              <Typography>{alternative.name}</Typography>
            </Card>
          ))}
        </Card>
      )}
    </Box>
  );
}

ProductDetails.propTypes = {
  product: PropTypes.object
};
