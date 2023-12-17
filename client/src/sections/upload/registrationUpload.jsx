import { useState } from 'react';
import Upload from './Upload';
import Label from 'src/components/label';
import { Helmet } from 'react-helmet-async';
function RegistrationUpload() {
  const [isUploaded, setIsUploaded] = useState([0, 0, 0]);
  const url = '/upload/doctor/registration';
  const handleUploadSuccess = (field) => {
    let idx = 0;
    if (field == 'medicalLicenses') idx = 1;
    else if (field == 'medicalDegree') idx = 2;
    isUploaded[idx] = 1;
    setIsUploaded([...isUploaded]);
  };
  const style = { fontSize: '16px' };
  return (
    <div style={{ width: '100%' }}>
      <Label style={style}>ID</Label>
      <Upload url={url} labelName="ID" field="ID" handleUploadSuccess={handleUploadSuccess} />

      <Label style={style}>Medical licenses</Label>
      <Upload
        url={url}
        labelName="Medical licenses"
        field="medicalLicenses"
        handleUploadSuccess={handleUploadSuccess}
      />

      <Label style={style}>Medical degree</Label>
      <Upload url={url} labelName="Medical degree" field="medicalDegree" handleUploadSuccess={handleUploadSuccess} />
      <Label style={style}> {isUploaded} </Label>
    </div>
  );
}
export { RegistrationUpload };
