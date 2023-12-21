// PatientInfo.js
import React from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from '@mui/material';

const PatientInfo = ({ patient }) => {
    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <Paper elevation={3} style={{ padding: '16px', margin: '16px' }}>
            {/* <Typography variant="h5">Patient Information</Typography> */}
            <List>

                <ListItem>
                    <ListItemText
                        primary={<strong>Emergency Contact:</strong>}
                        secondary={
                            <List>
                                <ListItem>
                                    <ListItemText primary={<strong>Name:</strong>} secondary={patient?.emergencyContact?.name} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={<strong>Phone:</strong>} secondary={patient?.emergencyContact?.phone} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={<strong>Relation:</strong>} secondary={patient?.emergencyContact?.relation} />
                                </ListItem>
                            </List>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={<strong>Family:</strong>}
                        secondary={
                            <List>
                                {patient.family.map((familyMember, index) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar>{familyMember?.name[0]}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={familyMember?.name}
                                            secondary={`Relation: ${familyMember?.relation}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={<strong>Package:</strong>}
                        secondary={
                            patient.package ? (
                                <List>
                                    <ListItem>
                                        {<ListItemText primary={<strong>Package Name:</strong>} secondary={patient.package?.packageID.name} />}
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={<strong>Package Status:</strong>} secondary={patient.package?.packageStatus} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={<strong>End Date:</strong>} secondary={patient.package?.endDate} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={<strong>Package Price:</strong>} secondary={patient.package?.packageID?.price} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={<strong>Session Discount:</strong>} secondary={`${patient.package?.packageID?.sessionDiscount}%`} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={<strong>Medicine Discount:</strong>} secondary={`${patient.package?.packageID?.medicineDiscount}%`} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={<strong>Family Discount:</strong>} secondary={`${patient.package?.packageID?.familyDiscount}%`} />
                                    </ListItem>
                                </List>
                            ) : (
                                'No Package Information'
                            )
                        }
                    />
                </ListItem>

            </List>
        </Paper>
    );
}

export default PatientInfo;
