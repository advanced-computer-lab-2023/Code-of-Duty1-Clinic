import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  upcomingAppointments,
  setUpcomingAppointments,
  fetchMyPatients
}) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <button
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: upcomingAppointments ? '#0000FF' : '#E9E9E9',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            margin: '10px 0',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease'
          }}
          onClick={() => {
            setUpcomingAppointments(!upcomingAppointments);
            fetchMyPatients();
          }}
        >
          Upcoming Patients
        </button>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  upcomingAppointments: PropTypes.bool,
  setUpcomingAppointments: PropTypes.func,
  fetchMyPatients: PropTypes.func
};
