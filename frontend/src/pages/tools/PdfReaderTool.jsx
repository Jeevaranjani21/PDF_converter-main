import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfReaderTool() {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.0);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="categoryPage">
            <h1 className="pageTitle">PDF Reader</h1>
            <p className="pageSubtitle">View and read PDF documents.</p>

            <div style={{ marginTop: 18 }}></div>

            <div className="toolCard">
                <div style={{ width: "100%" }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>1) Upload PDF</div>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
            </div>

            {file && (
                <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 10, display: "flex", gap: 10, alignItems: "center" }}>
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</button>
                        <span>Zoom: {Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))}>+</button>
                    </div>

                    <div style={{ border: "1px solid #ddd", height: "600px", overflow: "auto", background: "#f1f5f9", padding: 20 }}>
                        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                            {Array.from(new Array(numPages), (el, index) => (
                                <div key={`page_${index + 1}`} style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
                                    <Page pageNumber={index + 1} scale={scale} renderTextLayer={true} renderAnnotationLayer={true} />
                                </div>
                            ))}
                        </Document>
                    </div>
                </div>
            )}
        </div>
    );
}
