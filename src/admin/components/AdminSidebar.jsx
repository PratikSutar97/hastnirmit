import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: "▦", end: true },
  { label: "Products", path: "/admin/products", icon: "□" },
  { label: "Categories", path: "/admin/categories", icon: "▤" },
  { label: "Inventory", path: "/admin/inventory", icon: "▥" },
  { label: "Orders", path: "/admin/orders", icon: "▣" },
  { label: "Customers", path: "/admin/customers", icon: "♙" },
  { label: "Settings", path: "/admin/settings", icon: "⚙" },
];

function AdminSidebar({ isOpen = false, onClose }) {
  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="admin-sidebar-brand">
        <div>
          <h2>Hastnirmit</h2>
          <span>STORE ADMIN</span>
        </div>

        <button
          type="button"
          className="admin-sidebar-close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="admin-nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        Store Management
      </div>
    </aside>
  );
}

export default AdminSidebar;