import { useState } from 'react';

// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProductSearch({ onSearch }) {
  const [filters, setFilters] = useState({
    name: '',
    medicalUse: ''
  });

  const handleChange = (event) => {
    event.preventDefault();

    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" m={3}>
      <Stack direction="row" alignItems="center">
        <TextField
          name={'name'}
          onChange={handleChange}
          placeholder="Search by name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            )
          }}
          sx={{ mr: 3 }}
        />
        <TextField
          name={'medicalUse'}
          onChange={handleChange}
          placeholder="Search by medical use..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            )
          }}
        />
      </Stack>

      <Stack sx={{ mr: 6 }}>
        <Button
          onClick={() => onSearch(filters)}
          variant="outlined"
          startIcon={<SearchIcon />}
          sx={{ minWidth: 130, minHeight: 50, fontSize: 16 }}
        >
          Search
        </Button>
      </Stack>
    </Stack>
  );
}
