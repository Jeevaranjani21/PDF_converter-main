import { useState } from "react";
import { CATEGORIES } from "../config/tools";
import ToolCard from "../components/ToolCard";

export default function Dashboard() {
  const [active] = useState("compress");

  const category = CATEGORIES.find((c) => c.id === active);

  return (
    <div className="categoryPage">
      <div className="pageTitle">{category.title}</div>
      <div className="pageSubtitle">{category.subtitle}</div>

      <div className="toolGrid">
        {category.tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
