import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/axiosInstance';
import Chat from './Chat';
import { Typography, List, ListItem, ListItemText, Paper, Box, Divider } from '@mui/material';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleChatClose = () => {
    setSelectedDoctor(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/chat/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box maxWidth="800px" m="0 auto" p="20px">
      <Typography variant="h4" mb={3} color="primary">
        Your Doctors
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: '8px', backgroundColor: '#f0f0f0' }}>
        <List style={{ padding: '0' }}>
          {doctors.map((doctor) => (
            <React.Fragment key={doctor._id}>
              <ListItem
                style={{
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#c0c0c0'
                  }
                }}
                onClick={() => handleDoctorClick(doctor)}
              >
                <ListItemText primary={doctor.doctorID.name} />
              </ListItem>
              <Divider sx={{ backgroundColor: '#bdbdbd' }} />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      {selectedDoctor && (
        <Chat
          other={selectedDoctor.doctorID}
          onClose={handleChatClose}
          ioUrl={'http://localhost:3000/chat/doctor/patient'}
          fetchUrl={`/chat/doctors/${selectedDoctor.doctorID._id}`}
        />
      )}
    </Box>
  );
};

export default DoctorsList;
