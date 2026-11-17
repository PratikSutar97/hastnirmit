import { MessageCircle } from "lucide-react";
import { STORE_CONFIG } from "../../config/storeConfig";

function WhatsAppButton() {
  const number = STORE_CONFIG.whatsappNumber;

  if (!number) return null;

  const message = encodeURIComponent(
    "Hi Hastnirmit! I would like to know more about your handmade products."
  );

  const whatsappUrl =
    `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label="Chat with Hastnirmit on WhatsApp"
    >
      <MessageCircle size={25} />
      <span>Chat with us</span>
    </a>
  );
}

export default WhatsAppButton;