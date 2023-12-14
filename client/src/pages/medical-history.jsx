import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RecordsList, MedicalHistoryUpload } from 'src/sections/upload';

const MedicalHistoryPage = () => {
  return (
    <>
      <Helmet>
        <title>Medical History</title>
      </Helmet>

      <div style={containerStyle}>
        <h1 style={headingStyle}>Medical History</h1>

        <MedicalHistoryUpload />
        <RecordsList />
      </div>
    </>
  );
};

const containerStyle = {
  maxWidth: '800px',
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
