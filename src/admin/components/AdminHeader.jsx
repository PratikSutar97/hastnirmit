import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function AdminHeader({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h3>Store Management</h3>
          <p>Manage your Hastnirmit store</p>
        </div>
      </div>

      <div className="admin-header-user">
        <span>{user?.email}</span>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;