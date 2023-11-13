import React, { useEffect, useState } from 'react';
import PDFViewer from './viewPDF';
import ImageViewer from './viewImage.jsx';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosInstance } from '../../utils/axiosInstance';
import Snackbar from '@mui/material/Snackbar';

const AdditionalContent = ({ ContentInfo, name }) => {
    let comp = <p>{ContentInfo.url}</p>;
    // let urlParts = String(ContentInfo.url).replace(/\\/g, '/').split('/');
    let url = `http://localhost:3000/upload/patient/medicalHistory/` + name;
    url = String(url).replace(/\\/g, '/');
    if (String(ContentInfo.ext) === 'pdf') {
        comp = <PDFViewer pdfURL={url} />;
    } else if (['jpg', 'jpeg', 'png'].includes(String(ContentInfo.ext).toLowerCase())) {
        comp = <ImageViewer url={url} />;
    }

    return (
        <div style={{ marginTop: '10px', marginLeft: '20px' }}>
            {comp}
        </div>
    );
};

const Row = ({ text, ContentInfo, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const rowStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        backgroundColor: isExpanded ? '#e0f7fa' : isHovered ? '#e0f7fa' : 'transparent',
        transition: 'background-color 0.3s',
        cursor: 'pointer',
        border: '1px solid #b2ebf2',
        borderRadius: '5px',
        marginBottom: '5px',
    };

    return (
        <div>
            <div
                style={rowStyle}
                onClick={toggleExpand}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={{ flex: 1 }}>{text}</div>
                <IconButton onClick={() => onDelete(text)}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <IconButton onClick={() => onDelete(text)}>
                    <DeleteIcon />
                </IconButton>
            </div>
            {isExpanded && <AdditionalContent ContentInfo={ContentInfo} name={text} />}

        </div>
    );
};

const RecordsList = () => {
    const [rows, setRows] = useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const data = await generateRows();
            setRows(data);
        };

        fetchData();
    }, []);

    const handleDelete = async (text) => {
        const res = await axiosInstance.delete('upload/patient/medicalHistory/' + text);
        if (res.status != 200) { return; }
        const temp = rows.filter((row) => row.text != text);
        setRows(temp);
        console.log(`Delete row with text: ${text}`);
    };

    async function generateRows() {
        const rows = [];
        const res = await axiosInstance.get('upload/patient/medicalHistory/');

        const data = res.data.result;
        console.log(data + "-------")

        for (let i = 0; i < data.length; i++) {
            console.log(data[i].medicalRecord)
            let url, ext;
            if (data[i].medicalRecord) {
                url = data[i].medicalRecord.split('.');
                ext = url.length > 0 ? url[url.length - 1] : undefined;
            }
            rows.push({
                text: data[i].name,
                additionalContent: {
                    url: data[i].medicalRecord,
                    ext: ext,
                },
            });
        }

        return rows;
    }


    return (
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
            {rows.map((row, index) => (
                <Row key={index} text={row.text} ContentInfo={row.additionalContent} onDelete={handleDelete} />
            ))}

        </div>
    );
};

export { RecordsList };
