import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Typography, FormControl, InputLabel, Select, MenuItem, Stack, TextField, InputAdornment } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';

const columns = [
  { field: 'medicine', headerName: 'Medicine', width: 150 },
  { field: 'totalSales', headerName: 'Total Sales', width: 150 },
  { field: 'totalItemsSaled', headerName: 'Total Items Saled', width: 180 }
  //   {
  //     field: 'lastModifiedDate',
  //     headerName: 'Last Modified Date',
  //     width: 180,
  //     valueFormatter: (params) => {
  //       // Format the date using Intl.DateTimeFormat
  //       const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  //       return new Intl.DateTimeFormat('en-US', options).format(params.value);
  //     }
  //   }
];

// const rows = [{ id: 1, totalSales: 2000, totalItemsSaled: 200, lastModifiedDate: Date.now() }];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const monthMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
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
      // The date is not valid
      setSelectedDate(null);
    } else {
      const selectedDate = new Date(inputValue);
      setSelectedDate(selectedDate);
      console.log(selectedDate);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let report;
        if (selectedDate) {
          const month = selectedDate.getMonth() + 1;
          const day = selectedDate.getDate();
          const year = selectedDate.getFullYear();
          console.log(`the day is ${day}`);
          report = await axios.get(`http://localhost:3000/report?month=${month}&day=${day}&year=${year}`, {
            withCredentials: true
          });
        } else if (selectedMonth == '') {
          report = await axios.get('http://localhost:3000/report', {
            withCredentials: true
          });
        } else {
          report = await axios.get(`http://localhost:3000/report?month=${monthMap[selectedMonth]}`, {
            withCredentials: true
          });
        }

        const rowsArray = Object.entries(report.data.filteredOrder).map(([medicine, data]) => ({
          id: data.id, // You can use the medicine name as the id
          medicine,
          totalSales: data.totalPrice,
          totalItemsSaled: data.count
        }));
        console.log(rowsArray);
        setRows(rowsArray);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedDate]);
  if (error) return <Typography>error has occurred </Typography>;
  return (
    <div>
      <Stack sx={{ mr: 6 }} direction={'row'}>
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
          name={'date'}
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
        />
      </Stack>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 }
            }
          }}
          pageSizeOptions={[5, 10]}
        />
      </div>
      {/* Display total outside the DataGrid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
        <div>Total</div>
        <div>{`Total Sales: ${rows.reduce(
          (total, row) => total + row.totalSales,
          0
        )}$, Total Items Saled: ${rows.reduce((total, row) => total + row.totalItemsSaled, 0)}`}</div>
      </div>
    </div>
  );
}
