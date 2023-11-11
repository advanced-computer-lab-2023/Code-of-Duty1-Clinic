import React, { useEffect, useState } from 'react';
import PDFViewer from './viewPDF';
import ImageViewer from './viewImage.jsx';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const AdditionalContent = ({ ContentInfo }) => {
    let comp = <p>{ContentInfo.url}</p>;
    let urlParts = String(ContentInfo.url).replace(/\\/g, '/').split('/');
    let url = `http://localhost:3000/upload/patient/medicalHistory/` + urlParts[urlParts.length - 1];
    // console.log(url, "*-*-*-*-*-*-*")
    if (String(ContentInfo.ext) === 'pdf') {
        comp = <PDFViewer pdfURL={url} />;
    } else if (['jpg', 'jpeg', 'png'].includes(String(ContentInfo.ext).toLowerCase())) {
        comp = <ImageViewer imageURL={url} />;
    }

    return (
        <div style={{ marginTop: '10px', marginLeft: '20px' }}>
            {comp}
        </div>
    );
};
const Row = ({ text, ContentInfo }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const rowStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px',
        backgroundColor: isExpanded ? '#b2ebf2' : isHovered ? '#b2ebf2' : 'transparent',
        transition: 'background-color 0.3s',
        cursor: 'pointer',
        border: '1px solid transparent',
    };

    return (
        <div>
            <div
                style={rowStyle}
                onClick={toggleExpand}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div>{text}</div>
                <IconButton>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </div>
            {isExpanded && <AdditionalContent ContentInfo={ContentInfo} />}
        </div>
    );
}; const RecordsList = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await generateRows();
            setRows(data);
        };

        fetchData();
    }, []);

    async function generateRows() {
        const rows = [];
        const res = await axios.get('http://localhost:3000/upload/patient/medicalHistory/');

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
        <div>
            {rows.map((row, index) => (
                <Row key={index} text={row.text} ContentInfo={row.additionalContent} />
            ))}
        </div>
    );
};

export default RecordsList;
