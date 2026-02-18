import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../config/tools";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const category = CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="categoryPage">
        <h1 className="pageTitle">Category not found</h1>
        <p className="pageSubtitle">Check your sidebar links.</p>
      </div>
    );
  }

  return (
    <div className="categoryPage">
      <h1 className="pageTitle">{category.title}</h1>
      <p className="pageSubtitle">{category.subtitle}</p>

      <div className="toolGrid">
        {category.tools.map((t) => (
          <div
            key={t.id}
            className="toolCard"
            onClick={() => navigate(`/tool/${category.id}/${t.id}`)}
          >
            <div className="toolIcon">📄</div>
            <div>
              <h3 className="toolName">{t.name}</h3>
              <p className="toolDesc">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


