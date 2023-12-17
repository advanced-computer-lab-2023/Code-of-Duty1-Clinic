import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';
import { useMutation } from 'react-query';
import { axiosInstance } from 'src/utils/axiosInstance';
import InputLabel from '@mui/material/InputLabel';
import { red } from '@mui/material/colors';

const AddFamilyView = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [familyEmail, setEmail] = useState('');
  const [familyPhone, setPhone] = useState('');
  const [familyName, setName] = useState('');
  const [familyNationalId, setNationalId] = useState('');
  const [familyRelation, setRelation] = useState('');
  const [familyMessage, setMessage] = useState('');
  const [condition, setCondition] = useState(false);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState('');
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setEmail('');
    setPhone('');
    setName('');
    setNationalId('');
    setAge('');
    setGender('');
  };

  const addFamily = async (body) => {
    console.log(body);
    const res = await axiosInstance.post('/me/family', body).catch(function (error) {
      if (error.response) {
        setMessage(error.response.data.message);
        setColor('red');
      }
    });

    setMessage(res.data.message);
    setColor('green');
  };

  const mutation = useMutation({
    mutationFn: (body) => {
      return addFamily(body);
    }
  });

  const handleClick = async (name, phone, email, nationalId, age, gender, relation) => {
    if (((name && nationalId && age && gender) || phone || email) && relation) {
      const body = {
        name: name,
        phone: phone,
        email: email,
        nationalID: nationalId,
        relation: relation,
        age: age,
        gender: gender
      };
      setCondition(false);

      mutation.mutate(body);
    } else {
      setCondition(true);
    }
  };

  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: '600px' }}>
      <Typography variant="h5">Add Family Member</Typography>
      <Typography variant="body1">Please select an option</Typography>
      <Select value={selectedOption} onChange={handleOptionChange}>
        <MenuItem value="email">Email</MenuItem>
        <MenuItem value="phone">Phone</MenuItem>
        <MenuItem value="nationalId">Name, National ID, Age, and Gender</MenuItem>
      </Select>

      {selectedOption === 'email' && (
        <TextField label="Enter Email" value={familyEmail} onChange={(e) => setEmail(e.target.value)} />
      )}

      {selectedOption === 'phone' && (
        <TextField label="Enter Phone" value={familyPhone} onChange={(e) => setPhone(e.target.value)} />
      )}

      {selectedOption === 'nationalId' && (
        <>
          <TextField label="Enter Name" value={familyName} onChange={(e) => setName(e.target.value)} />
          <TextField
            label="Enter National ID"
            value={familyNationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
          <TextField label="Enter Age" value={age} onChange={(e) => setAge(e.target.value)} />
          <Typography variant="body1" sx={{ marginLeft: '20px' }}>
            Select Gender
          </Typography>
          <Select InputLabel="Select Gender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <MenuItem key="Male" value="Male">
              Male
            </MenuItem>
            <MenuItem key="Female" value="Female">
              Female
            </MenuItem>
          </Select>
        </>
      )}
      <InputLabel sx={{ marginLeft: '80px' }}>Select a Relation</InputLabel>
      <Select value={familyRelation} onChange={(e) => setRelation(e.target.value)}>
        <MenuItem key="Husband" value="Husband">
          Husband
        </MenuItem>
        <MenuItem key="Wife" value="Wife">
          Wife
        </MenuItem>
        <MenuItem key="Child" value="Child">
          Child
        </MenuItem>
      </Select>
      {condition && (
        <Typography variant="body1" style={{ color: 'red' }}>
          Please enter all fields
        </Typography>
      )}
      {familyMessage && <Typography variant="body1" style={{ color: color }}>{familyMessage}</Typography>}
      <LoadingButton
        onClick={() => handleClick(familyName, familyPhone, familyEmail, familyNationalId, age, gender, familyRelation)}
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
