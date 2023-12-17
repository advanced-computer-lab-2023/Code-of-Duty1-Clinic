import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// import { products } from 'src/_mock/products';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';
import axios from 'axios';
import ProductDetails from '../product-details';
import { axiosInstance } from '../../../utils/axiosInstance';
import ProductSearch from '../product-search';
import Iconify from 'src/components/iconify/iconify';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { MedicineImageUpload } from 'src/sections/upload/medicineImageUpload';
// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandProductDetails, setExpandProductDetails] = useState(false);
  const [product, setProduct] = useState(null);
  const [openMedicineForm, setOpenMedicineForm] = useState(false);
  const [openUploadImageForm, setOpenUploadImageForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    description: '',
    activeIngredients: [],
    numStock: 0,
    numSold: 0,
    price: 0,
    medicalUse: ''
    // Add other fields as needed
  });
  const user = localStorage.getItem('userRole');

  const handleExpandProductDetails = (product) => {
    setProduct(product);
    setExpandProductDetails(true);
  };
  const handleCloseProductDetails = async () => {
    const medicines = await axios.get('http://localhost:3000/medicine', {
      withCredentials: true
    });
    setProducts(medicines.data.result);
    setExpandProductDetails(false);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const medicines = await axios.get('http://localhost:3000/medicine', {
          withCredentials: true
        });
        setProducts(medicines.data.result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [openUploadImageForm]);

  useEffect(() => {
    // This effect will run every time 'product' changes
    console.log(product);
  }, [product]);
  const onSearch = async (filters) => {
    const params = {};

    if (filters.name) params.name = filters.name;
    if (filters.medicalUse) params.medicalUse = filters.medicalUse;

    await axiosInstance
      .get(`/medicine`, { params })
      .then((res) => setProducts(res.data.result))
      .catch((err) => console.log(err));
  };
  const handleOpenMedicineForm = () => {
    setOpenMedicineForm(true);
  };

  const handleCloseMedicineForm = () => {
    handleOpenUploadImageForm();
    setOpenMedicineForm(false);
  };
  const handleOpenUploadImageForm = () => {
    setOpenUploadImageForm(true);
  };
  const handleCloseUploadImageForm = () => {
    setOpenUploadImageForm(false);
  };

  const handleAddMedicine = async () => {
    try {
      const theNewMedicine = await axios.post(
        'http://localhost:3000/medicine',
        { ...newMedicine, isOverTheCounter: false },
        { withCredentials: true }
      );
      if (theNewMedicine.data.result) {
        setProducts((prev) => [...prev, theNewMedicine.data.result]);
        setProduct(theNewMedicine.data.result);
      }
    } catch (error) {
      console.log(error.message);
    }

    // TODO: Add logic to send the new medicine data to the server
    // For example, you can use axios.post('/add-medicine', newMedicine);
    // Don't forget error handling and loading states.
    handleCloseMedicineForm();
  };

  if (error) {
    return <Typography variant="body1">Error fetching orders: {error.message}</Typography>;
  }
  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }
  if (expandProductDetails) {
    return <ProductDetails product={product} onCloseProductDetails={handleCloseProductDetails} />;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
        {console.log(products)}
      </Typography>

      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters openFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} />

          <ProductSort />
          <ProductSearch onSearch={onSearch} />
          {user == 'Pharmacist' && (
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenMedicineForm}
              sx={{ maxHeight: 60, maxWidth: 150 }}
            >
              add medicine
            </Button>
          )}
        </Stack>
        <Dialog open={openMedicineForm} onClose={handleCloseMedicineForm}>
          <DialogTitle>Add Medicine</DialogTitle>
          <DialogContent>
            <TextField
              label="Medicine Name"
              fullWidth
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newMedicine.description}
              onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Medicine Price"
              fullWidth
              value={newMedicine.price}
              onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Medicine Stock"
              fullWidth
              value={newMedicine.numStock}
              onChange={(e) => setNewMedicine({ ...newMedicine, numStock: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Medicines sold"
              fullWidth
              value={newMedicine.numSold}
              onChange={(e) => setNewMedicine({ ...newMedicine, numSold: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Active Ingredients"
              fullWidth
              value={newMedicine.activeIngredients.join(', ')}
              onChange={(e) => setNewMedicine({ ...newMedicine, activeIngredients: e.target.value.split(', ') })}
              margin="normal"
            />
            <TextField
              label="Medical Use"
              fullWidth
              value={newMedicine.medicalUse}
              onChange={(e) => setNewMedicine({ ...newMedicine, medicalUse: e.target.value })}
              margin="normal"
            />

            {/* Add other fields as needed */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMedicineForm}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleAddMedicine}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openUploadImageForm} onClose={handleCloseUploadImageForm}>
          <DialogTitle>Upload Medicine Image </DialogTitle>

          <DialogActions>
            <Button onClick={handleCloseUploadImageForm}>skip</Button>
            {product && <MedicineImageUpload medicineID={product._id} />}
          </DialogActions>
        </Dialog>
      </Stack>

      <Grid container spacing={3}>
        {products
          .filter((product) => !(user === 'Patient' && product.isArchived))
          .map((product) => (
            <Grid key={product.id} xs={12} sm={6} md={3}>
              <ProductCard product={product} onDetailsview={handleExpandProductDetails} />
            </Grid>
          ))}
      </Grid>

      <ProductCartWidget />
    </Container>
  );
}
