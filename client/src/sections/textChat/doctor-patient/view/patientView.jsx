import React from 'react';
import DoctorsList from '../doctorsList';

const PatientView = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Your Doctors</h1>
      <DoctorsList />
    </div>
  );
};

export default PatientView;
