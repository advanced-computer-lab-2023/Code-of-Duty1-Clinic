function EditProfileModal({ user, open, onClose, onSave }) {
    const [editedUser, setEditedUser] = useState({});

    useEffect(() => {
        // Initialize editedUser with the current user data
        setEditedUser(user);
    }, [user]);

    const handleInputChange = (field, value) => {
        setEditedUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Call onSave with the edited user data
        onSave(editedUser);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                {/* Render form fields for editing user information */}
                <TextField
                    label="Name"
                    value={editedUser.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                />
                <TextField
                    label="Gender"
                    value={editedUser.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                />
                <TextField
                    label="Birth Date"
                    value={editedUser.birthDate || ''}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
                {user.role === 'Doctor' && (
                    <>
                        {/* Additional fields for Doctor */}
                        <TextField
                            label="Hospital"
                            value={editedUser.hospital || ''}
                            onChange={(e) => handleInputChange('hospital', e.target.value)}
                        />
                        <TextField
                            label="Specialty"
                            value={editedUser.specialty || ''}
                            onChange={(e) => handleInputChange('specialty', e.target.value)}
                        />
                        <TextField
                            label="Education Background"
                            value={editedUser.educationBackground || ''}
                            onChange={(e) => handleInputChange('educationBackground', e.target.value)}
                        />
                    </>
                )}
                {user.role === 'Pharmacist' && (
                    <>
                        {/* Additional fields for Pharmacist */}
                        <TextField
                            label="Education Background"
                            value={editedUser.educationBackground || ''}
                            onChange={(e) => handleInputChange('educationBackground', e.target.value)}
                        />
                    </>
                )}
                {user.role === 'Patient' && (
                    <>
                        {/* Additional fields for Patient */}
                        <TextField
                            label="Emergency Contact"
                            value={editedUser.emergencyContact || ''}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        />
                        {/* Add logic for deleting and adding new emergency contacts */}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileModal;