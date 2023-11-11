import { useState, useEffect } from 'react';
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

export default function UserPage() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('doctorID'); // Set default ordering based on doctorID
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get('/me/appointments');
        setAppointments(response.data.result);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []); // Fetch appointments on component mount

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = appointments.map((n) => n.doctorID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, doctorID) => {
    const selectedIndex = selected.indexOf(doctorID);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, doctorID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleGetUpcomingAppointments = async () => {
    try {
      const response = await axiosInstance.get('/me/appointments?s=Upcoming');
      setAppointments(response.data.result);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };

  const handleGetPastAppointments = async () => {
    try {
      const response = await axiosInstance.get('/me/appointments?s=Completed');
      setAppointments(response.data.result);
    } catch (error) {
      console.error('Error fetching past appointments:', error);
    }
  };

  const handleGetAllAppointments = async () => {
    try {
      const response = await axiosInstance.get('/me/appointments');
      setAppointments(response.data.result);
    } catch (error) {
      console.error('Error fetching all appointments:', error);
    }
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Appointments</Typography>

        <Button
          variant="contained"
          color="inherit"
          sstartIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleGetAllAppointments}
        >
          Get All Appointments
        </Button>

        <Button
          variant="contained"
          color="inherit"
          sstartIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleGetPastAppointments}
        >
          Get Past Appointments
        </Button>
        <Button
          variant="contained"
          color="inherit"
          sstartIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleGetUpcomingAppointments}
        >
          Get Upcoming Appointments
        </Button>
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
                  { id: 'patientName', label: 'Patient Name' },
                  { id: 'doctorName', label: 'Doctor Name' },
                  { id: 'status', label: 'Status' },
                  { id: 'sessionPrice', label: 'Session Price' },
                  { id: 'startDate', label: 'Start Date' },
                  { id: 'endDate', label: 'End Date' },
                  { id: 'isFollowUp', label: 'Follow Up' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {appointments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      _id={row._id}
                      patientName={row.patientName}
                      doctorName={row.doctorName}
                      status={row.status}
                      sessionPrice={row.sessionPrice}
                      startDate={row.startDate}
                      endDate={row.endDate}
                      isFollowUp={row.isFollowUp}
                      selected={selected.indexOf(row.doctorID) !== -1}
                      handleClick={(event) => handleClick(event, row.doctorID)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, appointments.length)}
                />
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
    </Container>
  );
}
