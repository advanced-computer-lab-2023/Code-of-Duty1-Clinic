import React, { useState, useEffect } from 'react';
import { axiosInstance } from 'src/utils/axiosInstance';
import {
    Avatar,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Modal,
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';



function EditProfileModal({ user, open, onClose, onSave }) {
    const [editedUser, setEditedUser] = useState({});

    useEffect(() => {
        setEditedUser(user);
    }, [user]);

    const handleInputChange = (field, value) => {
        console.log(field, value, "*-*-*---*-*-*-*-*");
        setEditedUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(editedUser);
        onClose();
    };

    const handleAddEmergencyContact = () => {
        setEditedUser((prev) => ({
            ...prev,
            emergencyContact: [
                ...(prev.emergencyContact || []),
                { name: '', phone: '', relation: '' }
            ]
        }));
    };

    const handleEmergencyContactChange = (index, field, value) => {
        setEditedUser((prev) => {
            const updatedEmergencyContacts = [...(prev.emergencyContact || [])];
            updatedEmergencyContacts[index] = {
                ...updatedEmergencyContacts[index],
                [field]: value
            };
            return { ...prev, emergencyContact: updatedEmergencyContacts };
        });
    };

    const handleRemoveEmergencyContact = (index) => {
        setEditedUser((prev) => {
            const updatedEmergencyContacts = [...(prev.emergencyContact || [])];
            updatedEmergencyContacts.splice(index, 1);
            return { ...prev, emergencyContact: updatedEmergencyContacts };
        });
    };

    return (
        <Modal open={open} onClose={onClose} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '16px',
                maxWidth: '400px',
                width: '100%',
            }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <TextField
                        label="Name"
                        value={editedUser.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    <TextField
                        label="Email"
                        value={editedUser.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    <FormControl>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            value={editedUser.gender || ''}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Birth Date"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={editedUser.birthDate || ''}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    {user.role === 'Doctor' && (
                        <>
                            <TextField
                                label="Hospital"
                                value={editedUser.hospital || ''}
                                onChange={(e) => handleInputChange('hospital', e.target.value)}
                            />
                            <TextField
                                label="Hour Rate"
                                value={editedUser.hourRate || ''}
                                onChange={(e) => handleInputChange('hourRate', e.target.value)}
                            />
                            <TextField
                                label="Specialty"
                                value={editedUser.specialty || ''}
                                onChange={(e) => handleInputChange('specialty', e.target.value)}
                            />
                            <TextField
                                label="Education Background"
                                value={editedUser.educationBackground || ''}
                                onChange={(e) =>
                                    handleInputChange('educationBackground', e.target.value)
                                }
                            />
                        </>
                    )}
                    {user.role === 'Pharmacist' && (
                        <>
                            <TextField
                                label="Education Background"
                                value={editedUser.educationBackground || ''}
                                onChange={(e) =>
                                    handleInputChange('educationBackground', e.target.value)
                                }
                            />
                        </>
                    )}
                    {user.role === 'Patient' && (
                        <>
                            {editedUser.emergencyContact &&
                                editedUser.emergencyContact.map((contact, index) => (
                                    <div key={index}>
                                        <TextField
                                            label={`Emergency Contact Name ${index + 1}`}
                                            value={contact.name || ''}
                                            onChange={(e) =>
                                                handleEmergencyContactChange(
                                                    index,
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <TextField
                                            label={`Emergency Contact Phone ${index + 1}`}
                                            value={contact.phone || ''}
                                            onChange={(e) =>
                                                handleEmergencyContactChange(
                                                    index,
                                                    'phone',
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <TextField
                                            label={`Emergency Contact Relation ${index + 1}`}
                                            value={contact.relation || ''}
                                            onChange={(e) =>
                                                handleEmergencyContactChange(
                                                    index,
                                                    'relation',
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Button onClick={() => handleRemoveEmergencyContact(index)}>
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            <Button onClick={handleAddEmergencyContact}>
                                Add Emergency Contact
                            </Button>
                        </>
                    )}
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </Box>
            </div>
        </Modal>
    );
}

export default EditProfileModal;
