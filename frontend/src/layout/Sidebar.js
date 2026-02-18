import React from "react";
import { NavLink } from "react-router-dom";
import { CATEGORIES } from "../config/tools";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">PDF Pro</div>

      <nav className="menu">
        {CATEGORIES.map((cat) => (
          <NavLink
            key={cat.id}
            to={`/category/${cat.id}`}
            className={({ isActive }) => "menuItem" + (isActive ? " active" : "")}
          >
            {cat.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
