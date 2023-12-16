import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RegistrationUpload } from 'src/sections/upload/registrationUpload';
import { MedicineImage } from 'src/sections/upload/medicineImage';
import { MedicineImageUpload } from 'src/sections/upload/medicineImageUpload';

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

function PharmacistDocumentUploadPage() {
  return (
    <div style={containerStyle}>
      <Helmet>
        <title>Upload Documents</title>
      </Helmet>
      <h1 style={headingStyle}>Upload Documents</h1>
      <div style={sectionStyle}>
        <RegistrationUpload />
      </div>
      {/* <div style={sectionStyle}>
                <MedicineImageUpload medicineID={"65522d4620623538e08f3411"} />
                <MedicineImage MedicineID='65522d4620623538e08f3411' backUpURL="assets/images/pills-white.jpg" />
            </div> */}
    </div>
  );
}

export default PharmacistDocumentUploadPage;
