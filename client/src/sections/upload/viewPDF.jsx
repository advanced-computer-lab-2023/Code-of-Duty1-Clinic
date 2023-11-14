import React, { useState } from 'react';
import { Worker, Viewer, ProgressBar } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

function PDFViewer({ pdfURL }) {
  return (
    <div>
      <Worker workerUrl={`${import.meta.env.BASE_URL}pdf.worker.min.js`}>
        <Viewer
          fileUrl={pdfURL}
          withCredentials={true}
          // renderLoader={(percentages) => (
          //     <div style={{ width: '240px' }}>
          //         <ProgressBar progress={Math.round(percentages)} />
          //     </div>
          // )}
          theme={{
            theme: 'auto'
          }}
        />
      </Worker>
    </div>
  );
}

export default PDFViewer;
