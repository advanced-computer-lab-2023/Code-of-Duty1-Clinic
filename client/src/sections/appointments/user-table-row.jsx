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
import Divider from '@mui/material/Divider';

import DoctorSlots from './doctor-slots';

import { axiosInstance } from '../../utils/axiosInstance';

export default function UserTableRow({
  _id,
  patientName,
  doctorID,
  doctorName,
  status,
  sessionPrice,
  day,
  startDate,
  endDate,
  isFollowUp,
  setMessage,
  setOpenSnackbar
}) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [weekSlots, setWeekSlots] = useState({});
  const [functionality, setFunctionality] = useState('');

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

  const approveRejectAppointment = async (isApproved) => {
    axiosInstance
      .put(`me/appointments/${_id}/followUp`, {
        isApproved
      })
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

  const handleClick = (functionality) => {
    axiosInstance.get(`/doctors/${doctorID}/availableAppointments`).then((res) => {
      setFunctionality(functionality);
      setWeekSlots(res.data.result);
      setOpenModal(true);
    });
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
        {status == 'Completed' && (
          <MenuItem onClick={() => handleClick('Follow Up')}>
            <Iconify icon="carbon:request-quote" sx={{ mr: 2 }} />
            Follow up
          </MenuItem>
        )}
        {status == 'Upcoming' && (
          <>
            <MenuItem onClick={() => handleClick('Reschedule')}>
              <Iconify icon="uis:schedule" sx={{ mr: 2 }} />
              Reschedule
            </MenuItem>
            <Divider />
            <MenuItem onClick={cancelAppointment}>
              <Iconify icon="material-symbols:cancel" sx={{ mr: 2 }} />
              Cancel
            </MenuItem>
          </>
        )}
        {status == 'Pending' && (
          <>
            <MenuItem onClick={() => approveRejectAppointment(true)}>
              <Iconify icon="mdi:approve" sx={{ mr: 2 }} />
              Approve
            </MenuItem>
            <MenuItem onClick={() => approveRejectAppointment(false)}>
              <Iconify icon="material-symbols:cancel" sx={{ mr: 2 }} />
              Reject
            </MenuItem>
          </>
        )}
        {status == 'Cancelled' && (
          <Typography variant="body2" sx={{ px: 2, py: 1 }}>
            No Options
          </Typography>
        )}
      </Popover>

      <DoctorSlots
        functionlity={functionality}
        _id={_id}
        weekSlots={weekSlots}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setMessage={setMessage}
        setOpenSnackbar={setOpenSnackbar}
      />
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
