import { useNavigate } from "react-router-dom";

export default function ToolCard({ tool }) {
  const navigate = useNavigate();

  return (
    <div
      className="toolCard"
      onClick={() => navigate(`/tool/${tool.id}`)}
    >
      <div>
        <div className="toolName">{tool.name}</div>
        <div className="toolDesc">{tool.desc}</div>
      </div>
    </div>
  );
}
