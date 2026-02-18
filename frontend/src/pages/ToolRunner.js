import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../config/tools";
import ComingSoon from "./ComingSoon";

import CompressTool from "./tools/CompressTool";
import SplitTool from "./tools/SplitTool";
import MergeTool from "./tools/MergeTool";
import RotateTool from "./tools/RotateTool";
import DeletePagesTool from "./tools/DeletePagesTool";
import ExtractPagesTool from "./tools/ExtractPagesTool";
import ProtectTool from "./tools/ProtectTool";
import UnlockTool from "./tools/UnlockTool";
import PdfToWordTool from "./tools/PdfToWordTool";
import PdfToImageTool from "./tools/PdfToImageTool";
import ImageToPdfTool from "./tools/ImageToPdfTool";
import SignPdfTool from "./tools/SignPdfTool";
import ScanToPdfTool from "./tools/ScanToPdfTool";
import NumberPagesTool from "./tools/NumberPagesTool";
import CropPdfTool from "./tools/CropPdfTool";
import WatermarkTool from "./tools/WatermarkTool";
import FormFillerTool from "./tools/FormFillerTool";
import SharePdfTool from "./tools/SharePdfTool";
import EditPdfTool from "./tools/EditPdfTool";
import AnnotatePdfTool from "./tools/AnnotatePdfTool";
import PdfReaderTool from "./tools/PdfReaderTool";
import FlattenTool from "./tools/FlattenTool";
import AutoRenameTool from "./tools/AutoRenameTool";
import ReorderPagesTool from "./tools/ReorderPagesTool";

import PdfToExcelTool from "./tools/PdfToExcelTool";
import PdfToPptTool from "./tools/PdfToPptTool";
import PdfToTextTool from "./tools/PdfToTextTool";
import WordToPdfTool from "./tools/WordToPdfTool";
import ExcelToPdfTool from "./tools/ExcelToPdfTool";
import PptToPdfTool from "./tools/PptToPdfTool";
import TextToPdfTool from "./tools/TextToPdfTool";
import OcrPdfTool from "./tools/OcrPdfTool";

const TOOL_COMPONENTS = {
  "compress": CompressTool,
  "split": SplitTool,
  "merge": MergeTool,
  "rotate": RotateTool,
  "delete-pages": DeletePagesTool,
  "extract-pages": ExtractPagesTool,
  "lock": ProtectTool,
  "unlock": UnlockTool,
  "protect": ProtectTool,
  "flatten": FlattenTool,
  "auto-rename": AutoRenameTool,
  "reorder": ReorderPagesTool,
  "pdf-to-word": PdfToWordTool,
  "pdf-to-jpg": PdfToImageTool,
  "jpg-to-pdf": ImageToPdfTool,
  "sign": SignPdfTool,
  "scan": ScanToPdfTool,
  "number-pages": NumberPagesTool,
  "crop": CropPdfTool,
  "watermark": WatermarkTool,
  "form-filler": FormFillerTool,
  "share": SharePdfTool,
  "edit": EditPdfTool,
  "annotate": AnnotatePdfTool,
  "reader": PdfReaderTool,

  "pdf-to-excel": PdfToExcelTool,
  "pdf-to-ppt": PdfToPptTool,
  "pdf-to-text": PdfToTextTool,
  "word-to-pdf": WordToPdfTool,
  "excel-to-pdf": ExcelToPdfTool,
  "ppt-to-pdf": PptToPdfTool,
  "text-to-pdf": TextToPdfTool,
  "ocr-to-pdf": OcrPdfTool,
};



export default function ToolRunner() {
  const { categoryId, toolId } = useParams();
  const navigate = useNavigate();

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const tool = category?.tools?.find((t) => t.id === toolId);

  const Comp = TOOL_COMPONENTS[toolId];

  if (Comp) return <Comp />;

  return <ComingSoon tool={tool} />;
}
