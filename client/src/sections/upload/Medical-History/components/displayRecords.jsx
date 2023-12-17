import React, { useEffect, useState } from 'react';
import PDFViewer from '../../viewPDF';
import ImageViewer from '../../viewImage.jsx';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosInstance } from '../../../../utils/axiosInstance';

const AdditionalContent = ({ additionalContent, name, patientID }) => {
  const url = `http://localhost:3000/upload/patient/${patientID}/medicalHistory/${name}`;
  let contentComponent = <p>{additionalContent.url}</p>;

  if (['pdf', 'jpg', 'jpeg', 'png'].includes(String(additionalContent.ext).toLowerCase())) {
    contentComponent = additionalContent.ext === 'pdf' ? <PDFViewer pdfURL={url} /> : <ImageViewer url={url} />;
  }

  return <div style={{ marginTop: '10px', marginLeft: '20px' }}>{contentComponent}</div>;
};

const Row = ({ text, additionalContent, onDelete, patientID }) => {
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
      {isExpanded && <AdditionalContent additionalContent={additionalContent} name={text} patientID={patientID} />}
    </div>
  );
};

const RecordsList = ({ patientID }) => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await generateRows();
        setRows(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (text) => {
    try {
      const res = await axiosInstance.delete(`upload/patient/${patientID}/medicalHistory/${text}`);
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
    try {
      const res = await axiosInstance.get(`upload/patient/${patientID}/medicalHistory/`);
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
    } catch (error) {
      console.error('Error fetching rows:', error);
      throw error;
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', minWidth: '900px', maxWidth: '900px' }}>
      {rows.map((row, index) => (
        <Row key={index} text={row.text} additionalContent={row.additionalContent} onDelete={handleDelete} patientID={patientID} />
      ))}
    </div>
  );
};

export { RecordsList };
