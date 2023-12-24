import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ... (other imports)

// ... (other imports)

// ... (other imports)

export default function ProductEdit({ onClose, productID }) {
  const [selectedMenuItem, setSelectedMenuItem] = useState('description');
  const [infoText, setInfoText] = useState('');

  // Function to handle menu item selection
  const handleMenuItemChange = (event) => {
    setSelectedMenuItem(event.target.value);
  };

  // Function to handle the "Add" button click
  const handleEditDetails = async () => {
    if (infoText === '' && selectedMenuItem !== 'activeIngredients') {
      toast.error('Please fill in the information before adding.', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      try {
        let payload = {
          [selectedMenuItem]: infoText
        };

        // If the selected menu item is "Active Ingredients," convert the string to an array
        if (selectedMenuItem === 'activeIngredients') {
          payload = {
            [selectedMenuItem]: infoText.split(',').map((ingredient) => ingredient.trim())
          };
        }

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
          <MenuItem value="activeIngredients">Active Ingredients</MenuItem>
        </Select>

        {/* Display the information based on the selected menu item */}
        {selectedMenuItem !== 'activeIngredients' && (
          <TextField
            label="Information"
            variant="outlined"
            fullWidth
            value={infoText}
            onChange={(e) => setInfoText(e.target.value)}
          />
        )}
        {/* Additional input for editing active ingredients */}
        {selectedMenuItem === 'activeIngredients' && (
          <TextField
            label="Active Ingredients (comma-separated)"
            variant="outlined"
            fullWidth
            value={infoText} // No need for join, as it's already a string
            onChange={(e) => setInfoText(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button color="primary" onClick={handleEditDetails} variant="outlined">
          submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
