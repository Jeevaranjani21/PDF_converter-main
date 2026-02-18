import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function AnnotatePdfTool() {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [mode, setMode] = useState("draw"); // draw, highlight
    const [color, setColor] = useState("#ff0000");
    const [lineWidth, setLineWidth] = useState(2);

    // We store drawing paths per page: { pageNum: [ { x, y, type, color, width } ] }
    // Simplified: we'll just capture mouse events on a canvas overlay
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [paths, setPaths] = useState({}); // { 1: [path, path], ... }
    const [currentPath, setCurrentPath] = useState([]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    // Handle drawing on canvas
    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setIsDrawing(true);
        setCurrentPath([{ x: offsetX, y: offsetY }]);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        setCurrentPath(prev => [...prev, { x: offsetX, y: offsetY }]);

        // Draw immediately on canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        const lastPoint = currentPath[currentPath.length - 1];
        if (lastPoint) {
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        // Save path
        setPaths(prev => ({
            ...prev,
            [pageNumber]: [...(prev[pageNumber] || []), { points: currentPath, color, lineWidth, url: null }]
        }));
        setCurrentPath([]);
    };

    // Redraw canvas when page changes or paths change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pagePaths = paths[pageNumber] || [];
        pagePaths.forEach(p => {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.lineWidth;
            ctx.lineCap = "round";
            if (p.points.length > 0) {
                ctx.moveTo(p.points[0].x, p.points[0].y);
                for (let i = 1; i < p.points.length; i++) {
                    ctx.lineTo(p.points[i].x, p.points[i].y);
                }
                ctx.stroke();
            }
        });
    }, [pageNumber, paths]);


    const downloadPdf = async () => {
        if (!file) return;

        const fileBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const pages = pdfDoc.getPages();

        // For each page that has paths
        for (const [pageNumStr, pagePaths] of Object.entries(paths)) {
            const pageIndex = parseInt(pageNumStr) - 1;
            const page = pages[pageIndex];
            const { width, height } = page.getSize();

            // We need to map canvas coords to PDF coords
            // Canvas size is usually display size. 
            // We need to know what size the PDF was rendered at.
            // In this simple version we assume scale=1 means canvas width = pdf point width? 
            // Usually react-pdf renders at scale.

            // Ideally we would draw SVG paths onto the PDF page.
            // pdf-lib drawLine.
            // We need to flip Y axis because PDF origin is bottom-left, canvas is top-left.

            // Let's assume we rendered at 1.0 scale.
            // NOTE: This logic is approximate.

            pagePaths.forEach(p => {
                if (p.points.length < 2) return;

                const hexToRgb = (hex) => {
                    const r = parseInt(hex.slice(1, 3), 16) / 255;
                    const g = parseInt(hex.slice(3, 5), 16) / 255;
                    const b = parseInt(hex.slice(5, 7), 16) / 255;
                    return rgb(r, g, b);
                };

                const pdfColor = hexToRgb(p.color);

                // Helper to transform coord
                // Canvas Y goes down, PDF Y goes up.
                // We need the height of the RENDERED page to flip.
                // Since we don't have exact dimensions from react-pdf here easily without callbacks,
                // we can rely on page.getSize() if scale=1.

                // Improve: Use ref to get rendered dimensions.
                // For now, let's assume scale=1 matches page.getSize().

                const transform = (x, y) => {
                    return { x: x / scale, y: height - (y / scale) };
                };

                // Draw path segments
                for (let i = 0; i < p.points.length - 1; i++) {
                    const p1 = transform(p.points[i].x, p.points[i].y);
                    const p2 = transform(p.points[i + 1].x, p.points[i + 1].y);

                    page.drawLine({
                        start: p1,
                        end: p2,
                        thickness: p.lineWidth / scale,
                        color: pdfColor,
                        opacity: 1,
                    });
                }
            });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "annotated.pdf";
        a.click();
    };

    return (
        <div className="categoryPage">
            <h1 className="pageTitle">Annotate PDF</h1>
            <p className="pageSubtitle">Draw and highlight on your PDF.</p>

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
                    <div style={{ marginBottom: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <button onClick={() => setPageNumber(n => Math.max(1, n - 1))} disabled={pageNumber <= 1}>Prev</button>
                        <span>Page {pageNumber} of {numPages}</span>
                        <button onClick={() => setPageNumber(n => Math.min(numPages, n + 1))} disabled={pageNumber >= numPages}>Next</button>

                        <div style={{ width: 20 }}></div>

                        <label>Color: <input type="color" value={color} onChange={e => setColor(e.target.value)} /></label>
                        <label>Width: <input type="number" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} style={{ width: 50 }} /></label>

                        <div style={{ flex: 1 }}></div>
                        <button onClick={downloadPdf} style={{ background: "#0f172a", color: "white", padding: "8px 16px", borderRadius: 8 }}>Download PDF</button>
                    </div>

                    <div style={{ position: "relative", border: "1px solid #ddd", display: "inline-block" }}>
                        {/* PDF Layer */}
                        <div style={{ pointerEvents: "none" }}>
                            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    onLoadSuccess={(page) => {
                                        // Resize canvas to match page
                                        const viewport = page.getViewport({ scale });
                                        if (canvasRef.current) {
                                            canvasRef.current.width = viewport.width;
                                            canvasRef.current.height = viewport.height;
                                        }
                                    }}
                                />
                            </Document>
                        </div>

                        {/* Canvas Layer */}
                        <canvas
                            ref={canvasRef}
                            style={{ position: "absolute", top: 0, left: 0, touchAction: "none", cursor: "crosshair" }}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
