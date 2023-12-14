import { useState } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TodayIcon from '@mui/icons-material/Today';

import Iconify from 'src/components/iconify';
import { axiosInstance } from '../../utils/axiosInstance';

// ----------------------------------------------------------------------

export default function DoctorFilter({ onSearch }) {
  const [filters, setFilters] = useState({
    name: '',
    specialty: '',
    date: ''
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
          name={'specialty'}
          onChange={handleChange}
          placeholder="Search by speciality..."
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
        <TextField
          name="date"
          onChange={handleChange}
          placeholder="Search by date..."
          type="datetime-local"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TodayIcon />
              </InputAdornment>
            )
          }}
          inputProps={{
            step: 60 // Set step to 60 (minutes) to use a 24-hour format
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
