import React from 'react';
// import DoctorsList from '../doctorsList';
import UsersList from '../../components/UsersList';
const DoctorForPharmacistView = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Doctors</h1>
            <UsersList ioUrl={'http://localhost:3000/chat/pharmacist/doctor'}
                contactUrl={'/chat/pharmacists/doctors'} />

        </div>
    );
};

export default DoctorForPharmacistView;
