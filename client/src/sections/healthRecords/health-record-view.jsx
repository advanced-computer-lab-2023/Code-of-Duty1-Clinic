import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import HealthRecordSummary from './health-record-summary';
import { axiosInstance } from '../../utils/axiosInstance';

export default function HealthRecordView() {
  const [healthRecords, setHealthRecords] = useState([]);
  const [newName, setNewName] = useState('');
  const [newRecord, setNewRecord] = useState('');

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const res = await axiosInstance.get(`/patients/6548e928d2f717cbd465119a/medicalhistory`);
        setHealthRecords(res.data.result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchHealthRecords();
  }, []);

  const handleSubmit = async () => {
    try {
      await axiosInstance.post('/patients/6548e928d2f717cbd465119a/medicalhistory', {
        name: newName,
        medicalRecord: newRecord,
      });
      // Reload the page after successful submission
      window.location.reload();
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

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Add New Health Record
      </Typography>

      <div>
        <TextField
          label="Name"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          sx={{ mb: 2 }}
        />
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
    </Container>
  );
}
