import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 admin-sidebar">
        <AdminNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 admin-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
