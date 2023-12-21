import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';
import axios from 'axios';
import ProductDetails from '../product-details';
import { axiosInstance } from '../../../utils/axiosInstance';
import ProductSearch from '../product-search';
import Iconify from 'src/components/iconify/iconify';

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

    handleCloseMedicineForm();
  };

  return (
    <Container sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Products
      </Typography>

      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters openFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} />
          <ProductSort />
          <ProductSearch onSearch={onSearch} />
          {user === 'Pharmacist' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenMedicineForm}
              sx={{ maxHeight: 60, maxWidth: 150 }}
            >
              Add Medicine
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
            <Button onClick={handleCloseUploadImageForm}>Skip</Button>
            {product && <MedicineImageUpload medicineID={product._id} />}
          </DialogActions>
        </Dialog>
      </Stack>

      <Grid container spacing={3} justifyContent="center">
        {products
          .filter((product) => !(user === 'Patient' && product.isArchived))
          .map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={3}>
              <ProductCard product={product} onDetailsview={handleExpandProductDetails} addableToCart={localStorage.getItem('userRole') === 'Patient'} />
            </Grid>
          ))}
      </Grid>

      <ProductCartWidget />
    </Container>
  );
}
