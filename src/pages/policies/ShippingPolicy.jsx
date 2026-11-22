import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/common/SEO";
import {
  Truck,
  PackageCheck,
  Clock,
  MapPin,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../config/firebase";

const DEFAULT_SHIPPING_CONFIG = {
  storeName: "Hastnirmit",
  currencySymbol: "₹",
  shippingFee: 79,
  freeShippingAbove: 999,
  contactEmail: "adminhastnirmit@gmail.com",
  whatsappNumber: "",
  storeNotice: "",
};

function ShippingPolicy() {
  const [config, setConfig] = useState(DEFAULT_SHIPPING_CONFIG);

  useEffect(() => {
    let active = true;

    async function loadStoreSettings() {
      try {
        const snap = await getDoc(doc(db, "settings", "store"));
        if (active && snap.exists()) {
          setConfig((prev) => ({
            ...prev,
            ...snap.data(),
          }));
        }
      } catch (err) {
        console.error("Unable to load shipping settings:", err);
      }
    }

    loadStoreSettings();
    return () => {
      active = false;
    };
  }, []);

  const currency = config.currencySymbol || "₹";
  const shippingFee = Number(config.shippingFee) || 0;
  const freeAbove = Number(config.freeShippingAbove) || 0;
  const cleanWhatsapp = String(config.whatsappNumber || "").replace(/\D/g, "");

  return (
    <main className="info-page">
        <SEO
        path="/shipping"
        title="Shipping Information"
        description="Learn about Hastnirmit dispatch timelines, pan-India delivery charges, free shipping thresholds, and protective packaging."
      />
      <section className="info-banner">
        <span className="section-eyebrow">CUSTOMER CARE</span>
        <h1>
          Shipping <span>Information</span>
        </h1>
        <p>
          Every {config.storeName} piece is handcrafted and packed with care.
          Here is everything you need to know about dispatch timelines, delivery
          charges, and tracking.
        </p>
      </section>

      <div className="info-container">
        <Link to="/shop" className="back-to-shop">
          <ArrowLeft size={16} />
          Back to Shop
        </Link>

        {config.storeNotice && (
          <div className="info-notice-banner">
            <strong>Store Notice:</strong> {config.storeNotice}
          </div>
        )}

        <div className="info-highlights-grid">
          <div className="info-highlight-card">
            <div className="info-highlight-icon">
              <Clock size={22} />
            </div>
            <h3>Dispatch Time</h3>
            <p>
              Ready-to-ship items dispatch within <strong>2–4 business days</strong>.
              Custom handmade orders take <strong>5–10 business days</strong>.
            </p>
          </div>

          <div className="info-highlight-card">
            <div className="info-highlight-icon">
              <Truck size={22} />
            </div>
            <h3>Shipping Charges</h3>
            <p>
              {freeAbove === 0 ? (
                <>
                  Enjoy <strong>Free Shipping</strong> across India on all orders.
                </>
              ) : (
                <>
                  Standard shipping is <strong>{currency}{shippingFee}</strong>.{" "}
                  <strong>Free shipping</strong> on orders above{" "}
                  <strong>{currency}{freeAbove}</strong>.
                </>
              )}
            </p>
          </div>

          <div className="info-highlight-card">
            <div className="info-highlight-icon">
              <MapPin size={22} />
            </div>
            <h3>Pan-India Delivery</h3>
            <p>
              Metro cities typically deliver in <strong>3–5 working days</strong>{" "}
              after dispatch; other towns and regions take <strong>5–8 working days</strong>.
            </p>
          </div>

          <div className="info-highlight-card">
            <div className="info-highlight-icon">
              <PackageCheck size={22} />
            </div>
            <h3>Protective Packaging</h3>
            <p>
              All jewellery, gifts, and delicate keepsakes are cushioned in
              tamper-evident packaging so they arrive gift-ready.
            </p>
          </div>
        </div>

        <div className="info-content-card">
          <h2>Order Processing &amp; Tracking</h2>
          <p>
            Once your order is confirmed, our artisans prepare and inspect each
            item by hand. As soon as your parcel is handed over to our courier
            partner, we share your tracking link and airway bill number via
            WhatsApp or email.
          </p>

          <h2>Custom &amp; Personalized Orders</h2>
          <p>
            Because bespoke pieces are crafted specifically to your chosen colors,
            names, or sizes, they require additional crafting and curing time.
            We will confirm the exact dispatch date with you on WhatsApp before
            starting work.
          </p>

          <h2>Address Changes &amp; Delivery Support</h2>
          <p>
            Need to update your shipping address or delivery instructions? Reach
            out within <strong>12 hours</strong> of placing your order at{" "}
            <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
            {cleanWhatsapp ? (
              <>
                {" "}
                or message us directly on{" "}
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
                .
              </>
            ) : (
              "."
            )}
          </p>

          <div className="info-cta-row">
            <Link to="/shop" className="btn-primary">
              Explore Collections
            </Link>
            {cleanWhatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                  "Hi Hastnirmit! I have a question about shipping."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <MessageCircle size={16} />
                Ask on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ShippingPolicy;