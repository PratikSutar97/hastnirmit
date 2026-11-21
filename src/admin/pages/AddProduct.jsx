import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

import { createProduct } from "../../services/productService";
import { uploadProductImages } from "../../services/imageService";
import { getAllCategories } from "../../services/categoryService";

const initialForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  originalPrice: "",
  stock: "0",
  label: "",
  imageUrlInput: "",
  tags: "",
  featured: false,
  isNew: false,
  status: "active",
};

function generateSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitUrlInput(raw) {
  return String(raw || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAllCategories()
      .then((data) => {
        if (active) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddUrls = () => {
    const parsed = splitUrlInput(form.imageUrlInput);
    if (!parsed.length) return;

    setImageUrls((prev) => [...prev, ...parsed]);
    setForm((prev) => ({ ...prev, imageUrlInput: "" }));
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || !files.length) return;

    setError("");
    try {
      setUploading(true);
      const uploadedUrls = await uploadProductImages(files);
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError(err.message || "Failed to upload selected images.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    const originalPrice =
      form.originalPrice.trim() === ""
        ? null
        : Number(form.originalPrice);

    const stock = Number(form.stock);

    if (!form.name.trim() || !form.category.trim()) {
      setError("Product name and category are required.");
      return;
    }

    if (!generateSlug(form.name)) {
      setError("Please enter a valid product name.");
      return;
    }

    if (!form.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid selling price.");
      return;
    }

    if (
      originalPrice !== null &&
      (!Number.isFinite(originalPrice) || originalPrice <= price)
    ) {
      setError("Original price must be greater than selling price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    const pendingTypedUrls = splitUrlInput(form.imageUrlInput);
    const finalImages = [...imageUrls, ...pendingTypedUrls];

    const productData = {
      name: form.name.trim(),
      slug: generateSlug(form.name),
      category: form.category.trim(),
      description: form.description.trim(),
      price,
      originalPrice,
      stock,
      label: form.label.trim(),
      images: finalImages,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured: form.featured,
      isNew: form.isNew,
      status: form.status,
    };

    try {
      setSaving(true);

      await createProduct(productData);

      navigate("/admin/products", {
        state: { message: "Product created successfully." },
      });
    } catch (err) {
      console.error("Product creation failed:", err);
      setError("Unable to create product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-form-page">
      <div className="admin-page-heading">
        <div>
          <Link to="/admin/products" className="admin-back-link">
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <h1>Add Product</h1>
          <p>Add a new handmade product to your store.</p>
        </div>
      </div>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <div className="admin-form-section">
          <h2>Basic Information</h2>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Handmade Floral Diya"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                {form.category &&
                  !categories.some((cat) => cat.name === form.category) && (
                    <option value={form.category}>{form.category}</option>
                  )}
              </select>
            </div>

            <div className="admin-form-group full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your handmade product..."
                required
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Pricing and Inventory</h2>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="price">Selling Price (₹) *</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="originalPrice">Original Price (₹)</label>
              <input
                id="originalPrice"
                name="originalPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="stock">Available Stock *</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="status">Product Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Images and Labels</h2>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="label">Product Label</label>
              <input
                id="label"
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="e.g. BESTSELLER, NEW"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="handmade, floral, decor"
              />
            </div>

            <div className="admin-form-group full-width">
              <label htmlFor="imageUpload">Upload Original Images</label>
              <label className="admin-upload-box" htmlFor="imageUpload">
                <Upload size={18} />
                <span>
                  {uploading
                    ? "Uploading images..."
                    : "Choose original images from your device"}
                </span>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading || saving}
                  hidden
                />
              </label>
            </div>

            <div className="admin-form-group full-width">
              <label htmlFor="imageUrlInput">Product Image URLs</label>
              <textarea
                id="imageUrlInput"
                name="imageUrlInput"
                value={form.imageUrlInput}
                onChange={handleChange}
                rows={3}
                placeholder="Paste image URLs separated by commas or new lines"
              />
              <div className="admin-url-helper-row">
                <small>Supports comma-separated or one-per-line URLs.</small>
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={handleAddUrls}
                  disabled={!form.imageUrlInput.trim()}
                >
                  Add URLs to List
                </button>
              </div>
            </div>

            {imageUrls.length > 0 && (
              <div className="admin-form-group full-width">
                <label>Product Images ({imageUrls.length})</label>
                <div className="admin-image-previews">
                  {imageUrls.map((url, idx) => (
                    <div key={`${url}-${idx}`} className="admin-image-preview-item">
                      <img src={url} alt={`Preview ${idx + 1}`} />
                      <button
                        type="button"
                        className="admin-remove-image-btn"
                        onClick={() => handleRemoveImage(idx)}
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Store Display</h2>

          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Show as a featured product
          </label>

          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              name="isNew"
              checked={form.isNew}
              onChange={handleChange}
            />
            Mark as a new arrival
          </label>
        </div>

        {error && (
          <div className="admin-error-message">{error}</div>
        )}

        <div className="admin-form-actions">
          <Link to="/admin/products" className="admin-secondary-button">
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={saving || uploading}
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddProduct;