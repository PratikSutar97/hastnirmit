import { useEffect, useMemo, useState } from "react";
import SEO from "../components/common/SEO";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  CheckCircle,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useProduct } from "../hooks/useProducts";
import { sendProductEnquiry } from "../services/whatsappService";

function parseImageUrls(images) {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images
      .flatMap((item) => String(item).split(/[\n,]+/))
      .map((url) => url.trim())
      .filter(Boolean);
  }
  return String(images)
    .split(/[\n,]+/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function ProductDetails() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = useMemo(
    () => parseImageUrls(product?.images),
    [product?.images]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [product?.id, images.length]);

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-container">
          <p>Loading product details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="product-details-page">
        <SEO
          path={`/product/${product.slug}`}
          title={product.name}
          description={
            product.description ||
            `Buy ${product.name} handcrafted by Hastnirmit.`
          }
          image={imageList[0]}
          type="product"
          schema={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: imageList,
            description:
              product.description ||
              `${product.name} handcrafted by Hastnirmit.`,
            sku: product.id,
            brand: { "@type": "Brand", name: "Hastnirmit" },
            offers: {
              "@type": "Offer",
              url: `https://hastnirmit.netlify.app/product/${product.slug}`,
              priceCurrency: "INR",
              price: Number(product.price) || 0,
              availability:
                Number(product.stock ?? 0) > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }}
        />
        <div className="product-details-container">
          <h2>Unable to load this product</h2>
          <p>{error}</p>
          <Link to="/shop" className="back-to-shop">
            <ArrowLeft size={17} />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const hasMultiple = images.length > 1;
  const activeImage = images[activeIndex] || "";

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const hasDiscount =
    Number(product.originalPrice) > Number(product.price);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.price)) /
          Number(product.originalPrice)) *
          100
      )
    : 0;

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        <Link to="/shop" className="back-to-shop">
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        <div className="product-details-grid">
          <div className="details-gallery-wrapper">
            <div className={`details-image ${product.color || ""}`}>
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={`${product.name} view ${activeIndex + 1}`}
                />
              ) : (
                <span>{product.symbol || "✦"}</span>
              )}

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    className="slider-arrow slider-arrow-prev details-arrow"
                    onClick={handlePrev}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    className="slider-arrow slider-arrow-next details-arrow"
                    onClick={handleNext}
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {hasMultiple && (
              <div className="details-thumbnails">
                {images.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    className={`details-thumb-btn ${
                      index === activeIndex ? "active" : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img
                      src={url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-details-info">
            <span className="product-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            {product.label && (
              <span className="details-label">
                {product.label}
              </span>
            )}

            <div className="details-price">
              <strong>₹{product.price}</strong>

              {hasDiscount && (
                <>
                  <del>₹{product.originalPrice}</del>
                  <span className="discount-text">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="details-divider" />

            <h3>Product Description</h3>

            <p className="details-description">
              {product.description}
            </p>

            <div className="details-availability">
              <CheckCircle size={17} />
              {Number(product.stock) > 0
                ? "Available for enquiry"
                : "Currently unavailable"}
            </div>

            <div className="details-benefits">
              <div>
                <Package size={20} />
                <span>Handmade Creation</span>
              </div>

              <div>
                <Truck size={20} />
                <span>Pan India Shipping</span>
              </div>
            </div>

            <button
              className="details-whatsapp-button"
              onClick={() => sendProductEnquiry(product)}
              type="button"
              disabled={Number(product.stock) <= 0}
            >
              <MessageCircle size={20} />
              Enquire About This Product
            </button>

            <p className="details-note">
              Contact us on WhatsApp to confirm availability,
              variations, payment and delivery details.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;