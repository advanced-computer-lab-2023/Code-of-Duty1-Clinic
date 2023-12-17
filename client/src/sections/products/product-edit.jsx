import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductEdit({ onClose, productID }) {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Description');
  const [infoText, setInfoText] = useState('');

  // Function to handle menu item selection
  const handleMenuItemChange = (event) => {
    setSelectedMenuItem(event.target.value);
  };

  // Function to handle the "Add" button click
  const handleEditDetails = async () => {
    if (infoText === '') {
      toast.error('Please fill in the information before adding.', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      try {
        const payload = {
          [selectedMenuItem]: infoText
        };
        await axios.put(`http://localhost:3000/medicine/${productID}`, payload, { withCredentials: true });
        onClose();
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Select</DialogTitle>
      <DialogContent>
        <Select
          value={selectedMenuItem}
          onChange={handleMenuItemChange}
          label="Select Menu Item"
          fullWidth
          variant="outlined"
        >
          <MenuItem value="description">Description</MenuItem>
          <MenuItem value="medicalUse">Medical Use</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="numStock">Items Left</MenuItem>
        </Select>

        {/* Display the information based on the selected menu item */}
        <TextField
          label="Information"
          variant="outlined"
          fullWidth
          value={infoText}
          onChange={(e) => setInfoText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleEditDetails}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
