import axios from 'axios';
import { useState } from 'react';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PropTypes from 'prop-types';
import { axiosInstance } from '../../utils/axiosInstance';
import Label from 'src/components/label';

function Upload({ url, field, handleUploadSuccess, fileName }) {
    const [files, setFiles] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [isFileChanged, setIsFileChanged] = useState(false);
    const [labelColor, setLabelColor] = useState('green');



    const isAllowed = (files) => {
        let len = files.length;
        // console.log(files, "++++");
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
        if (len > 10) {
            return false;
        }
        while (len > 0) {
            len -= 1;
            console.log(files[len], "------", len);
            if (!allowedTypes.includes(files[len].type))
                return false;
        }
        return true;
    };
    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        if (!isAllowed(selectedFiles)) {
            setFeedback("maximum of 10 PDFs or images(png,jpg,jpeg) are allowed ");
            setLabelColor('red');
            return;
        }

        console.log(selectedFiles);
        setFiles(selectedFiles);
        setIsFileChanged(true);
        setFeedback("");
    };


    const handleUpload = async () => {
        const formData = new FormData();
        let len = files.length;
        while (len > 0) {
            len -= 1;
            formData.append(field, files[len]);
        }

        if (!files) {
            setFeedback("Choose a files");
            setLabelColor(red);
            return;
        }

        if (!isFileChanged) {
            setFeedback("File is already uploaded");
            setLabelColor(red);

            return;
        }

        try {
            formData.append("fileName", fileName);
            const res = await axiosInstance.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (res.status == 200) {
                handleUploadSuccess(field);
            }
            setLabelColor(res.status === 200 ? 'green' : 'red');
            setFeedback(res.status === 200 ? "Uploaded successfully" : "Failed to upload");
            setIsFileChanged(false);

        } catch (error) {
            setFeedback("Failed to upload");
            setLabelColor('red');
        }
    };

    return (
        <div style={{ width: '100%' }}>
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

            <Label style={{ color: labelColor }}>{feedback}</Label>

            <p></p>

        </div>
    );
}
Upload.propTypes = {
    url: PropTypes.string.isRequired,

};

export default Upload;