import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { axiosInstance } from '../../../utils/axiosInstance';

import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const user = localStorage.getItem('userRole');

  const [patients, setPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState(false);

  const fetchMyPatients = async () => {
    if (upcomingAppointments) {
      try {
        const res = await axiosInstance.get(`/patients/?status=Upcoming`);
        setPatients(res.data.result);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axiosInstance.get(`/patients`);
        setPatients(res.data.result);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    fetchMyPatients();
  }, [upcomingAppointments]);

  //'/assets/images/avatars/avatar_1.jpg'
  //console.log(users);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = patients.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: patients,
    comparator: getComparator(order, orderBy),
    filterName
  });

  const navigate = useNavigate();

  const handleViewHealthRecords = (patientID) => {
    navigate(`/health-record/${patientID}`);
  };

  const handleViewPrescriptions = (patientID) => {
    navigate(`/prescription/${patientID}`);
  };

  const notFound = !dataFiltered.length && !!filterName;
  if (user === 'Doctor') {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Patients</Typography>
        </Stack>

        <Card>
          <UserTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            upcomingAppointments={upcomingAppointments}
            setUpcomingAppointments={setUpcomingAppointments}
            fetchMyPatients={fetchMyPatients}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={patients.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'phone', label: 'Phone' },
                    { id: 'email', label: 'Email' },
                    { id: 'gender', label: 'Gender' },
                    // { id: 'isVerified', label: 'Verified', align: 'center' },
                    // { id: 'status', label: 'Status' },
                    { id: '' }
                  ]}
                />
                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <UserTableRow
                      key={row.id}
                      id={row._id}
                      name={row.name}
                      phone={row.phone}
                      status={row.status}
                      email={row.email}
                      gender={row.gender}
                      avatarUrl="/assets/images/avatars/avatar_1.jpg"
                      isVerified={row.isVerified}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      viewProfile={() => console.log('view profile')}
                      viewHealthRecords={() => {
                        console.log('view health records' + row._id);
                        handleViewHealthRecords(row._id);
                      }}
                      viewPrescriptions={() => {
                        console.log('view prescriptions');
                        handleViewPrescriptions(row._id);
                      }}
                    />
                  ))}

                  <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, patients.length)} />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={patients.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    );
  } else {
    return (
      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 480,
            mx: 'auto',
            display: 'contents',
            minHeight: '80vh',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h3" sx={{ mb: 3 }}>
            Sorry, You aren't Authenticated!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            You have to be a doctor to view this page. Go to the registration Page and register to get access.
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/illustration_404.svg"
            sx={{
              margin: '0 auto',
              display: 'block',
              height: 260,
              my: { xs: 5, sm: 10 }
            }}
          />
        </Box>
      </Container>
    );
  }
}
