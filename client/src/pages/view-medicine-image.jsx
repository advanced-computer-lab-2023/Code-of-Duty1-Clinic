import React, { useState, useEffect } from 'react';
import { MedicineImage } from 'src/sections/upload/medicineImage';

function ViewMedicineImage() {
    const [medicineID, setMedicineID] = useState('');
    const [showImage, setShowImage] = useState(false);

    const handleMedicineIDChange = (event) => {
        setMedicineID(event.target.value);
    };

    const handleButtonClick = () => {
        // Use the current value of medicineID directly
        setShowImage(true);
    };

    useEffect(() => {
        // Use the updated medicineID when showImage is true
        if (showImage) {
            // Fetch or perform any action using medicineID
            console.log('Fetching data for medicineID:', medicineID);
        }
    }, [showImage, medicineID]);

    return (
        <div>
            <div>
                <label htmlFor="medicineID">Medicine ID:</label>
                <input
                    type="text"
                    id="medicineID"
                    value={medicineID}
                    onChange={handleMedicineIDChange}
                />
            </div>

            <button onClick={handleButtonClick}>Show Image</button>

            {showImage && <MedicineImage medicineID={medicineID} />}
        </div>
    );
}

export default ViewMedicineImage;
