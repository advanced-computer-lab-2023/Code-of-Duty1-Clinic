import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Typography, FormControl, InputLabel, Select, MenuItem, Stack, TextField, InputAdornment, IconButton, Alert } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import ClearIcon from '@mui/icons-material/Clear';

const columns = [
  { field: 'medicine', headerName: 'Medicine', width: 150 },
  { field: 'totalSales', headerName: 'Total Sales', width: 150 },
  { field: 'totalItemsSaled', headerName: 'Total Items Saled', width: 180 }
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const monthMap = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

export default function GeneralReport() {
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (isNaN(new Date(inputValue))) {
      setSelectedDate(null);
    } else {
      const selectedDate = new Date(inputValue);
      setSelectedDate(selectedDate);
    }
  };

  const clearDate = () => {
    setSelectedDate(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let report;
        if (selectedDate) {
          const month = selectedDate.getMonth() + 1;
          const day = selectedDate.getDate();
          const year = selectedDate.getFullYear();
          report = await axios.get(`http://localhost:3000/report?month=${month}&day=${day}&year=${year}`, {
            withCredentials: true
          });
        } else if (selectedMonth === '') {
          report = await axios.get('http://localhost:3000/report', {
            withCredentials: true
          });
        } else {
          report = await axios.get(`http://localhost:3000/report?month=${monthMap[selectedMonth]}`, {
            withCredentials: true
          });
        }

        const rowsArray = Object.entries(report.data.filteredOrder).map(([medicine, data]) => ({
          id: data.id,
          medicine,
          totalSales: data.totalPrice,
          totalItemsSaled: data.count
        }));
        setRows(rowsArray);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedDate]);

  return (
    <div>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          An error occurred while fetching data.
        </Alert>
      )}

      <Stack direction="row" spacing={2} alignItems="flex-end" mb={2}>
        <FormControl fullWidth>
          <InputLabel id="month-selector-label">Select Month</InputLabel>
          <Select
            labelId="month-selector-label"
            id="month-selector"
            value={selectedMonth}
            onChange={handleMonthChange}
            label="Select Month"
          >
            {months.map((month, index) => (
              <MenuItem key={index} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            ),
            endAdornment: selectedDate && (
              <InputAdornment position="end">
                <IconButton onClick={clearDate}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          pageSizeOptions={[5, 10]}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '16px' }}>
        <Typography variant="h6" color="primary">
          Total
        </Typography>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <div>
            <Typography variant="body1">Total Sales:</Typography>
            <Typography variant="h6">{`$${rows.reduce((total, row) => total + row.totalSales, 0)}`}</Typography>
          </div>
          <div>
            <Typography variant="body1">Total Items Saled:</Typography>
            <Typography variant="h6">{rows.reduce((total, row) => total + row.totalItemsSaled, 0)}</Typography>
          </div>
        </div>
      </div>

    </div>
  );
}
