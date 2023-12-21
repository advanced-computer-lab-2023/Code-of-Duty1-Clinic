import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const AddressForm = () => {
    // State to store the user's address
    const [address, setAddress] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/me/info', {
                    withCredentials: true,
                });
                const user = response.data.result[0];
                console.log(user.addresses);
                setAddresses(user.addresses);
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, []);

    // Handler to update the address state when the user types
    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    // Handler to submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        // You can perform actions with the address data here
        const response = await axios.post(
            'http://localhost:3000/me/addNewAddress',
            { address: address },
            { withCredentials: true }
        );
        setAddress('');
        setAddresses(response.data.result);
    };
    if (error) return <Typography>error happened {error.message}</Typography>;

    return (
        <Grid container spacing={2}>
            {/* Form */}
            <Grid item xs={12} sm={6}>
                <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                    <form onSubmit={handleSubmit}>
                        <Typography>add new Address</Typography>
                        <TextField
                            label="Address"
                            fullWidth
                            value={address}
                            onChange={handleAddressChange}
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
                            Submit
                        </Button>
                    </form>
                </Paper>
            </Grid>

            {/* Display Address */}
            <Grid item xs={12} sm={6}>
                <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                    <Typography variant="h6" gutterBottom>
                        User's Address
                    </Typography>
                    {/* <Typography>{addresses ? addresses[0] : 'no addresses'}</Typography> */}
                    {addresses.map((addrs) => (
                        <Typography>{addrs}</Typography>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AddressForm;