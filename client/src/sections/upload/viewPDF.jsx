import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

function PDFViewer({ pdfURL }) {
    return (
        <div>
            <Worker workerUrl={`${import.meta.env.BASE_URL}pdf.worker.min.js`}>
                <Viewer
                    fileUrl={pdfURL}
                // onPageChange={({ pageNumber }) => setPageNumber(pageNumber)}
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
