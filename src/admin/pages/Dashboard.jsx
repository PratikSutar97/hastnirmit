import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getCountFromServer,
} from "firebase/firestore";

import { db } from "../../config/firebase";

const initialStats = {
  products: 0,
  categories: 0,
  orders: 0,
  customers: 0,
};

function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const collections = [
          "products",
          "categories",
          "orders",
          "customers",
        ];

        const results = await Promise.all(
          collections.map((name) =>
            getCountFromServer(collection(db, name))
          )
        );

        if (active) {
          setStats({
            products: results[0].data().count,
            categories: results[1].data().count,
            orders: results[2].data().count,
            customers: results[3].data().count,
          });
        }
      } catch (err) {
        console.error("Dashboard loading failed:", err);

        if (active) {
          setError(
            "Unable to load dashboard statistics. Check your Firestore permissions."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      label: "Total Products",
      value: stats.products,
      icon: "□",
      to: "/admin/products",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: "▤",
      to: "/admin/categories",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: "▣",
      to: "/admin/orders",
    },
    {
      label: "Customers",
      value: stats.customers,
      icon: "♙",
      to: "/admin/customers",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your store performance.</p>
        </div>
      </div>

      {error && (
        <div className="admin-dashboard-error" role="alert">
          {error}
        </div>
      )}

      <div className="admin-stats-grid">
        {cards.map((card) => (
          <Link
            to={card.to}
            className="admin-stat-card admin-stat-card-link"
            key={card.label}
          >
            <div className="admin-stat-icon">{card.icon}</div>

            <div>
              <p>{card.label}</p>
              <h2>
                {loading ? "..." : card.value.toLocaleString("en-IN")}
              </h2>
            </div>
          </Link>
        ))}
      </div>

      <section className="admin-welcome-card">
        <h2>Welcome to Hastnirmit Admin</h2>
        <p>
          Manage your handmade products, categories and inventory
          from this dashboard.
        </p>
      </section>
    </div>
  );
}

export default Dashboard;