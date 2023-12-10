import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useUserContext } from 'src/contexts/userContext';
import { axiosInstance } from '../../utils/axiosInstance';

import HealthRecordSummary from './health-record-summary';

export default function HealthRecordView({ patientID }) {
  console.log(patientID);
  const [healthRecords, setHealthRecords] = useState([]);
  const [newName, setNewName] = useState('');
  const [newRecord, setNewRecord] = useState('');

  // const {
  //   user: { role },
  // } = useUserContext();
  const user = localStorage.getItem('userRole');
  console.log(user);

  const fetchHealthRecords = async () => {
    try {
      let res;
      if (user === 'Doctor') {
        res = await axiosInstance.get(`/patients/${patientID}/medicalhistory`);
      } else {
        res = await axiosInstance.get(`/me/medicalhistory`);
      }
      setHealthRecords(res.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const handleSubmit = async () => {
    try {
      await axiosInstance.post(`/patients/${patientID}/medicalhistory`, {
        name: newName,
        medicalRecord: newRecord
      });
      fetchHealthRecords();
    } catch (err) {
      console.error(err);
    }

    setNewName('');
    setNewRecord('');
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Health Records
      </Typography>

      <Grid container spacing={3}>
        {healthRecords.map((record) => (
          <Grid item key={record._id} xs={12} sm={6} md={5}>
            <HealthRecordSummary name={record.name} medicalRecord={record.medicalRecord} />
          </Grid>
        ))}
      </Grid>

      {user === 'Doctor' && (
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Add New Health Record
        </Typography>
      )}

      {user === 'Doctor' && (
        <div>
          <TextField label="Name" value={newName} onChange={(event) => setNewName(event.target.value)} sx={{ mb: 2 }} />
          <br />
          <TextField
            label="Health Record"
            value={newRecord}
            onChange={(event) => setNewRecord(event.target.value)}
            sx={{ mb: 2 }}
          />
          <br />
          <Button variant="contained" onClick={handleSubmit}>
            Add
          </Button>
        </div>
      )}
    </Container>
  );
}
