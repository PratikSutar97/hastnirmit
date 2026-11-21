import { Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowUpRight,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { sendProductEnquiry } from "../../services/whatsappService";
import { useCart } from "../../hooks/useCart";

function normalizeImages(images) {
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

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const imageList = useMemo(
    () => normalizeImages(product.images),
    [product.images]
  );

  useEffect(() => {
    setImageIndex(0);
  }, [product.id, imageList.length]);

  const hasMultipleImages = imageList.length > 1;
  const currentImage = imageList[imageIndex] || "";

  const handlePrevImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  };

  const handleNextImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      images: imageList,
    });
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <article className="product-card">

      <Link
        to={`/product/${product.slug}`}
        className={`product-image ${product.color || ""}`}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={`${product.name} ${imageIndex + 1}`}
            loading="lazy"
          />
        ) : (
          <span className="product-symbol">
            {product.symbol || "✦"}
          </span>
        )}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              className="slider-arrow slider-arrow-prev"
              onClick={handlePrevImage}
              aria-label="Previous product image"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              className="slider-arrow slider-arrow-next"
              onClick={handleNextImage}
              aria-label="Next product image"
            >
              <ChevronRight size={18} />
            </button>

            <span className="slider-counter">
              {imageIndex + 1}/{imageList.length}
            </span>
          </>
        )}

        {product.label && (
          <span className="product-label">
            {product.label}
          </span>
        )}

        {!imageList.length && (
          <span className="demo-image-label">
            DEMO PRODUCT
          </span>
        )}

        <span className="product-view-icon">
          <ArrowUpRight size={18} />
        </span>
      </Link>

      <div className="product-info">

        <span className="product-category">
          {product.category}
        </span>

        <Link to={`/product/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>

        <div className="product-price">
          <strong>₹{product.price}</strong>

          {product.originalPrice && (
            <del>₹{product.originalPrice}</del>
          )}
        </div>

        <button
          type="button"
          className="add-cart-button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
          {product.stock <= 0
            ? "Out of Stock"
            : added
              ? "Added to Cart"
              : "Add to Cart"}
        </button>

        <button
          type="button"
          className="product-action"
          onClick={() => sendProductEnquiry(product)}
        >
          <ShoppingBag size={16} />
          Enquire on WhatsApp
        </button>

      </div>
    </article>
  );
}

export default ProductCard;