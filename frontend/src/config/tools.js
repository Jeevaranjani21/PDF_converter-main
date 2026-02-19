export const CATEGORIES = [
  {
    id: "compress",
    title: "Compress",
    subtitle: "Reduce PDF size without losing quality.",
    tools: [
      {
        id: "compress",
        name: "Compress PDF",
        desc: "Compress a PDF and download an optimized version.",
      },
    ],
  },

  {
    id: "organize",
    title: "Organize",
    subtitle: "Split, merge, rotate, delete, extract, reorder and manage pages.",
    tools: [
      { id: "split", name: "Split PDF", desc: "Split by range, every N pages, or into single pages.", icon: "✂️" },
      { id: "auto-rename", name: "Auto Rename", desc: "Rename split files in bulk using list/Excel names." },
      { id: "rotate", name: "Rotate Pages", desc: "Rotate selected or all pages inside a PDF." },
      { id: "delete-pages", name: "Delete Pages", desc: "Remove unwanted pages from a PDF." },
      { id: "extract-pages", name: "Extract Pages", desc: "Extract selected pages into a new PDF." },
      { id: "reorder", name: "Reorder Pages", desc: "Drag & reorder pages to create a new PDF order." },
      { id: "merge", name: "Merge PDF", desc: "Combine multiple PDF files into one PDF." },
    ],
  },

  {
    id: "view-edit",
    title: "View & Edit",
    subtitle: "Read, annotate, edit pages and add elements.",
    tools: [
      { id: "edit", name: "Edit PDF", desc: "Edit pages and objects inside the PDF." },
      { id: "annotate", name: "Annotate PDF", desc: "Highlight, draw, add notes and shapes." },
      { id: "reader", name: "PDF Reader", desc: "Read PDFs with zoom, search and page navigation." },
      { id: "number-pages", name: "Number Pages", desc: "Add page numbers in your preferred style and position." },
      { id: "crop", name: "Crop PDF", desc: "Crop margins or selected areas of pages." },
      { id: "watermark", name: "Watermark", desc: "Add text watermark to protect documents." },
      { id: "form-filler", name: "PDF Form Filler", desc: "Fill PDF forms and export the completed file." },
      { id: "share", name: "Share PDF", desc: "Generate a shareable link for your PDF." },
    ],
  },

  {
    id: "convert",
    title: "Convert",
    subtitle: "Convert from PDF or convert other files into PDF.",
    tools: [
      // Convert FROM PDF
      { id: "pdf-to-word", name: "PDF to Word", desc: "Convert PDF into editable DOCX." },
      { id: "pdf-to-excel", name: "PDF to Excel", desc: "Convert PDF tables into Excel format." },
      { id: "pdf-to-ppt", name: "PDF to PPT", desc: "Convert PDF slides into PowerPoint." },
      { id: "pdf-to-jpg", name: "PDF to JPG", desc: "Export PDF pages as images." },
      { id: "pdf-to-text", name: "PDF to Text", desc: "Extract text content from PDF." },

      // Convert TO PDF
      { id: "word-to-pdf", name: "Word to PDF", desc: "Convert DOC/DOCX into PDF." },
      { id: "excel-to-pdf", name: "Excel to PDF", desc: "Convert XLS/XLSX into PDF." },
      { id: "ppt-to-pdf", name: "PPT to PDF", desc: "Convert PPT/PPTX into PDF." },
      { id: "jpg-to-pdf", name: "JPG to PDF", desc: "Convert JPG/PNG images into a single PDF." },
      { id: "text-to-pdf", name: "Text to PDF", desc: "Convert TXT into PDF." },
      { id: "ocr-to-pdf", name: "OCR", desc: "Scan-based PDF to selectable/searchable PDF using OCR." },
    ],
  },

  {
    id: "sign",
    title: "Sign PDF",
    subtitle: "Upload a PDF and add signatures professionally.",
    tools: [
      { id: "sign", name: "Sign PDF", desc: "Upload PDF and place your signature on pages." },
    ],
  },

  {
    id: "security",
    title: "Security",
    subtitle: "Protect, lock and flatten documents.",
    tools: [
      { id: "lock", name: "Lock PDF", desc: "Password-protect a PDF." },
      { id: "unlock", name: "Unlock PDF", desc: "Remove password security from a PDF." },
      { id: "protect", name: "Protect PDF", desc: "Restrict printing/editing and secure access." },
      { id: "flatten", name: "Flatten PDF", desc: "Flatten annotations and form fields permanently." },
    ],
  },

  {
    id: "scan",
    title: "Scan",
    subtitle: "Scan documents and create PDFs.",
    tools: [
      { id: "scan", name: "Scan to PDF", desc: "Open scanning page and create a PDF from scanned pages." },
    ],
  },

  
];

