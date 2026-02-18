import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppShell() {
  return (
    <div className="appContainer">
      <Sidebar />
      <div className="workspace">
        <Outlet />
      </div>
    </div>
  );
}

