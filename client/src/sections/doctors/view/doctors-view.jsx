import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import DoctorCard from '../doctor-card';

export default function DoctorsView() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Doctors
      </Typography>
      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          Search
        </Stack>
      </Stack>
      <DoctorCard />
      {/* <Grid container spacing={3}> */}
      {/* {products.map((product) => ( */}
      {/* <Grid key={product.id} xs={12} sm={6} md={3}> */}
      {/* <ProductCard product={product} /> */}
      {/* </Grid> */}
      {/* ))} */}
      {/* </Grid> */}
    </Container>
  );
}
