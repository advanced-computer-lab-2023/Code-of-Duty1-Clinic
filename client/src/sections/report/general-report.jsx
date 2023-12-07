import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Typography } from '@mui/material';

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

export default function GeneralReport() {
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const report = await axios.get('http://localhost:3000/report', {
          withCredentials: true
        });
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
  }, []);
  if (error) return <Typography>error has occurred </Typography>;
  return (
    <div>
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
