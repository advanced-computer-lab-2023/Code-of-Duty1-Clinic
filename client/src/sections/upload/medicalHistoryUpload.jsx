import React, { Suspense, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Upload from './Upload';
import Label from 'src/components/label';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    width: '400px',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '20px',
    cursor: 'pointer',
};

const MedicalHistoryUploadComponent = ({ onClose }) => {
    const [isUploaded, setIsUploaded] = useState([0, 0, 0]);
    const [fileName, setFileName] = useState('');
    const url = '/upload/patient/medicalHistory';

    const handleUploadSuccess = (field) => {
        let idx = 0;
        if (field === 'medicalLicenses') idx = 1;
        else if (field === 'medicalDegree') idx = 2;
        isUploaded[idx] = 1;
        setIsUploaded([...isUploaded]);
    };

    const handleFileNameChange = (event) => {
        setFileName(event.target.value);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Label sx={{ fontSize: '16px' }}>Medical History</Label>
            <TextField
                label="File Name"
                variant="outlined"
                value={fileName}
                onChange={handleFileNameChange}
                sx={{ marginBottom: '10px', width: '100%' }}
            />
            <Upload
                url={url}
                labelName="Medical History"
                field="medicalHistory"
                fileName={fileName}
                handleUploadSuccess={handleUploadSuccess}
            />
            <Button
                variant="contained"
                sx={{ fontSize: '16px', padding: '10px', cursor: 'pointer', marginTop: '10px' }}
                onClick={onClose}
            >
                Close
            </Button>
        </Box>
    );
};

const MedicalHistoryUpload = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>
                <Button
                    variant="contained"
                    sx={{ fontSize: '16px', padding: '10px', cursor: 'pointer', marginTop: '20px' }}
                    onClick={openModal}
                >
                    Upload to Medical History
                </Button>
                <Modal open={isModalOpen} onClose={closeModal}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                            Medical History Upload
                        </Typography>
                        <MedicalHistoryUploadComponent onClose={closeModal} />
                    </Box>
                </Modal>
            </div>
        </Suspense>
    );
};

export { MedicalHistoryUpload };
