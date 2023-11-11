import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';

export default function TableEmptyRows({ height, emptyRows }) {
  return (
    <TableRow style={{ height }}>
      <TableCell colSpan={6}>
        <Box
          sx={{
            textAlign: 'center',
            py: 3,
          }}
        >
          {emptyRows > 0 && (
            <span>
              Showing {emptyRows} {emptyRows === 1 ? 'result' : 'results'} on this page.
            </span>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}

TableEmptyRows.propTypes = {
  height: PropTypes.number.isRequired,
  emptyRows: PropTypes.number.isRequired,
};
