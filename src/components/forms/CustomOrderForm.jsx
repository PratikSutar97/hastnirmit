import { useState } from "react";
import {
  MessageCircle,
  Send,
  User,
  Phone,
  CalendarDays,
  IndianRupee,
  Palette,
} from "lucide-react";

import { STORE_CONFIG } from "../../config/storeConfig";

function CustomOrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
    description: "",
    budget: "",
    requiredDate: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rawNumber = STORE_CONFIG.whatsappNumber.trim();
    const whatsappNumber = rawNumber.replace(/\D/g, "");

    if (!rawNumber || whatsappNumber.length < 10) {
      setError("Please configure the business WhatsApp number first.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const message = `
Hello Hastnirmit! 👋

I would like to place a CUSTOM ORDER.

👤 Customer Details
Name: ${formData.name}
Phone: ${formData.phone}

🎨 Custom Order Details
Category: ${formData.category}

Description / Requirements:
${formData.description}

💰 Approximate Budget:
${formData.budget || "Not decided yet"}

📅 Required Date:
${formData.requiredDate || "Flexible"}

Please let me know the possibilities, pricing and delivery details.

I can also share reference images here.

Thank you!
    `.trim();

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="custom-order-form" onSubmit={handleSubmit}>
      <div className="custom-form-heading">
        <h3>Tell Us Your Idea</h3>
        <p>
          Share your requirements and let's create something special together.
        </p>
      </div>

      <div className="custom-form-grid">
        <div className="custom-field">
          <label>
            <User size={15} />
            Your Name *
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="custom-field">
          <label>
            <Phone size={15} />
            Mobile Number *
          </label>

          <input
            type="tel"
            name="phone"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            required
          />
        </div>

        <div className="custom-field full-width">
          <label>
            <Palette size={15} />
            What would you like us to create? *
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Handmade Jewellery">Handmade Jewellery</option>
            <option value="Diyas and Candles">Diyas & Candles</option>
            <option value="Rangoli and Festive Decor">
              Rangoli & Festive Decor
            </option>
            <option value="Home Decor">Home Decor</option>
            <option value="Personalised Gifts">Personalised Gifts</option>
            <option value="Other Custom Creation">Other Custom Creation</option>
          </select>
        </div>

        <div className="custom-field full-width">
          <label>Describe Your Idea *</label>

          <textarea
            name="description"
            placeholder="Tell us about the design, colour, size, quantity or any special requirements..."
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        <div className="custom-field">
          <label>
            <IndianRupee size={15} />
            Approximate Budget
          </label>

          <select name="budget" value={formData.budget} onChange={handleChange}>
            <option value="">Select your budget</option>
            <option value="Below ₹500">Below ₹500</option>
            <option value="₹500 – ₹1,000">₹500 – ₹1,000</option>
            <option value="₹1,000 – ₹2,000">₹1,000 – ₹2,000</option>
            <option value="₹2,000 – ₹5,000">₹2,000 – ₹5,000</option>
            <option value="Above ₹5,000">Above ₹5,000</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        <div className="custom-field">
          <label>
            <CalendarDays size={15} />
            Required By
          </label>

          <input
            type="date"
            name="requiredDate"
            min={new Date().toLocaleDateString("en-CA")}
            value={formData.requiredDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <p className="custom-form-error" role="alert">
          {error}
        </p>
      )}

      <div className="custom-form-note">
        <MessageCircle size={18} />

        <p>
          You can share reference photos, sketches and inspiration directly in
          WhatsApp.
        </p>
      </div>

      <button type="submit" className="custom-submit-button">
        <MessageCircle size={19} />
        Send Custom Order Request
        <Send size={16} />
      </button>

      <p className="custom-form-disclaimer">
        Sending a request does not confirm an order. We'll discuss availability,
        pricing and delivery with you.
      </p>
    </form>
  );
}

export default CustomOrderForm;
