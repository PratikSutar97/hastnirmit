import { Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowUpRight,
  Plus,
  Minus,
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
  const {
    cartItems = [],
    cart = [],
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [imageIndex, setImageIndex] = useState(0);

  const items = cartItems.length ? cartItems : cart;

  const cartEntry = useMemo(
    () =>
      items.find(
        (item) =>
          (item.id && product.id && item.id === product.id) ||
          (item.slug && product.slug && item.slug === product.slug)
      ),
    [items, product.id, product.slug]
  );

  const quantityInCart = Number(cartEntry?.quantity ?? cartEntry?.qty ?? 0);

  const imageList = useMemo(
    () => normalizeImages(product.images),
    [product.images]
  );

  useEffect(() => {
    setImageIndex(0);
  }, [product.id, imageList.length]);

  const hasMultipleImages = imageList.length > 1;
  const currentImage = imageList[imageIndex] || "";
  const isOutOfStock = Number(product.stock ?? 0) <= 0;
  const maxStock =
    product.stock != null && Number(product.stock) > 0
      ? Number(product.stock)
      : Infinity;

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
    if (isOutOfStock) return;
    addToCart({
      ...product,
      images: imageList,
    });
  };

  const handleDecrease = () => {
    if (quantityInCart <= 1) {
      if (typeof removeFromCart === "function") {
        removeFromCart(product.id || product.slug);
      } else if (typeof updateQuantity === "function") {
        updateQuantity(product.id || product.slug, 0);
      }
      return;
    }

    if (typeof updateQuantity === "function") {
      updateQuantity(product.id || product.slug, quantityInCart - 1);
    }
  };

  const handleIncrease = () => {
    if (quantityInCart >= maxStock) return;

    if (typeof updateQuantity === "function") {
      updateQuantity(product.id || product.slug, quantityInCart + 1);
    } else {
      addToCart({
        ...product,
        images: imageList,
      });
    }
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

        {quantityInCart > 0 ? (
          <div className="cart-qty-stepper" role="group" aria-label="Cart item quantity">
            <button
              type="button"
              className="cart-qty-btn"
              onClick={handleDecrease}
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>

            <span className="cart-qty-count">{quantityInCart}</span>

            <button
              type="button"
              className="cart-qty-btn"
              onClick={handleIncrease}
              disabled={quantityInCart >= maxStock}
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <Plus size={16} />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        )}

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