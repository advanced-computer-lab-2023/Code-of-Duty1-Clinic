import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';
import { useMutation } from "react-query";
import { axiosInstance } from "src/utils/axiosInstance";


const AddFamilyView = () => {

  const [selectedOption, setSelectedOption] = useState('');
  const [familyEmail, setEmail] = useState('');
  const [familyPhone, setPhone] = useState('');
  const [familyName, setName] = useState('');
  const [familyNationalId, setNationalId] = useState('');
  const [familyRelation, setRelation] = useState('');
  const [familyMessage, setMessage] = useState('');
  const [condition, setCondition] = useState(false);


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const addFamily = async (body) => {
    console.log(body)
    const res = await axiosInstance.post('/me/family', body);
    if (res.data.message === 'Unauthorized')
      setMessage('Please login first');
    else {
      setMessage(res.data.message);
    }
  }


  const mutation = useMutation({
    mutationFn: (body) => {
      return addFamily(body)
    },
  })


  const handleClick = async (name, phone, email, nationalId, relation) => {
    if (((name && nationalId) || phone || email) && relation) {
      const body = {
        name: name,
        phone: phone,
        email: email,
        nationalID: nationalId,
        relation: relation
      }
      console.log(body);

      mutation.mutate(body);
    } else {
      setCondition(true);
    }
  }







  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: '600px' }}>
      <Typography variant="h5">Add Family Member</Typography>
      <Typography variant='body1'>Please select an option</Typography>
      {condition && <Typography variant='body1' style={{ color: 'red' }}>Please enter all fields</Typography>}
      {familyMessage && <Typography variant='body1'>{familyMessage}</Typography>}
      <Select value={selectedOption} onChange={handleOptionChange} label="Options">
        <MenuItem value="email">Email</MenuItem>
        <MenuItem value="phone">Phone</MenuItem>
        <MenuItem value="nationalId">Name & National ID</MenuItem>
      </Select>

      {selectedOption === 'email' && (
        <TextField
          label="Enter Email"
          value={familyEmail}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      {selectedOption === 'phone' && (
        <TextField
          label="Enter Phone"
          value={familyPhone}
          onChange={(e) =>
            setPhone(e.target.value)}
        />
      )}

      {selectedOption === 'nationalId' && (
        <>
          <TextField
            label="Enter Name"
            value={familyName}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Enter National ID"
            value={familyNationalId}
            onChange={(e) =>
              setNationalId(e.target.value)}
          />
        </>
      )}
      <TextField
        label="Enter Relation"
        value={familyRelation}
        onChange={(e) => setRelation(e.target.value)}
      />
      <LoadingButton
        onClick={() => handleClick(familyName, familyPhone, familyEmail, familyNationalId, familyRelation)}
        loading={mutation.isLoading}
        loadingIndicator="Loading…"
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
      >
        Add Family Member
      </LoadingButton>
    </Stack>
  );
};

export default AddFamilyView;
