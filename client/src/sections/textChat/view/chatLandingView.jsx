import React, { useState } from 'react';
import DoctorForPatientView from '../view/patient-doctor/doctorForPatientView';
import PatientForDoctorView from '../view/patient-doctor/patientForDoctorView';
import DoctorForPharmacistView from '../view/doctor-pharmacist/doctorForPharmacistView';
import PharmacistForDoctorView from '../view/doctor-pharmacist/pharmacistForDoctorView';
import PharmacistForPatientView from './patient-pharmacist/pharmcistForPatientView';
import PatientForPharmacistView from './patient-pharmacist/patientForPharmacistView';


const Card = ({ text, onClick }) => {
    return (
        <div
            style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                margin: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            onClick={onClick}
        >
            {text}
        </div>
    );
};


const Landing = () => {
    const userRole = localStorage.getItem('userRole');
    const [showRenderedComponent, setShowRenderedComponent] = useState(false);
    const [content, setContent] = useState(null);
    const pagesArray = {
        1: { 2: <DoctorForPatientView />, 3: <PharmacistForPatientView /> },
        2: { 1: <PatientForDoctorView />, 3: <PharmacistForDoctorView /> },
        3: { 1: <PatientForPharmacistView />, 2: <DoctorForPharmacistView /> }
    }
    const getRoleNumber = (role) => {
        switch (role.toLowerCase()) {
            case 'patient':
                return 1;
            case 'doctor':
                return 2;
            case 'pharmacist':
                return 3;
        }
    }
    const handleCardClick = (selectedOtherRole) => {
        let selectedOtherRoleNumber = getRoleNumber(selectedOtherRole);
        let RoleNumber = getRoleNumber(userRole);
        console.log('RoleNumber:', RoleNumber);
        console.log('selectedOtherRoleNumber:', selectedOtherRoleNumber);
        setContent(pagesArray[RoleNumber][selectedOtherRoleNumber]);
        setShowRenderedComponent(true);
    };
    const cards = [
        { text: 'Chat with doctor', otherRole: 'Doctor' },
        { text: 'Chat with pharmacist', otherRole: 'Pharmacist' },
        { text: 'Chat with patient', otherRole: 'Patient' },
    ];

    const filteredCards = cards.filter((card) => card.otherRole !== userRole);

    return (
        <div>
            {filteredCards.map((card) => (
                <Card key={card.otherRole} text={card.text} onClick={() => handleCardClick(card.otherRole)} />
            ))
            }
            <div>
                {showRenderedComponent && content}
            </div>
        </div>
    );
};

export default Landing;
