import { useState } from 'react';

import { Container, Tab, Snackbar, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import EditDeletePackage from '../edit-delete-package';
import AddPackage from '../add-package';

export default function PackageAdmin() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;

    setOpenSnackbar(false);
  };

  //   if (isLoading) return 'Loading...';
  //   if (error) return 'An error has occurred: ' + error.message;

  return (
    <>
      <Container>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab value={0} label="Manage Packages" />
              <Tab value={1} label="Add New Package" />
            </TabList>
          </Box>
          <TabPanel value={0}>
            <EditDeletePackage setMessage={setMessage} setOpenSnackbar={setOpenSnackbar} />
          </TabPanel>
          <TabPanel value={1}>
            <AddPackage setMessage={setMessage} setOpenSnackbar={setOpenSnackbar} />
          </TabPanel>
        </TabContext>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackBar}
          message={message}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackBar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Container>
    </>
  );
}
