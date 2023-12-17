import { useEffect, useState } from "react";
import { axiosInstance } from "src/utils/axiosInstance";
import { TextField, Button, Typography, Box } from '@mui/material';

export default function AddTextHealthRecord({ patientID }) {
    const [newName, setNewName] = useState('');
    const [newRecord, setNewRecord] = useState('');
    const [feedBack, setFeedBack] = useState('');
    const [color, setColor] = useState('green');

    const handleSubmit = async () => {
        setFeedBack('');
        try {
            const response = await axiosInstance.post(`/patients/${patientID}/medicalhistory`, {
                name: newName,
                medicalRecord: newRecord
            });

            if (response?.status === 200) {
                setFeedBack('Successfully Added');
                setColor('green');
            } else {
                setFeedBack('Server Error');
                setColor('red');
            }
        } catch (error) {
            console.error(error);
            if (String(error?.response?.status).startsWith('4'))
                setFeedBack(`You are not authorized. Status Code: ${error.response.status}`);
            else
                setFeedBack('Error while Adding');
            setColor('red');
        }

        setNewName('');
        setNewRecord('');
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>

            <TextField
                label="Record Name"
                value={newName}
                onChange={(event) => { setFeedBack(''); setNewName(event.target.value) }}
                fullWidth
                sx={{ marginBottom: 2 }}
            />

            <TextField
                label="Health History/Record"
                value={newRecord}
                onChange={(event) => { setFeedBack(''); setNewRecord(event.target.value) }}
                fullWidth
                sx={{ marginBottom: 2 }}
            />

            <Button variant="contained" onClick={handleSubmit} fullWidth>
                Add Record
            </Button>

            {feedBack && (
                <Typography variant="body2" color={color} sx={{ marginTop: 2 }}>
                    {feedBack}
                </Typography>
            )}
        </Box>
    );
}
