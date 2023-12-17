import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RecordsList, MedicalHistoryUpload } from 'src/sections/upload';
import MedicalHistoryView from 'src/sections/upload/Medical-History/view/medicalHistoryView';
import { useParams } from 'react-router-dom';
const MedicalHistoryPage = () => {
  const { patientID } = useParams();
  return (
    <>
      <Helmet>
        <title>Medical History/Records</title>
      </Helmet>

      <div style={containerStyle}>



        <MedicalHistoryView patientID={patientID} />
      </div>
    </>
  );
};

const containerStyle = {
  // maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#fff',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px'
};

const headingStyle = {
  fontSize: '28px',
  marginBottom: '20px',
  color: '#333'
};

export default MedicalHistoryPage;
