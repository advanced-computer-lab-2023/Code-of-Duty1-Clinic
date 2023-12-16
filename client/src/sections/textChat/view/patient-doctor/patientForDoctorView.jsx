import React from 'react';
// import PatientsList from '../patientsList';
import UsersList from '../../components/UsersList';

const PatientForDoctorView = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Your Patients</h1>
      {/* <PatientsList /> */}
      <UsersList
        ioUrl={'http://localhost:3000/chat/doctor/patient'}
        contactUrl={'/chat/patients'}
      />

    </div>
  );
};

export default PatientForDoctorView;
