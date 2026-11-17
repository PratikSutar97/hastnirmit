
import { STORE_CONFIG } from "../config/storeConfig";

export function sendWhatsAppMessage(message) {
  const number = STORE_CONFIG.whatsappNumber.replace(/\D/g, "");

  if (!number || number.length < 10 || number.includes("XXXXXXXXXX")) {
    alert("WhatsApp number is not configured. Please contact the store administrator.");
    return;
  }

  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

export function sendProductEnquiry(product) {
  const message = `
Hello Hastnirmit! 👋

I'm interested in your handmade product.

🛍️ PRODUCT ENQUIRY

Product: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
${product.originalPrice ? `Original Price: ₹${product.originalPrice}` : ""}

Could you please share more details about:

1. Product availability
2. Available colours or variations
3. Payment options
4. Delivery charges and estimated delivery time

I'm interested in purchasing this product.

Thank you!
  `.trim();

  sendWhatsAppMessage(message);
}
