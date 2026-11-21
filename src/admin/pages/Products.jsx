
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Package,
} from "lucide-react";

import { useProducts } from "../../hooks/useProducts";
import { deleteProduct } from "../../services/productService";

function Products() {
  const { products, loading, error, refreshProducts } = useProducts({
    admin: true,
  });

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [
        product.name,
        product.category,
        product.slug,
        product.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [products, search]);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product.id);
      await deleteProduct(product.id);
      await refreshProducts();
    } catch (err) {
      console.error("Product deletion failed:", err);
      window.alert("Unable to delete this product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="admin-products-page">
      <div className="admin-page-heading">
        <div>
          <h1>Products</h1>
          <p>Manage your store products and inventory.</p>
        </div>

        <Link to="/admin/products/add" className="admin-primary-button">
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="admin-products-toolbar">
        <div className="admin-search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={refreshProducts}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="admin-error-message">
          <p>{error}</p>
          <button type="button" onClick={refreshProducts}>
            Try again
          </button>
        </div>
      )}

      <div className="admin-products-summary">
        <Package size={19} />
        <span>
          {products.length} {products.length === 1 ? "product" : "products"} total
        </span>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-empty-state">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty-state">
            <Package size={35} />
            <h3>{search ? "No matching products" : "No products yet"}</h3>
            <p>
              {search
                ? "Try another search term."
                : "Add your first product to start managing your store."}
            </p>

            {!search && (
              <Link
                to="/admin/products/add"
                className="admin-primary-button"
              >
                <Plus size={17} />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-cell">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                        />
                      ) : (
                        <div className="admin-product-placeholder">
                          <Package size={20} />
                        </div>
                      )}

                      <div>
                        <strong>{product.name}</strong>
                        <small>{product.slug}</small>
                      </div>
                    </div>
                  </td>

                  <td>{product.category || "—"}</td>

                  <td>₹{Number(product.price || 0).toLocaleString("en-IN")}</td>

                  <td>
                    <span
                      className={
                        Number(product.stock) <= 0
                          ? "admin-stock-out"
                          : Number(product.stock) <= 5
                            ? "admin-stock-low"
                            : "admin-stock-available"
                      }
                    >
                      {product.stock ?? 0}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`admin-status ${
                        product.status === "active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {product.status || "inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-product-actions">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="admin-icon-button"
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil size={17} />
                      </Link>

                      <button
                        type="button"
                        className="admin-icon-button delete"
                        title="Delete product"
                        aria-label={`Delete ${product.name}`}
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Products;
