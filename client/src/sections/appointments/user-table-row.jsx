import { useState } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';

import { axiosInstance } from '../../utils/axiosInstance';

export default function UserTableRow({
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');

  const cancelAppointment = async () => {
    await axiosInstance
      .delete(`me/appointments/${_id}`)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        setOpenSnackbar(true);
        setMessage(err.response.data.message);
      });
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
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
          sx: { width: 140 }
        }}
      >
        <MenuItem onClick={() => console.log('clicked')}>
          <Iconify icon="carbon:request-quote" sx={{ mr: 2 }} />
          Follow up
        </MenuItem>
        <MenuItem onClick={() => console.log('clicked')}>
          <Iconify icon="uis:schedule" sx={{ mr: 2 }} />
          Reschedule
        </MenuItem>
        <Divider />
        <MenuItem onClick={cancelAppointment}>
          <Iconify icon="material-symbols:cancel" sx={{ mr: 2 }} />
          Cancel
        </MenuItem>
      </Popover>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackBar} message={message} />
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
