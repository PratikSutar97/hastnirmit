import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  FolderPlus,
  X,
} from "lucide-react";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../services/categoryService";

const COLOR_OPTIONS = [
  { label: "Pink", value: "category-pink" },
  { label: "Orange", value: "category-orange" },
  { label: "Purple", value: "category-purple" },
  { label: "Green", value: "category-green" },
  { label: "Yellow", value: "category-yellow" },
  { label: "Blue", value: "category-blue" },
];

const ICON_OPTIONS = [
  "Gem",
  "Flame",
  "Flower2",
  "House",
  "Gift",
  "Palette",
];

const emptyForm = {
  name: "",
  description: "",
  color: "category-pink",
  icon: "Gem",
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEditClick = (category) => {
    setEditingId(category.id);
    setSuccess("");
    setError("");
    setForm({
      name: category.name || "",
      description: category.description || "",
      color: category.color || "category-pink",
      icon: category.icon || "Gem",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await updateCategory(editingId, form);
        setSuccess("Category updated.");
      } else {
        await createCategory(form);
        setSuccess("Category created.");
      }
      resetForm();
      await loadCategories();
    } catch (err) {
      console.error("Category save failed:", err);
      setError(err.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete category "${category.name}"? Existing products in this category will keep their category text.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(category.id);
      setError("");
      setSuccess("");
      await deleteCategory(category.id);
      if (editingId === category.id) resetForm();
      setSuccess("Category deleted.");
      await loadCategories();
    } catch (err) {
      console.error("Category delete failed:", err);
      setError("Unable to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="admin-products-page">
      <div className="admin-page-heading">
        <div>
          <h1>Categories</h1>
          <p>Create and manage product categories for your storefront and product form.</p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadCategories}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <div className="admin-form-section">
          <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="catName">Category Name *</label>
              <input
                id="catName"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Hats, Handmade Jewellery"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="catColor">Card Accent</label>
              <select
                id="catColor"
                name="color"
                value={form.color}
                onChange={handleChange}
              >
                {COLOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="catIcon">Icon</label>
              <select
                id="catIcon"
                name="icon"
                value={form.icon}
                onChange={handleChange}
              >
                {ICON_OPTIONS.map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group full-width">
              <label htmlFor="catDescription">Short Description</label>
              <input
                id="catDescription"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Handcrafted felt & crochet hats"
              />
            </div>
          </div>

          {error && <div className="admin-error-message">{error}</div>}
          {success && <p className="admin-success-text">{success}</p>}

          <div className="admin-form-actions">
            {editingId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                <X size={16} />
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {editingId ? <Pencil size={16} /> : <Plus size={17} />}
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Category"
                  : "Add Category"}
            </button>
          </div>
        </div>
      </form>

      <div className="admin-products-summary">
        <FolderPlus size={19} />
        <span>
          {categories.length}{" "}
          {categories.length === 1 ? "category" : "categories"} total
        </span>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-empty-state">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="admin-empty-state">
            <FolderPlus size={34} />
            <h3>No categories yet</h3>
            <p>Add your first category above to show it on the Home page and in product forms.</p>
          </div>
        ) : (
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Style</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <strong>{cat.name}</strong>
                  </td>
                  <td>{cat.description || "—"}</td>
                  <td>
                    <span className="admin-status active">
                      {cat.icon || "Gem"} · {cat.color || "category-pink"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-product-actions">
                      <button
                        type="button"
                        className="admin-icon-button"
                        title="Edit category"
                        aria-label={`Edit ${cat.name}`}
                        onClick={() => handleEditClick(cat)}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        className="admin-icon-button delete"
                        title="Delete category"
                        aria-label={`Delete ${cat.name}`}
                        disabled={deletingId === cat.id}
                        onClick={() => handleDelete(cat)}
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

export default Categories;