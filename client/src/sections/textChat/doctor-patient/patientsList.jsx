import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/axiosInstance';
import Chat from './Chat';
import { Typography, List, ListItem, ListItemText, Paper, Box, Divider } from '@mui/material';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleChatClose = () => {
    setSelectedPatient(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/chat/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box maxWidth="800px" m="0 auto" p="20px">
      <Typography variant="h4" mb={3} color="primary">
        Your Patients
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: '8px', backgroundColor: '#f0f0f0' }}>
        <List style={{ padding: '0' }}>
          {patients.map((patient) => (
            <React.Fragment key={patient._id}>
              <ListItem
                style={{
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#c0c0c0'
                  }
                }}
                onClick={() => handlePatientClick(patient)}
              >
                <ListItemText primary={patient.patientID.name} />
              </ListItem>
              <Divider sx={{ backgroundColor: '#bdbdbd' }} />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      {selectedPatient && (
        <Chat
          other={selectedPatient.patientID}
          onClose={handleChatClose}
          ioUrl={'http://localhost:3000/chat/doctor/patient'}
          fetchUrl={`/chat/patients/${selectedPatient.patientID._id}`}
        />
      )}
    </Box>
  );
};

export default PatientsList;
