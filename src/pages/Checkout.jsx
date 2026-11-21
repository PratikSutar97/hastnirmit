
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  MessageCircle,
  MapPin,
  User,
  Phone,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../hooks/useCart";
import { sendWhatsAppMessage } from "../services/whatsappService";

function Checkout() {
  const { cartItems, subtotal } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  const [error, setError] = useState("");

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => {
    setCustomer((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(customer.phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(customer.pincode)) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    const message = `
Hello Hastnirmit! 👋

I would like to place an order.

🛍️ ORDER DETAILS

${cartItems.map((item, index) => `
${index + 1}. ${item.name}
Category: ${item.category}
Price per item: ₹${item.price}
Quantity: ${item.quantity}
Item Total: ₹${item.price * item.quantity}
`).join("\n")}

------------------------

Subtotal: ₹${subtotal}
Shipping: To be confirmed
Final Total: ₹${subtotal} + shipping

👤 CUSTOMER DETAILS

Name: ${customer.name}
Phone: ${customer.phone}

📍 DELIVERY ADDRESS

${customer.address}
${customer.city}, ${customer.state}
PIN Code: ${customer.pincode}

Additional Instructions:
${customer.notes || "None"}

Please confirm product availability,
shipping charges and payment instructions.

Thank you!
    `.trim();

    sendWhatsAppMessage(message);
  };

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        <Link to="/cart" className="back-to-shop">
          ← Back to Cart
        </Link>

        <h1>Delivery Details</h1>

        <p className="checkout-subtitle">
          Enter your details to place your order through WhatsApp.
        </p>

        <div className="checkout-layout">

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >

            <h2>
              <User size={20} />
              Customer Information
            </h2>

            <div className="checkout-field">
              <label>Full Name *</label>

              <input
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="checkout-field">
              <label>
                <Phone size={15} />
                Mobile Number *
              </label>

              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={customer.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
              />
            </div>

            <h2>
              <MapPin size={20} />
              Delivery Address
            </h2>

            <div className="checkout-field">
              <label>Full Address *</label>

              <textarea
                name="address"
                rows={3}
                value={customer.address}
                onChange={handleChange}
                placeholder="House number, street, area..."
                required
              />
            </div>

            <div className="checkout-two-columns">

              <div className="checkout-field">
                <label>City *</label>

                <input
                  name="city"
                  value={customer.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label>State *</label>

                <input
                  name="state"
                  value={customer.state}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="checkout-field">
              <label>PIN Code *</label>

              <input
                name="pincode"
                inputMode="numeric"
                maxLength={6}
                value={customer.pincode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-field">
              <label>Additional Instructions</label>

              <textarea
                name="notes"
                rows={3}
                value={customer.notes}
                onChange={handleChange}
                placeholder="Any special delivery instructions?"
              />
            </div>

            {error && (
              <p className="checkout-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="place-whatsapp-order"
            >
              <MessageCircle size={20} />
              Place Order on WhatsApp
            </button>

            <p className="checkout-disclaimer">
              No online payment is collected.
              Your order will be reviewed and confirmed by Hastnirmit.
            </p>

          </form>

          <aside className="checkout-order-summary">

            <h2>
              <ShoppingBag size={19} />
              Your Order
            </h2>

            {cartItems.map((item) => (
              <div
                className="checkout-product"
                key={item.id}
              >
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>
              </div>
            ))}

            <div className="checkout-total">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>

            <p>
              Shipping will be confirmed separately through WhatsApp.
            </p>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Checkout;
