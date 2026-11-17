import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { demoProducts } from "../../data/demoProducts";
import { sendProductEnquiry } from "../../services/whatsappService";
function FeaturedProducts() {
  return (
    <section className="section products-section" id="shop">

      <div className="section-heading">
        <span className="section-eyebrow">MADE WITH LOVE</span>

        <h2>
          Our <span>Featured Creations</span>
        </h2>

        <p>
          A little collection of beautiful things
          made to brighten your everyday.
        </p>
      </div>

      <div className="product-grid">

        {demoProducts.map((product) => (
          <article className="product-card" key={product.id}>

            <div className={`product-image ${product.color}`}>
              <span className="product-symbol">
                {product.symbol}
              </span>

              <span className="product-label">
                {product.label}
              </span>

              <button
                className="product-heart"
                aria-label={`Add ${product.name} to wishlist`}
                title="Wishlist coming soon"
              >
                <Heart size={18} />
              </button>

              <span className="demo-image-label">
                DEMO PRODUCT
              </span>
            </div>

            <div className="product-info">

              <span className="product-category">
                {product.category}
              </span>

              <h3>{product.name}</h3>

              <div className="product-price">
                <strong>₹{product.price}</strong>

                {product.originalPrice && (
                  <del>₹{product.originalPrice}</del>
                )}
              </div>

              <button
  className="product-action"
  onClick={() => sendProductEnquiry(product)}
>
  <ShoppingBag size={16} />
  Enquire on WhatsApp
</button>

            </div>

          </article>
        ))}

      </div>

      <div className="view-all-wrapper">
        <a href="#shop" className="view-all-link">
          Explore all creations
          <ArrowRight size={18} />
        </a>
      </div>

    </section>
  );
}

export default FeaturedProducts;