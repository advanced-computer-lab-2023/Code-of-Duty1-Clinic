import React, { useEffect, useState } from 'react';
import PDFViewer from './viewPDF';
import ImageViewer from './viewImage.jsx';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosInstance } from '../../utils/axiosInstance';

const AdditionalContent = ({ ContentInfo, name }) => {
    const url = `http://localhost:3000/upload/patient/medicalHistory/${name}`;
    let comp = <p>{ContentInfo.url}</p>;

    if (['pdf', 'jpg', 'jpeg', 'png'].includes(String(ContentInfo.ext).toLowerCase())) {
        comp = ContentInfo.ext === 'pdf' ? <PDFViewer pdfURL={url} /> : <ImageViewer url={url} />;
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
        backgroundColor: isExpanded || isHovered ? '#e0f7fa' : 'transparent',
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await generateRows();
                setRows(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (text) => {
        try {
            const res = await axiosInstance.delete(`upload/patient/medicalHistory/${text}`);
            if (res.status === 200) {
                const temp = rows.filter((row) => row.text !== text);
                setRows(temp);
                console.log(`Deleted row with text: ${text}`);
            }
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    async function generateRows() {
        const res = await axiosInstance.get('upload/patient/medicalHistory/');
        const data = res.data.result;

        return data.map((item) => {
            const urlParts = item.medicalRecord?.split('.');
            const ext = urlParts?.length > 0 ? urlParts[urlParts.length - 1].toLowerCase() : undefined;

            return {
                text: item.name,
                additionalContent: {
                    url: item.medicalRecord,
                    ext: ext,
                },
            };
        });
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
