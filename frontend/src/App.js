import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import CategoryPage from "./pages/CategoryPage";
import ToolRunner from "./pages/ToolRunner";

export default function App() {
  return (
    <BrowserRouter>
      <div className="appContainer">
        <Sidebar />

        <main className="workspace">
          <Routes>
            {/* default route */}
            <Route path="/" element={<Navigate to="/category/compress" replace />} />

            {/* category page shows tools grid */}
            <Route path="/category/:categoryId" element={<CategoryPage />} />

            {/* tool page (next step we will build real UI per tool) */}
            <Route path="/tool/:categoryId/:toolId" element={<ToolRunner />} />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/category/compress" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
