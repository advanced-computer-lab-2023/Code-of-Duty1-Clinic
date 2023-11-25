import React, { useState } from 'react';
import { Modal, Button, Box, Typography } from '@mui/material';
import { Label } from '@mui/icons-material';
import { Upload } from './upload';

const MedicineImageUpload = ({ medicineID }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Upload Medicine Image
            </Button>

            <Modal open={modalOpen} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="div">
                        Medicine Image
                    </Typography>
                    <Label sx={{ mt: 2, mb: 1 }}>Medicine Image</Label>
                    <Upload url={`upload/medicine/image/${medicineID}`} field="medicine" />
                    <Button sx={{ mt: 2 }} onClick={handleClose}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export { MedicineImageUpload };
