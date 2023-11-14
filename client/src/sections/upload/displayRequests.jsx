
import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import PDFViewer from './viewPDF';
import ImageViewer from './viewImage.jsx';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { axiosInstance } from '../../utils/axiosInstance';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';

const List = ({ field, array, doctorID }) => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const newRows = array?.map((item, index) => {
            let spitedFileName = String(item).split('.');
            let extension = spitedFileName[spitedFileName.length - 1];

            return (
                <Row key={index} doctorID={doctorID} text={index} field={field} extension={extension} />
            );
        });

        setRows(newRows);
    }, [array, doctorID, field]);

    return (
        <div>
            {rows}
        </div>
    );
};

const Row = ({ text, doctorID, field, extension }) => {
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
                <IconButton>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </div>
            {isExpanded && <AdditionalContent doctorID={doctorID} text={text} field={field} extension={extension} />}
        </div>
    );
};

const AdditionalContent = ({ doctorID, text, field, extension }) => {
    const [comp, setComp] = useState(<p>{text}</p>);
    const [url, setUrl] = useState(`http://localhost:3000/upload/doctor/registration/${doctorID}/${field}/${text}`);

    useEffect(() => {
        setUrl(`http://localhost:3000/upload/doctor/registration/${doctorID}/${field}/${text}`);
    }, [])

    useEffect(() => {
        console.log("----------", extension, text, "----------")
        if (['pdf', 'jpg', 'jpeg', 'png'].includes(String(extension).toLowerCase())) {
            setComp(
                String(extension).toLowerCase() === 'pdf'
                    ? <PDFViewer pdfURL={url} />
                    : <ImageViewer url={url} />
            );
        }
    }, [extension, text]);

    const contentStyle = {
        marginTop: '10px',
        marginLeft: '20px',
        border: '1px solid #b2ebf2',
        borderRadius: '5px',
        padding: '10px',
        backgroundColor: '#e0f7fa',
    };

    return (
        <div style={contentStyle}>
            {comp}
        </div>
    );
};

const DisplayRequests = ({ doctorID }) => {
    const [requests, setRequests] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(`/upload/doctor/registration/${doctorID}`);
                setRequests(res.data.result);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [doctorID]);

    const labelStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '5px',
    };

    return (
        <div>
            <div style={labelStyle}>ID</div>
            <List field={"ID"} array={[requests.ID]} doctorID={doctorID} />

            <div style={labelStyle}>Licenses</div>
            <List field={"licenses"} array={requests.licenses} doctorID={doctorID} />

            <div style={labelStyle}>Degree</div>
            <List field={"degree"} array={requests.degree} doctorID={doctorID} />
        </div>
    );
};




const DisplayRequestsView = ({ doctorID }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Button onClick={handleOpenModal}>Open Requests</Button>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
            >
                <Box sx={{ // Use sx instead of style for styling with Material-UI
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    backgroundColor: 'white', // Add background color if needed
                    padding: '20px', // Add padding if needed
                    boxShadow: 24, // Add box shadow if needed
                    borderRadius: '8px', // Add border radius if needed
                }}>
                    <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                        Requests
                    </Typography>
                    <DisplayRequests doctorID={doctorID} />
                </Box>
            </Modal>
        </div>
    );
};
export { DisplayRequestsView };
