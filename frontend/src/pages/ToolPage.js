import { useParams } from "react-router-dom";
import UploadDropzone from "../components/UploadDropzone";

export default function ToolPage() {
  const { toolId } = useParams();

  return (
    <div>
      <h2>{toolId.toUpperCase()}</h2>
      <UploadDropzone />
    </div>
  );
}
