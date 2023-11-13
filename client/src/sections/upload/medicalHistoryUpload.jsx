import React, { Suspense, useState } from 'react';
import Button from '@mui/material/Button';
import Upload from "./Upload";
import Label from "src/components/label";
import TextField from '@mui/material/TextField';

const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const modalContentStyle = {
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

    const style = { fontSize: '16px' };

    return (
        <div style={{ width: '100%' }}>
            <Label style={style}>Medical History</Label>
            <TextField
                label="File Name"
                variant="outlined"
                value={fileName}
                onChange={handleFileNameChange}
                style={{ marginBottom: '10px' }}
            />
            <Upload
                url={url}
                labelName="Medical History"
                field="medicalHistory"
                fileName={fileName} // Pass the file name to the Upload component
                handleUploadSuccess={handleUploadSuccess}
            />
            <Button style={{ fontSize: '16px', padding: '10px', cursor: 'pointer' }} onClick={onClose}>
                Close
            </Button>
        </div>
    );
};

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                {children}
            </div>
        </div>
    );
};

const MedicalHistoryUpload = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setTimeout(() => {
            setModalOpen(true);
        }, 50);
    };

    const closeModal = () => {
        setTimeout(() => {
            setModalOpen(false);
        }, 50);
    };

    return (
        <Suspense fallback={<div>Loading...</div>} >
            <div>
                <Button style={{ fontSize: '16px', padding: '10px', cursor: 'pointer' }} variant="contained" onClick={openModal}>
                    Upload to Medical History
                </Button>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <MedicalHistoryUploadComponent onClose={closeModal} />
                </Modal>
            </div>
        </Suspense>
    );
};

export { MedicalHistoryUpload };
