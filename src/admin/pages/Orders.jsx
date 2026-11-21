import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { getAllOrders, updateOrderStatus } from "../../services/orderService";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function formatDate(value) {
  if (!value) return "—";
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
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
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity || item.qty) || 1),
    0
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const counts = useMemo(() => {
    const map = { all: orders.length };
    ORDER_STATUSES.forEach((s) => {
      map[s] = 0;
    });
    orders.forEach((o) => {
      const s = (o.status || "pending").toLowerCase();
      map[s] = (map[s] || 0) + 1;
    });
    return map;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      const currentStatus = (order.status || "pending").toLowerCase();
      if (statusFilter !== "all" && currentStatus !== statusFilter) {
        return false;
      }

      if (!q) return true;

      const customerName =
        order.customer?.name || order.customerName || order.shippingAddress?.name || "";
      const customerPhone =
        order.customer?.phone || order.phone || order.shippingAddress?.phone || "";
      const orderNum = order.orderNumber || order.id || "";

      return [orderNum, customerName, customerPhone, currentStatus]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (order, nextStatus) => {
    setError("");
    setStatusMessage("");
    try {
      setUpdatingId(order.id);
      await updateOrderStatus(order.id, nextStatus);
      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id ? { ...item, status: nextStatus } : item
        )
      );
      setStatusMessage(
        `Order ${order.orderNumber || order.id} marked as ${nextStatus}.`
      );
    } catch (err) {
      console.error("Order status update failed:", err);
      setError("Unable to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="admin-products-page">
      <div className="admin-page-heading">
        <div>
          <h1>Orders</h1>
          <p>View customer orders, inspect items, and update fulfillment status.</p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadOrders}
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
            placeholder="Search by order ID, customer, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-pill-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All ({counts.all || 0})
          </button>

          {ORDER_STATUSES.map((st) => (
            <button
              key={st}
              type="button"
              className={`admin-pill-btn ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)} ({counts[st] || 0})
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="admin-error-message">
          <p>{error}</p>
        </div>
      )}

      {statusMessage && <p className="admin-success-text">{statusMessage}</p>}

      <div className="admin-products-summary">
        <ShoppingBag size={19} />
        <span>
          {filteredOrders.length}{" "}
          {filteredOrders.length === 1 ? "order" : "orders"} shown
        </span>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-empty-state">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-empty-state">
            <ShoppingBag size={35} />
            <h3>
              {search || statusFilter !== "all"
                ? "No matching orders"
                : "No orders yet"}
            </h3>
            <p>
              {search || statusFilter !== "all"
                ? "Try clearing your search or changing the status filter."
                : "Customer orders placed through checkout will appear here."}
            </p>
          </div>
        ) : (
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const customerName =
                  order.customer?.name ||
                  order.customerName ||
                  order.shippingAddress?.name ||
                  "Guest";
                const customerPhone =
                  order.customer?.phone ||
                  order.phone ||
                  order.shippingAddress?.phone ||
                  "";
                const currentStatus = (order.status || "pending").toLowerCase();
                const items = Array.isArray(order.items) ? order.items : [];
                const isExpanded = expandedId === order.id;

                return (
                  <FragmentRow
                    key={order.id}
                    order={order}
                    customerName={customerName}
                    customerPhone={customerPhone}
                    currentStatus={currentStatus}
                    total={getOrderTotal(order)}
                    items={items}
                    isExpanded={isExpanded}
                    updating={updatingId === order.id}
                    onStatusChange={handleStatusChange}
                    onToggleExpand={() => toggleExpand(order.id)}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function FragmentRow({
  order,
  customerName,
  customerPhone,
  currentStatus,
  total,
  items,
  isExpanded,
  updating,
  onStatusChange,
  onToggleExpand,
}) {
  const address = order.shippingAddress || order.address || {};

  return (
    <>
      <tr>
        <td>
          <strong>#{order.orderNumber || order.id.slice(0, 8)}</strong>
          <br />
          <small>
            {items.length} {items.length === 1 ? "item" : "items"}
          </small>
        </td>

        <td>
          <strong>{customerName}</strong>
          {customerPhone && (
            <>
              <br />
              <small>{customerPhone}</small>
            </>
          )}
        </td>

        <td>{formatDate(order.createdAt)}</td>

        <td>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </td>

        <td>
          <select
            className="admin-order-status-select"
            value={currentStatus}
            disabled={updating}
            onChange={(e) => onStatusChange(order, e.target.value)}
            aria-label={`Order status for ${order.orderNumber || order.id}`}
          >
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </option>
            ))}
          </select>
        </td>

        <td>
          <button
            type="button"
            className="admin-secondary-button"
            onClick={onToggleExpand}
          >
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {isExpanded ? "Hide" : "Items"}
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className="admin-order-detail-row">
          <td colSpan={6}>
            <div className="admin-order-details-box">
              <div>
                <strong>Items</strong>
                {items.length === 0 ? (
                  <p>No line items recorded.</p>
                ) : (
                  <ul className="admin-order-items-list">
                    {items.map((item, idx) => (
                      <li key={item.id || item.productId || idx}>
                        <span>
                          {item.name || "Product"} × {item.quantity || item.qty || 1}
                        </span>
                        <strong>
                          ₹
                          {(
                            (Number(item.price) || 0) *
                            (Number(item.quantity || item.qty) || 1)
                          ).toLocaleString("en-IN")}
                        </strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <strong>Delivery Details</strong>
                <p>
                  {[
                    address.line1 || address.street || address.address,
                    address.city,
                    address.state,
                    address.pincode || address.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "No shipping address provided."}
                </p>
                {order.notes && (
                  <p>
                    <strong>Note:</strong> {order.notes}
                  </p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default Orders;