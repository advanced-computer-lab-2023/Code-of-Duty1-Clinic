import React, { useState } from 'react';
import { Worker, Viewer, ProgressBar } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
//3.11.174 version of worker 
function PDFViewer({ pdfURL }) {
  return (
    <div>
      <Worker workerUrl={`${import.meta.env.BASE_URL}pdf.worker.min2.js`}>
        <Viewer
          fileUrl={pdfURL}
          withCredentials={true}
          theme={{
            theme: 'auto'
          }}
        />
      </Worker>
    </div>
  );
}

export default PDFViewer;
