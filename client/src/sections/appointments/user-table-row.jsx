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

export default function UserTableRow({
  selected,
  _id,
  patientName,
  doctorName,
  status,
  sessionPrice,
  day,
  startDate,
  endDate,
  isFollowUp,
  handleClick
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
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {doctorName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{patientName}</TableCell>

        <TableCell>{status}</TableCell>

        <TableCell>{sessionPrice}</TableCell>

        <TableCell>{day}</TableCell>

        <TableCell>{startDate}</TableCell>

        <TableCell>{endDate}</TableCell>

        <TableCell>{isFollowUp ? 'Yes' : 'No'}</TableCell>
      </TableRow>
    </>
  );
}

UserTableRow.propTypes = {
  _id: PropTypes.string.isRequired,
  doctorName: PropTypes.string,
  patientName: PropTypes.string,
  status: PropTypes.string,
  sessionPrice: PropTypes.number,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  isFollowUp: PropTypes.bool,
  selected: PropTypes.bool,
  handleClick: PropTypes.func
};
