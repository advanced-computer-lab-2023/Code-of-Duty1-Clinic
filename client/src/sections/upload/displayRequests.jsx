import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import PDFViewer from './viewPDF';
import ImageViewer from './viewImage.jsx';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { axiosInstance } from '../../utils/axiosInstance';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Inside the List component
// Inside the List component
const List = ({ documentType, array, doctorID }) => {
  return (
    <div>
      {/* {array && array.length > 0 && <RowHeader documentType={documentType} />} */}
      {array?.map((item, index) => {
        let spitedFileName = String(item).split('.');
        let extension = spitedFileName[spitedFileName.length - 1];
        console.log(doctorID, index);
        return <Row key={index} doctorID={doctorID} text={index} documentType={documentType} extension={extension} />;
      })}
    </div>
  );
};

const RowHeader = ({ documentType }) => {
  const rowHeaderStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px',
  };

  return (
    <div style={rowHeaderStyle}>{documentType}</div>
  );
};

const Row = ({ text, doctorID, documentType, extension }) => {
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
    marginBottom: '5px'
  };

  return (
    <div>
      <div
        style={rowStyle}
        onClick={toggleExpand}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ flex: 1 }}>{`${documentType} ${text + 1}`}</div>
        <IconButton>{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
      </div>
      {isExpanded && <AdditionalContent doctorID={doctorID} text={text} documentType={documentType} extension={extension} />}
    </div>
  );
};


const AdditionalContent = ({ doctorID, text, documentType, extension }) => {
  const [comp, setComp] = useState();
  const url = `http://localhost:3000/upload/registration/${doctorID}/${documentType}/${text}`;

  useEffect(() => {
    console.log('----------', extension, text, '----------');
    if (['pdf', 'jpg', 'jpeg', 'png'].includes(String(extension).toLowerCase())) {
      setComp(String(extension).toLowerCase() === 'pdf' ? <PDFViewer pdfURL={url} /> : <ImageViewer url={url} />);
    }
  }, [extension, text]);

  const contentStyle = {
    marginTop: '10px',
    marginLeft: '20px',
    border: '1px solid #b2ebf2',
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#e0f7fa'
  };

  return <div style={contentStyle}>{comp}</div>;
};

const DisplayRequests = ({ doctorID }) => {
  const [requests, setRequests] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/upload/doctor/registration/${doctorID}`);
        setRequests(res.data.result);
        console.log(res.data.result);
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
    overflowY: 'auto',
  };

  return (
    <div style={{ overflowY: 'auto', maxHeight: '50vh', maxWidth: '90vh', minWidth: '90vh' }}>
      <div style={labelStyle}>{requests.ID ? " " : "No uploaded "} ID</div>
      <List documentType={'ID'} array={requests.ID ? [requests.ID] : []} doctorID={doctorID} />
      <div style={labelStyle}>{(requests.licenses && requests.licenses.length > 0) ? " " : "No uploaded "} License(s)</div>
      <List documentType={'licenses'} array={requests.licenses} doctorID={doctorID} />

      <div style={labelStyle}>{(requests.degree && requests.degree.length > 0) ? " " : "No uploaded "} Degree(s)</div>
      <List documentType={'degree'} array={requests.degree} doctorID={doctorID} />
    </div>
  );
};
export { DisplayRequests };
