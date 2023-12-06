import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { axiosInstance } from '../../utils/axiosInstance';
import { Select } from '@mui/material';
import { set } from 'lodash';

export default function PrescriptionSummary({
  prescriptionID,
  date,
  doctorName,
  patientName,
  description,
  medicines,
  isFilled,
  isSubmitted,
  medicinesListNames,
  sx,
  ...other
}) {
  const user = localStorage.getItem('userRole');
  console.log(user);

  const handleEditMedicineDosage = async (medicineId) => {
    try {
      await axiosInstance.put(`/prescription/${prescriptionID}/medicine/${medicineId}`, {
        dosage: editedDosage
      });
      console.log(`Edit medicine with ID: ${medicineId}`);
      setEditingMedicineId('');
      setEditedDosage('');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    try {
      await axiosInstance.delete(`/prescription/${prescriptionID}/medicine/${medicineId}`);
      console.log(`Delete medicine with ID: ${medicineId}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditDescription = async () => {
    try {
      await axiosInstance.put(`/prescription/${prescriptionID}`, {
        description: editedDescription
      });
      console.log(`Edit description for prescription ID: ${prescriptionID}`);
      setEditingDescription(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const [editingMedicineId, setEditingMedicineId] = useState('');
  const [editedDosage, setEditedDosage] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);

  const [newMedicine, setNewMedicine] = useState('');
  const [newDosage, setNewDosage] = useState('');

  // console.log(medicinesListNames);

  const handleAddMedicine = async () => {
    console.log(newMedicine);
    console.log(newDosage);
    try {
      await axiosInstance.post(`/prescription/${prescriptionID}/medicine`, {
        medicine: { medicine: newMedicine, dosage: newDosage }
      });
      setNewMedicine('');
      setNewDosage('');
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const [medArray, setMedArray] = useState([]);
  useEffect(() => {
    const getMedID = async () => {
      try {
        const res = await axiosInstance.get(`/medicine`);
        setMedArray(res.data.result);
        // console.log('Yes');
        // console.log(medArray);
      } catch (err) {
        console.error(err);
      }
    };
    getMedID();
  }, []);

  const handleAddCartItem = async (medicine) => {
    console.log(medArray);
    let medID = '';
    for (let i = 0; i < medArray.length; i++) {
      if (medArray[i].name === medicine) {
        medID = medArray[i]._id;
        console.log(medID);
      }
    }
    try {
      await axiosInstance.post(`/cart`, {
        medID
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card sx={{ p: 2, maxWidth: 600, margin: 'auto', boxShadow: 3, ...sx }} {...other}>
      <Stack spacing={2}>
        <Typography variant="h6">Prescription Summary</Typography>
        <Box>
          {editingDescription ? (
            <div>
              <input
                type="text"
                value={editedDescription}
                onChange={(event) => setEditedDescription(event.target.value)}
              />
              <IconButton aria-label="save" color="primary" onClick={handleEditDescription}>
                <SaveIcon />
              </IconButton>
            </div>
          ) : (
            <Typography variant="body1" gutterBottom onDoubleClick={() => setEditingDescription(true)}>
              <strong>Description:</strong> {description}
            </Typography>
          )}
          <Typography variant="subtitle1">
            <strong>Date:</strong> {date}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Doctor:</strong> {doctorName}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Patient:</strong> {patientName}
          </Typography>
          <br />
          {isFilled ? (
            <Typography variant="subtitle1">
              <strong>Status:</strong> Filled
            </Typography>
          ) : (
            <Typography variant="subtitle1">
              <strong>Status:</strong> Not Filled
            </Typography>
          )}
          {isSubmitted ? (
            <Typography variant="subtitle1">
              <strong>Submission Status:</strong> Submitted
            </Typography>
          ) : (
            <Typography variant="subtitle1">
              <strong>Submission Status:</strong> Not Submitted
            </Typography>
          )}
        </Box>
        <Typography variant="body1">
          <strong>Medicines:</strong>
        </Typography>
        <Stack spacing={2}>
          {medicines.map((medicineData) => (
            <Box
              key={medicineData._id}
              sx={{ border: '1px solid #ccc', p: 2, borderRadius: 4, display: 'flex', alignItems: 'center' }}
            >
              {editingMedicineId === medicineData._id ? (
                <Box sx={{ flexGrow: 1 }}>
                  <input type="text" value={editedDosage} onChange={(event) => setEditedDosage(event.target.value)} />
                  <IconButton
                    aria-label="save"
                    color="primary"
                    onClick={() => handleEditMedicineDosage(medicineData._id)}
                  >
                    <SaveIcon />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1">
                      <strong>Medicine:</strong> {medicineData.medicine}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Dosage:</strong> {medicineData.dosage}
                    </Typography>
                  </Box>
                  {user === 'Doctor' && (
                    <div>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => {
                          setEditingMedicineId(medicineData._id);
                          setEditedDosage(medicineData.dosage);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDeleteMedicine(medicineData._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )}
                  {user === 'Patient' && (
                    <div>
                      <IconButton
                        aria-label="add"
                        color="primary"
                        onClick={() => handleAddCartItem(medicineData.medicine)}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </div>
                  )}
                </>
              )}
            </Box>
          ))}
        </Stack>
        {user === 'Doctor' && (
          <div>
            <Typography variant="h6">Add Medicine</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography variant="body1">
                <label htmlFor="medicineInput">Medicine: </label>
                <select id="medicineInput" onChange={(event) => setNewMedicine(event.target.value)}>
                  <option value="">Select Medicine</option>
                  {medicinesListNames.map((medicineName, index) => (
                    <option key={index} value={medicineName}>
                      {medicineName}
                    </option>
                  ))}
                </select>
              </Typography>
              <Typography variant="body1">
                <label htmlFor="dosageInput">Dosage: </label>
                <input
                  id="dosageInput"
                  onChange={(event) => {
                    setNewDosage(event.target.value);
                  }}
                />
              </Typography>
              <button onClick={handleAddMedicine}>Add Medicine</button>
            </Box>
          </div>
        )}
      </Stack>
    </Card>
  );
}

PrescriptionSummary.propTypes = {
  prescriptionID: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  doctorName: PropTypes.string.isRequired,
  patientName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  medicines: PropTypes.arrayOf(
    PropTypes.shape({
      medicine: PropTypes.string.isRequired,
      dosage: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired
    })
  ).isRequired,
  isFilled: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  medicinesListNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  sx: PropTypes.object
};
