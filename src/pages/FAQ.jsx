import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/common/SEO";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../config/firebase";
function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [settings, setSettings] = useState({
    currencySymbol: "₹",
    shippingFee: 79,
    freeShippingAbove: 999,
    whatsappNumber: "",
    contactEmail: "adminhastnirmit@gmail.com",
  });

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const snap = await getDoc(doc(db, "settings", "store"));
        if (active && snap.exists()) {
          setSettings((prev) => ({
            ...prev,
            ...snap.data(),
          }));
        }
      } catch (err) {
        console.error("Unable to load settings for FAQ:", err);
      }
    }

    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const currency = settings.currencySymbol || "₹";
  const shippingFee = Number(settings.shippingFee) || 0;
  const freeAbove = Number(settings.freeShippingAbove) || 0;
  const cleanWhatsapp = String(settings.whatsappNumber || "").replace(/\D/g, "");

  const faqItems = [
    {
      question: "Are all Hastnirmit products 100% handmade?",
      answer:
        "Yes. Every piece at Hastnirmit—from handcrafted seashell and beaded jewellery to crochet hats and personalized gifts—is made by hand in small batches. Slight variations in texture, shell shape, or weave are natural hallmarks of authentic handwork.",
    },
    {
      question: "How do I place a custom or personalized order?",
      answer:
        "Visit the Custom Orders section on our website, choose your product category, share your preferred colors, sizing, or gift message, and submit the form. We connect with you directly on WhatsApp to finalize the design, pricing, and timeline before crafting begins.",
    },
    {
      question: "How long does shipping take and what are the charges?",
      answer:
        freeAbove === 0
          ? "Ready-to-ship items are dispatched within 2–4 business days and arrive in 3–8 working days depending on your pin code. Shipping is currently free on all orders across India."
          : `Ready-to-ship items are dispatched within 2–4 business days and arrive in 3–8 working days depending on your pin code. Standard shipping is ${currency}${shippingFee}, and orders above ${currency}${freeAbove} qualify for free shipping.`,
    },
    {
      question: "Can I order directly through WhatsApp?",
      answer:
        "Yes! You can either check out through your shopping cart or click 'Enquire on WhatsApp' on any product card to confirm availability, request gift wrapping, or place an order directly with us.",
    },
    {
      question: "How should I care for handmade jewellery and accessories?",
      answer:
        "Store jewellery in a dry pouch away from direct moisture, perfumes, and harsh sprays. Gently wipe shells, beads, and metal findings with a soft dry cloth after wear to preserve their natural sheen.",
    },
    {
      question: "What if my parcel arrives damaged in transit?",
      answer:
        "We pack every order securely, but if an item arrives damaged, please record a quick unboxing video and message us within 48 hours of delivery with your order details so we can arrange a repair or replacement.",
    },
  ];

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <main className="info-page">
        <SEO
        path="/faq"
        title="Frequently Asked Questions"
        description="Answers about Hastnirmit handmade products, custom orders, care instructions, and shipping across India."
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />
      <section className="info-banner">
        <span className="section-eyebrow">HELP &amp; SUPPORT</span>
        <h1>
          Frequently Asked <span>Questions</span>
        </h1>
        <p>
          Answers to common questions about our handmade creations, custom
          requests, care instructions, and delivery across India.
        </p>
      </section>

      <div className="info-container faq-container">
        <div className="faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`faq-item ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </button>

                {isOpen && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="info-content-card faq-help-box">
          <div className="faq-help-header">
            <HelpCircle size={22} />
            <h2>Still have a question?</h2>
          </div>
          <p>
            Looking for a specific color combination, bulk gifting quote, or
            urgent delivery date? We are happy to help.
          </p>
          <div className="info-cta-row">
            <Link to="/#custom-order" className="btn-primary">
              <Sparkles size={16} />
              Request Custom Order
            </Link>
            {cleanWhatsapp ? (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                  "Hi Hastnirmit! I have a question."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
            ) : (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="btn-secondary"
              >
                Email Us
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default FAQ;