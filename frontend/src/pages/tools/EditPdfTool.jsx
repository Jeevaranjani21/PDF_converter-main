import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function EditPdfTool() {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    // Elements: text
    const [textMode, setTextMode] = useState(false);
    const [inputText, setInputText] = useState("Sample Text");
    const [textSize, setTextSize] = useState(24);
    const [textColor, setTextColor] = useState("#000000");
    const [addedTexts, setAddedTexts] = useState({}); // { 1: [{x, y, text, size, color}] }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const handlePageClick = (e) => {
        if (!textMode) return;

        const { offsetX, offsetY } = e.nativeEvent;

        // Add text at this position
        setAddedTexts(prev => ({
            ...prev,
            [pageNumber]: [...(prev[pageNumber] || []), {
                x: offsetX,
                y: offsetY,
                text: inputText,
                size: textSize,
                color: textColor
            }]
        }));
    };

    const downloadPdf = async () => {
        if (!file) return;

        const fileBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const pages = pdfDoc.getPages();
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        for (const [pageNumStr, texts] of Object.entries(addedTexts)) {
            const pageIndex = parseInt(pageNumStr) - 1;
            const page = pages[pageIndex];
            const { height } = page.getSize();

            texts.forEach(t => {
                const hexToRgb = (hex) => {
                    const r = parseInt(hex.slice(1, 3), 16) / 255;
                    const g = parseInt(hex.slice(3, 5), 16) / 255;
                    const b = parseInt(hex.slice(5, 7), 16) / 255;
                    return rgb(r, g, b);
                };

                const pdfX = t.x / scale;
                const pdfY = height - (t.y / scale); // Flip Y explicitly

                try {
                    page.drawText(t.text, {
                        x: pdfX,
                        y: pdfY, // Text is drawn from bottom-left baseline
                        size: t.size / scale,
                        font: helveticaFont,
                        color: hexToRgb(t.color),
                    });
                } catch (err) {
                    console.error("Error drawing text", err);
                }
            });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "edited.pdf";
        a.click();
    };

    return (
        <div className="categoryPage">
            <h1 className="pageTitle">Edit PDF</h1>
            <p className="pageSubtitle">Add text to your PDF pages.</p>

            {!file && (
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
            )}

            {file && (
                <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", background: "white", padding: 10, borderRadius: 10, border: "1px solid #eee" }}>
                        <button onClick={() => setPageNumber(n => Math.max(1, n - 1))} disabled={pageNumber <= 1}>&lt;</button>
                        <span>Page {pageNumber}</span>
                        <button onClick={() => setPageNumber(n => Math.min(numPages, n + 1))} disabled={pageNumber >= numPages}>&gt;</button>

                        <div style={{ width: 20, borderLeft: "1px solid #ddd" }}></div>

                        <label style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <input type="checkbox" checked={textMode} onChange={e => setTextMode(e.target.checked)} />
                            <b>Add Text Mode</b>
                        </label>

                        {textMode && (
                            <>
                                <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} style={{ width: 120 }} />
                                <input type="number" value={textSize} onChange={e => setTextSize(Number(e.target.value))} style={{ width: 50 }} />
                                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} />
                            </>
                        )}

                        <div style={{ flex: 1 }}></div>
                        <button onClick={downloadPdf} style={{ background: "#0f172a", color: "white", padding: "8px 16px", borderRadius: 8 }}>Download PDF</button>
                    </div>

                    <div style={{ position: "relative", border: "1px solid #ddd", display: "inline-block", cursor: textMode ? "text" : "default" }} onClick={handlePageClick}>
                        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        </Document>

                        {/* Text Overlay */}
                        {(addedTexts[pageNumber] || []).map((t, i) => (
                            <div key={i} style={{
                                position: "absolute",
                                left: t.x,
                                top: t.y,
                                fontSize: t.size,
                                color: t.color,
                                marginTop: -t.size, // Adjust for baseline roughly
                                pointerEvents: "none",
                                whiteSpace: "nowrap",
                                fontFamily: "Helvetica, sans-serif"
                            }}>
                                {t.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
