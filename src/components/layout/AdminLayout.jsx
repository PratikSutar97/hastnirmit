import { Outlet } from "react-router-dom";
import AdminSidebar from "../../admin/components/AdminSidebar";
import AdminHeader from "../../admin/components/AdminHeader";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
