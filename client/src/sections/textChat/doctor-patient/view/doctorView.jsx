import React from 'react';
import PatientsList from '../patientsList';

const DoctorView = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Your Patients</h1>
      <PatientsList />
    </div>
  );
};

export default DoctorView;
