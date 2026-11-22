import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { getAllOrders } from "../../services/orderService";

function formatDate(value) {
  if (!value) return "—";
  const date =
    typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderTotal(order) {
  if (order.totalAmount != null) return Number(order.totalAmount) || 0;
  if (order.total != null) return Number(order.total) || 0;
  const items = Array.isArray(order.items) ? order.items : [];
  return items.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) || 0) *
        (Number(item.quantity || item.qty) || 1),
    0
  );
}

function getOrderTimestamp(value) {
  if (!value) return 0;
  const date =
    typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function buildCustomersFromOrders(orders) {
  const map = new Map();

  orders.forEach((order) => {
    const address = order.shippingAddress || order.address || {};
    const name =
      order.customer?.name ||
      order.customerName ||
      address.name ||
      "Guest Customer";
    const phone = String(
      order.customer?.phone || order.phone || address.phone || ""
    ).trim();
    const email = String(
      order.customer?.email || order.email || address.email || ""
    ).trim();
    const city = String(address.city || order.city || "").trim();
    const state = String(address.state || order.state || "").trim();
    const location = [city, state].filter(Boolean).join(", ");

    const key =
      phone.replace(/\D/g, "") ||
      email.toLowerCase() ||
      `${name.toLowerCase()}-${order.id}`;

    const orderTotal = getOrderTotal(order);
    const ts = getOrderTimestamp(order.createdAt);

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name,
        phone,
        email,
        location,
        ordersCount: 1,
        totalSpent: orderTotal,
        lastOrderAt: order.createdAt || null,
        lastOrderTs: ts,
      });
    } else {
      const existing = map.get(key);
      const isMoreRecent = ts >= existing.lastOrderTs;

      map.set(key, {
        ...existing,
        name: existing.name === "Guest Customer" && name ? name : existing.name,
        phone: existing.phone || phone,
        email: existing.email || email,
        location: existing.location || location,
        ordersCount: existing.ordersCount + 1,
        totalSpent: existing.totalSpent + orderTotal,
        lastOrderAt: isMoreRecent ? order.createdAt : existing.lastOrderAt,
        lastOrderTs: isMoreRecent ? ts : existing.lastOrderTs,
      });
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => b.lastOrderTs - a.lastOrderTs
  );
}

function Customers() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const orderData = await getAllOrders();
      setOrders(orderData);
    } catch (err) {
      console.error("Failed to load customers:", err);
      setError("Unable to load customer records. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const customers = useMemo(
    () => buildCustomersFromOrders(orders),
    [orders]
  );

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;

    return customers.filter((customer) =>
      [
        customer.name,
        customer.phone,
        customer.email,
        customer.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [customers, search]);

  return (
    <section className="admin-products-page">
      <div className="admin-page-heading">
        <div>
          <h1>Customers</h1>
          <p>View customers who have placed orders and track their order history.</p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadCustomers}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="admin-products-toolbar">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search by customer name, phone, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="admin-error-message">
          <p>{error}</p>
          <button type="button" onClick={loadCustomers}>
            Retry
          </button>
        </div>
      )}

      <div className="admin-products-summary">
        <Users size={19} />
        <span>
          {filteredCustomers.length}{" "}
          {filteredCustomers.length === 1 ? "customer" : "customers"}
        </span>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-empty-state">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="admin-empty-state">
            <Users size={35} />
            <h3>
              {search ? "No matching customers" : "No customers yet"}
            </h3>
            <p>
              {search
                ? "Try searching with a different name, phone number, or city."
                : "Customers will appear here once orders are placed through your store."}
            </p>
          </div>
        ) : (
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.name}</strong>
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      {customer.phone && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.85rem",
                          }}
                        >
                          <Phone size={13} />
                          {customer.phone}
                        </span>
                      )}
                      {customer.email && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.82rem",
                            color: "#6e5d52",
                          }}
                        >
                          <Mail size={13} />
                          {customer.email}
                        </span>
                      )}
                      {!customer.phone && !customer.email && <span>—</span>}
                    </div>
                  </td>

                  <td>
                    {customer.location ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <MapPin size={14} />
                        {customer.location}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    <span className="admin-stock-available">
                      {customer.ordersCount}{" "}
                      {customer.ordersCount === 1 ? "order" : "orders"}
                    </span>
                  </td>

                  <td>
                    <strong>
                      ₹{Number(customer.totalSpent || 0).toLocaleString("en-IN")}
                    </strong>
                  </td>

                  <td>{formatDate(customer.lastOrderAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Customers;