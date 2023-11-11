import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  _id,
  doctorID,
  patientID,
  status,
  sessionPrice,
  startDate,
  endDate,
  isFollowUp,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Adjust the properties based on the appointment data */}
            <Typography variant="subtitle2" noWrap>
              {_id}
            </Typography>
          </Stack>
        </TableCell>

        {/* Adjust the TableCell content based on the appointment data */}
        <TableCell>{doctorID}</TableCell>
        <TableCell>{patientID}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{sessionPrice}</TableCell>
        <TableCell>{startDate}</TableCell>
        <TableCell>{endDate}</TableCell>
        <TableCell align="center">{isFollowUp ? 'Yes' : 'No'}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        {/* Adjust the menu items based on the requirements */}
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  _id: PropTypes.string,
  doctorID: PropTypes.string,
  patientID: PropTypes.string,
  status: PropTypes.string,
  sessionPrice: PropTypes.number,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  isFollowUp: PropTypes.bool,
  handleClick: PropTypes.func,
  selected: PropTypes.bool,
};
