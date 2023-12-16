import React, { useState } from 'react';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Container,
    FormHelperText,
} from '@mui/material';
import { axiosInstance } from 'src/utils/axiosInstance';

const AddAdminForm = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const [name, setName] = useState('');
    const [nameTouched, setNameTouched] = useState(false); // New state variable for name touched
    const [username, setUsername] = useState('');
    const [usernameTouched, setUsernameTouched] = useState(false); // New state variable for username touched
    const [password, setPassword] = useState('');
    const [passwordTouched, setPasswordTouched] = useState(false); // New state variable for password touched
    const [email, setEmail] = useState('');
    const [emailTouched, setEmailTouched] = useState(false); // New state variable for email touched
    const [phone, setPhone] = useState('');
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [feedBack, setFeedBack] = useState('');
    const [color, setColor] = useState('green');

    const handleAddAdmin = async () => {
        setFeedBack('');
        setNameTouched(true);
        setUsernameTouched(true);
        setPasswordTouched(true);
        setEmailTouched(true);
        setPhoneTouched(true);
        if (!name || !username || !password || !email || !phone) return;
        if (!emailRegex.test(email)) {
            setFeedBack('Invalid email format');
            setColor('red');
            return;
        }

        console.log('Adding admin:', { name, username, password, email, phone });
        try {
            let response = await axiosInstance.post('/users', { name, username, password, email, phone });
            console.log(response)
            if (response && response.status == 200) {
                setFeedBack('Admin added successfully');
                setColor('green');
            } else {
                setFeedBack(response.data?.message | 'Error adding admin');
                setColor('red');
            }
        } catch (error) {
            setFeedBack('Error adding admin');
            setColor('red');
        }
    };
    function TextFieldInput({ label, value, setValue, setValueTouched, valueTouched }) {
        return (
            <>
                <TextField
                    label={`${label} *`}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={value}
                    onChange={(e) => { setValue(e.target.value); setValueTouched(true); }}
                    onBlur={() => setValueTouched(true)}
                />
                {/* {valueTouched && !value && <FormHelperText error>{`${label} is required`}</FormHelperText>} */}
            </>
        );
    }


    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
                <Typography variant="h5" gutterBottom>
                    Add New Admin
                </Typography>
                <Typography variant="body1" gutterBottom color={color}>
                    {feedBack}
                </Typography>
                <form>
                    {/* <TextFieldInput label={"Name"} value={name} setValue={setName} setValueTouched={setNameTouched} valueTouched={nameTouched} />
                    <TextFieldInput label="Username" value={username} setValue={setUsername} setValueTouched={setUsernameTouched} valueTouched={usernameTouched} />

                    <TextFieldInput label="Password" value={password} setValue={setPassword} setValueTouched={setPasswordTouched} valueTouched={passwordTouched} />

                    <TextFieldInput label="Email" value={email} setValue={setEmail} setValueTouched={setEmailTouched} valueTouched={emailTouched} /> */}

                    {/* <TextFieldInput label="Phone" value={phone} setValue={setPhone} setValueTouched={setPhoneTouched} valueTouched={phoneTouched} /> */}
                    <TextField
                        label="Name *"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setNameTouched(true); }}
                        onBlur={() => setNameTouched(true)}
                    />
                    {nameTouched && !name && <FormHelperText error>Required</FormHelperText>}
                    <TextField
                        label="Username *"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setUsernameTouched(true); }}
                        onBlur={() => setUsernameTouched(true)}
                    />
                    {usernameTouched && !username && <FormHelperText error>Required</FormHelperText>}
                    <TextField
                        label="Password *"
                        type="password"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
                        onBlur={() => setPasswordTouched(true)}
                    />
                    {passwordTouched && !password && <FormHelperText error>Required</FormHelperText>}
                    <TextField
                        label="Email *"
                        type="email"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailTouched(true); }}
                        onBlur={() => setEmailTouched(true)}
                    />
                    {emailTouched && !email && <FormHelperText error>Required</FormHelperText>}

                    <TextField
                        label="Phone *"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setPhoneTouched(true); }}
                        onBlur={() => setPhoneTouched(true)}
                    />
                    {phoneTouched && !phone && <FormHelperText error>Required</FormHelperText>}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddAdmin}
                        style={{ marginTop: '20px' }}
                    >
                        Add Admin
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AddAdminForm;