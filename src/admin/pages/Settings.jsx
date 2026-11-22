import { useCallback, useEffect, useState } from "react";
import {
  Save,
  RefreshCw,
  Store,
  MessageCircle,
  Truck,
} from "lucide-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "../../config/firebase";

const DEFAULT_SETTINGS = {
  storeName: "Hastnirmit",
  tagline: "Personalized. Handmade. Heartfelt.",
  contactEmail: "hello@hastnirmit.com",
  whatsappNumber: "",
  instagramHandle: "@hastnirmit",
  currencySymbol: "₹",
  freeShippingAbove: 999,
  shippingFee: 79,
  customOrdersEnabled: true,
  whatsappEnquiriesEnabled: true,
  storeNotice: "",
};

function Settings() {
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const ref = doc(db, "settings", "store");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setForm({
          ...DEFAULT_SETTINGS,
          ...snap.data(),
        });
      } else {
        setForm(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError("Unable to load store settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.storeName.trim()) {
      setError("Store name is required.");
      return;
    }

    try {
      setSaving(true);
      const ref = doc(db, "settings", "store");
      await setDoc(
        ref,
        {
          ...form,
          storeName: form.storeName.trim(),
          tagline: form.tagline.trim(),
          contactEmail: form.contactEmail.trim(),
          whatsappNumber: String(form.whatsappNumber || "").trim(),
          instagramHandle: String(form.instagramHandle || "").trim(),
          currencySymbol: String(form.currencySymbol || "₹").trim() || "₹",
          freeShippingAbove: Math.max(0, Number(form.freeShippingAbove) || 0),
          shippingFee: Math.max(0, Number(form.shippingFee) || 0),
          storeNotice: String(form.storeNotice || "").trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSuccess("Store settings saved.");
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError(err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-products-page">
      <div className="admin-page-heading">
        <div>
          <h1>Settings</h1>
          <p>Manage store identity, WhatsApp order details, shipping rules, and features.</p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadSettings}
          disabled={loading || saving}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="admin-error-message">
          <p>{error}</p>
          <button type="button" onClick={loadSettings}>
            Retry
          </button>
        </div>
      )}

      {success && <p className="admin-success-text">{success}</p>}

      {loading ? (
        <div className="admin-table-container">
          <div className="admin-empty-state">Loading settings...</div>
        </div>
      ) : (
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="admin-form-section">
            <h2>
              <Store size={18} style={{ verticalAlign: "middle", marginRight: "8px" }} />
              Store Identity
            </h2>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="storeName">Store Name *</label>
                <input
                  id="storeName"
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="tagline">Brand Tagline</label>
                <input
                  id="tagline"
                  name="tagline"
                  value={form.tagline}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="contactEmail">Support / Contact Email</label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder="hello@hastnirmit.com"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="instagramHandle">Instagram Handle</label>
                <input
                  id="instagramHandle"
                  name="instagramHandle"
                  value={form.instagramHandle}
                  onChange={handleChange}
                  placeholder="@hastnirmit"
                />
              </div>

              <div className="admin-form-group full-width">
                <label htmlFor="storeNotice">Store Announcement / Note</label>
                <input
                  id="storeNotice"
                  name="storeNotice"
                  value={form.storeNotice}
                  onChange={handleChange}
                  placeholder="e.g. Handmade pieces ship within 2–4 business days."
                />
              </div>
            </div>
          </div>

          <div className="admin-form-section">
            <h2>
              <MessageCircle size={18} style={{ verticalAlign: "middle", marginRight: "8px" }} />
              WhatsApp &amp; Ordering
            </h2>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="whatsappNumber">WhatsApp Number (with country code)</label>
                <input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g. 919876543210"
                />
                <small>Digits only with country code (e.g. 91 for India).</small>
              </div>

              <div className="admin-form-group">
                <label htmlFor="currencySymbol">Currency Symbol</label>
                <input
                  id="currencySymbol"
                  name="currencySymbol"
                  value={form.currencySymbol}
                  onChange={handleChange}
                  maxLength={5}
                />
              </div>

              <div className="admin-form-group full-width">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    name="whatsappEnquiriesEnabled"
                    checked={Boolean(form.whatsappEnquiriesEnabled)}
                    onChange={handleChange}
                  />
                  Enable WhatsApp product enquiries and order messages
                </label>

                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    name="customOrdersEnabled"
                    checked={Boolean(form.customOrdersEnabled)}
                    onChange={handleChange}
                  />
                  Accept custom handmade order requests
                </label>
              </div>
            </div>
          </div>

          <div className="admin-form-section">
            <h2>
              <Truck size={18} style={{ verticalAlign: "middle", marginRight: "8px" }} />
              Shipping Rules
            </h2>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="shippingFee">Standard Shipping Fee ({form.currencySymbol})</label>
                <input
                  id="shippingFee"
                  name="shippingFee"
                  type="number"
                  min="0"
                  step="1"
                  value={form.shippingFee}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="freeShippingAbove">Free Shipping Above ({form.currencySymbol})</label>
                <input
                  id="freeShippingAbove"
                  name="freeShippingAbove"
                  type="number"
                  min="0"
                  step="1"
                  value={form.freeShippingAbove}
                  onChange={handleChange}
                />
                <small>Set to 0 to make shipping free on all orders.</small>
              </div>
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default Settings;