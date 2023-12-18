import React from 'react';
import ProfileInfo from '../component/profileInfo';

const ProfileView = ({ userID }) => {
    const containerStyle = {
        position: 'relative',
        height: '300px',  // Adjust the height as needed
    };

    const backgroundImageStyle = {
        backgroundImage: `url('/assets/images/profile/profile-background.jpg')`,  // Replace with the actual path to your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '-1',
        borderRadius: '16px',

    };

    return (
        <div style={containerStyle}>
            <div style={backgroundImageStyle}></div>
            <ProfileInfo userID={userID} />
        </div>
    );
};

export default ProfileView;
