import React from 'react';
// import DoctorsList from '../doctorsList';
import UsersList from '../../components/UsersList';
const PatientForPharmacistView = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Patients</h1>
            <UsersList ioUrl={'http://localhost:3000/chat/pharmacist/patient'}
                contactUrl={'/chat/pharmacists/patient'} />

        </div>
    );
};

export default PatientForPharmacistView;
