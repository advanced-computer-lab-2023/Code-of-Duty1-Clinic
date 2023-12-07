import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import GeneralReport from '../general-report';

export default function Report() {
  const [month, setMonth] = useState('');
  if (!month) return <GeneralReport />;
  return (
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
  );
}
