import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, getComparator } from '../utils';
import { axiosInstance } from '../../../utils/axiosInstance';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';

export default function AppointmentsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('doctorID');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const myName = localStorage.getItem('userName');

  const [filterValues, setFilterValues] = useState({
    startDate: null,
    endDate: null,
    status: ''
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const {
    isLoading: isLoadingData,
    error,
    data: appointments,
    refetch
  } = useQuery(
    `Appointments`,
    async () => {
      const params = {};

      if (filterValues.startDate) params.startDate = new Date(filterValues.startDate).toISOString();
      if (filterValues.endDate) params.endDate = new Date(filterValues.endDate).toISOString();
      if (filterValues.status) params.status = filterValues.status;

      const appointments = await axiosInstance.get('/me/appointments', { params }).then((res) => res.data.result || []);

      return appointments;
    },
    {
      refetchOnWindowFocus: false
    }
  );

  useEffect(() => {
    refetch();
  }, [filterValues]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = appointments.map((n) => n.doctorID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilters = () => {
    fetchAppointments();
    handleFilterClose();
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  if (isLoadingData) return <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />;
  if (error) return <Typography>An error has occurred: {error.response?.data.message || 'Network error'}</Typography>;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Appointments</Typography>

        <Button variant="contained" color="primary" onClick={handleFilterButtonClick}>
          Filter
        </Button>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <Box p={2} style={{ width: '300px' }}>
            <TextField
              id="startDate"
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              onChange={(e) => setFilterValues({ ...filterValues, startDate: e.target.value })}
              value={filterValues.startDate || ''}
            />
            {filterValues.startDate && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => setFilterValues({ ...filterValues, startDate: null })}
                sx={{ mt: 1 }}
              >
                Clear Start Date
              </Button>
            )}
            <TextField
              id="endDate"
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              onChange={(e) => setFilterValues({ ...filterValues, endDate: e.target.value })}
              value={filterValues.endDate || ''}
            />
            {filterValues.endDate && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => setFilterValues({ ...filterValues, endDate: null })}
                sx={{ mt: 1 }}
              >
                Clear End Date
              </Button>
            )}
            <Autocomplete
              options={['Upcoming', 'Completed', 'Cancelled', 'Pending']}
              renderInput={(params) => <TextField {...params} label="Status" fullWidth margin="normal" />}
              onChange={(e, value) => setFilterValues({ ...filterValues, status: value })}
              value={filterValues.status || ''}
            />
          </Box>
        </Popover>
      </Stack>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={appointments.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'patientName', label: "Doctor's Name" },
                  { id: 'doctorName', label: "Patient's Name" },
                  { id: 'status', label: 'Status' },
                  { id: 'sessionPrice', label: 'Session Price' },
                  { id: 'day', label: 'Day' },
                  { id: 'startDate', label: 'Start time' },
                  { id: 'endDate', label: 'End time' },
                  { id: 'isFollowUp', label: 'Is Follow up' },
                  { id: '' }
                ]}
              />
              <TableBody>
                {appointments
                  .toReversed()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    let startDate = new Date(row.startDate);
                    startDate.setHours(startDate.getHours() - 2);
                    const from = startDate.toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    });

                    let endDate = new Date(row.endDate);
                    endDate.setHours(endDate.getHours() - 2);
                    const to = endDate.toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    });

                    const day = startDate.toDateString();

                    return (
                      <UserTableRow
                        key={row._id}
                        _id={row._id}
                        patientName={row.patientName == myName ? 'Me' : row.patientName}
                        doctorID={row.doctorID._id}
                        doctorName={row.doctorName == myName ? 'Me' : row.doctorName}
                        status={row.status}
                        sessionPrice={row.sessionPrice}
                        day={day}
                        startDate={from}
                        endDate={to}
                        isFollowUp={row.isFollowUp}
                        selected={selected.indexOf(row._id) !== -1}
                        setMessage={setMessage}
                        setOpenSnackbar={setOpenSnackbar}
                      />
                    );
                  })}

                {appointments.length == 0 && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={appointments.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackBar} message={message} />
    </Container>
  );
}
