import axios from 'axios';
import { useState } from 'react';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PropTypes from 'prop-types';

export default function UploadFile({ url }) {
    const [files, setFiles] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [isFileChanged, setIsFileChanged] = useState(false);


    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        setFiles(selectedFiles);
        setIsFileChanged(true);
    };


    const handleUpload = async () => {
        const formData = new FormData();
        let len = files.length;
        while (len >= 0) {
            len -= 1;
            formData.append('medicalHistory', files[len]);
        }

        if (!files) {
            setFeedback("Choose a files");
            return;
        }

        if (!isFileChanged) {
            setFeedback("File is already uploaded");
            return;
        }

        try {
            const res = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            setFeedback(res.status === 200 ? "Uploaded successfully" : "Failed to upload");
            setIsFileChanged(false);

        } catch (error) {
            setFeedback("Failed to upload");
        }
    };

    return (
        <div>
            <Input
                type="file"
                onChange={handleFileChange}
                inputProps={{ multiple: true }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            edge="start"
                            component="label"
                            htmlFor="fileInput"
                            onClick={handleUpload}
                            type="submit"
                            disabled={!files || !isFileChanged}
                        >
                            <CloudUploadIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
            <p>{feedback}</p>
        </div>
    );
}
UploadFile.propTypes = {
    url: PropTypes.string.isRequired,

};