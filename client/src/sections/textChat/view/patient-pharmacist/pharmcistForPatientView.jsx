import React from 'react';
// import DoctorsList from '../doctorsList';
import UsersList from '../../components/UsersList';
const PharmacistForPatientView = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Pharmacists</h1>
            <UsersList ioUrl={'http://localhost:3000/chat/pharmacist/patient'}
                contactUrl={'/chat/pharmacists/'} />

        </div>
    );
};

export default PharmacistForPatientView;
