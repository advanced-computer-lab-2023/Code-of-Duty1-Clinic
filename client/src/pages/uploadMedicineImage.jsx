import React, { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import { MedicineImageUpload } from 'src/sections/upload/medicineImageUpload';
import { axiosInstance } from 'src/utils/axiosInstance';
function MedicineImageUploadPage() {
  const [medicineID, setMedicineID] = useState('');

  const handleMedicineIDChange = (event) => {
    setMedicineID(event.target.value);
  };

  return (
    <>
      <Helmet>
        <title>Medicine Image Upload</title>
      </Helmet>

      <div>
        <label htmlFor="medicineID">Medicine ID:</label>
        <input type="text" id="medicineID" value={medicineID} onChange={handleMedicineIDChange} />
      </div>
      {console.log(medicineID, "M id")}
      <MedicineImageUpload medicineID={medicineID} />
      <MedicineList />
    </>
  );
}

function MedicineList() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    // Fetch medicines when the component mounts
    axiosInstance
      .get('/medicine')
      .then((response) => setMedicines(response.data.result)) // Assuming the data structure includes a "result" field
      .catch((error) => console.error('Error fetching medicines:', error));
  }, []);

  return (
    <div>
      <h2>Medicine List</h2>
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine._id}>
            <p>ID: {medicine._id}</p>
            <p>Name: {medicine.name}</p>
            <p> image path{medicine.image}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicineImageUploadPage;
