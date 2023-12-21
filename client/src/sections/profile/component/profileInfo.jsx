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
} from '@mui/material';
import EditProfileModal from './profileSettings';
import PatientInfo from './patient/patientInfo';
// Custom component to render ListItemText with bold styling for words before the colon
const isMine = (user) => user && user._id == localStorage.getItem('userID');

const BoldBeforeColonText = ({ primary, ...props }) => {
    const parts = primary.split(':');
    return (
        <ListItemText
            primary={
                <span>
                    <span style={{ fontWeight: 'bold' }}>{parts[0]}</span>:{parts[1]}
                </span>
            }
            {...props}
        />
    );
};

const SpecificInfo = ({ user }) => {


    if (!user) {
        return null;
    }

    return (
        <Card
            style={{
                width: '100%',
                maxWidth: '400px',
                marginBottom: '16px',
                border: '1px solid blue'
            }}
        >
            <CardContent>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    {`${user.role} Information`}
                </Typography>

                {
                    user.role == 'Doctor' && <List>

                        <BoldBeforeColonText
                            primary={`Hourly Rate: ${user.hourRate || 'Not specified'}`}
                        />
                        <BoldBeforeColonText
                            primary={`Hospital: ${user.hospital || 'Not specified'}`}
                        />
                        <BoldBeforeColonText
                            primary={`Education Background: ${user.educationBackground || 'Not specified'
                                }`}
                        />
                        <BoldBeforeColonText
                            primary={`Specialty: ${user.specialty || 'Not specified'}`}
                        />
                        {isMine(user) && <BoldBeforeColonText
                            primary={`Wallet: ${user.wallet || 'Not specified'} $`}
                        />}
                        <BoldBeforeColonText
                            primary={`Weekly Schedule:`}
                        />
                        {Object.entries(user.weeklySlots).map(([day, schedules]) => {
                            if (day == '_id') return;
                            return (
                                <ListItem key={day}>
                                    <BoldBeforeColonText
                                        primary={`${day}: 
                                        ${Array.isArray(schedules) && schedules.length > 0 ? (
                                                schedules.map(
                                                    (schedule) => {
                                                        let slots = `${schedule.from.hours}.${schedule.from.minutes}
                                                            to
                                                            ${schedule.to.hours}.${schedule.to.minutes}`

                                                        return (
                                                            slots ? slots : "No slots"
                                                        )
                                                    }
                                                )
                                            ) : 'No Slots '}`}
                                    />
                                </ListItem>
                            );
                        })}
                        <BoldBeforeColonText
                            primary={`Is Contract Accepted: ${user.isContractAccepted ? 'Yes' : 'No' || 'Not specified'} `}
                        />
                        <BoldBeforeColonText
                            primary={`Is Email Verified: ${user.isEmailVerified ? 'Yes' : 'No' || 'Not specified'} `}
                        />
                    </List>}

                {
                    user.role == 'Pharmacist' && <List>

                        <BoldBeforeColonText
                            primary={`Hourly Rate: ${user.hourRate || 'Not specified'}`}
                        />
                        <BoldBeforeColonText
                            primary={`Hospital: ${user.hospital || 'Not specified'}`}
                        />
                        <BoldBeforeColonText
                            primary={`Education Background: ${user.educationBackground || 'Not specified'
                                }`}
                        />
                        {user.role == 'Doctor' &&
                            <BoldBeforeColonText
                                primary={`Specialty: ${user.specialty || 'Not specified'}`}
                            />
                        }
                    </List>}
                {user.role == 'Patient' && <PatientInfo patient={user} />}
            </CardContent>
        </Card>
    );
};

function ProfileInfo({ userID }) {
    const [user, setUser] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);


    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(`/users/${userID}`);
            const userData = await response.data.result[0];
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userID]);

    const renderProfileImage = () => {
        return (
            <Avatar
                style={{
                    width: '100px',
                    height: '100px',
                    marginBottom: '16px',
                }}
                alt="Default User"
                src={`/assets/images/profile/profile-image.png`}
            />
        );
    };
    const handleModalOpen = () => {

        setModalOpen(true);
    };
    const handleModalClose = () => {
        setModalOpen(false);
    };
    const renderBasicInfo = () => {
        if (user) {
            return (

                <Card
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        marginBottom: '16px',
                        border: '1px solid blue'
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                            Basic Information
                        </Typography>
                        <List>
                            {/* Apply BoldBeforeColonText to each ListItemText */}
                            <BoldBeforeColonText primary={`Name: ${user.name || 'Not specified'}`} />
                            <BoldBeforeColonText primary={`Email: ${user.email || 'Not specified'}`} />
                            <BoldBeforeColonText
                                primary={`Birth Date: ${new Date(user.birthDate).toLocaleDateString() || 'Not specified'}`}
                            />
                            <BoldBeforeColonText primary={`Gender: ${user.gender || 'Not specified'}`} />
                            <BoldBeforeColonText primary={`Phone: ${user.phone || 'Not specified'}`} />
                        </List>
                    </CardContent>
                </Card>
            );
        }
        return null;
    };
    const saveInfo = async (editedInfo) => {
        await axiosInstance.put('/me/info', editedInfo).then((res) => {
            localStorage.setItem('userName', editedInfo.name);
            window.location.reload()
        });
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
                alignItems: 'center', justifyContent: 'center'
            }}
        >



            <div style={{ alignItems: 'center', justifyContent: 'center' }}>{renderProfileImage()}</div>
            <div style={{ alignItems: 'center', justifyContent: 'center' }}><Typography
                variant="h4"
                style={{
                    marginBottom: '8px',
                    color: 'white',

                }}
            >
                {user && user.name || 'Name not entered'}
            </Typography>
            </div>
            <div style={{
                display: 'flex', flexDirection: 'row',
                alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center'
            }}>
                {renderBasicInfo()}
                {user && user.role != 'Admin' && <SpecificInfo user={user} />}
                {isModalOpen && <EditProfileModal user={user} onClose={handleModalClose} open={isModalOpen} onSave={saveInfo} />}

            </div>
            {isMine(user) && <Button onClick={handleModalOpen}>Edit Profile</Button>}

        </div>
    );
}

export default ProfileInfo;
