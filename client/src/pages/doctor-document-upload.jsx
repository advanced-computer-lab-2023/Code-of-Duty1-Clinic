import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RegistrationUpload, RecordsList } from 'src/sections/upload';

function DoctorDocumentUploadPage() {
  return (
    <>
      <Helmet>
        <title>Upload Documents</title>
      </Helmet>

      <div style={containerStyle}>
        <h1 style={headingStyle}>Document Upload Page</h1>

        <section style={sectionStyle}>
          <h2 style={subHeadingStyle}>Registration Documents</h2>
          <RegistrationUpload />
        </section>
      </div>
    </>
  );
}

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px'
};

const headingStyle = {
  fontSize: '24px',
  marginBottom: '20px'
};

const sectionStyle = {
  marginBottom: '40px'
};

const subHeadingStyle = {
  fontSize: '20px',
  marginBottom: '10px'
};

export default DoctorDocumentUploadPage;
