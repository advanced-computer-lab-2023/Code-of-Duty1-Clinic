import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const DetailedViewModal = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          User Details
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Username: {user.username}
          <br />
          Email: {user.email}
          <br />
          Status: {user.status}
        </Typography>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default DetailedViewModal;
