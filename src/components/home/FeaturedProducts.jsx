import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../common/ProductCard";

function FeaturedProducts() {
  const { products, loading, error } = useProducts();

  const featuredList = products.filter((product) => product.featured);
  const nonFeaturedList = products.filter((product) => !product.featured);
  const displayProducts = [...featuredList, ...nonFeaturedList].slice(0, 4);

  return (
    <section className="section products-section" id="shop">

      <div className="section-heading">

        <span className="section-eyebrow">
          MADE WITH LOVE
        </span>

        <h2>
          Our <span>Featured Creations</span>
        </h2>

        <p>
          A little collection of beautiful things
          made to brighten your everyday.
        </p>

      </div>

      {loading ? (
        <p className="products-status">Loading creations...</p>
      ) : error ? (
        <p className="products-status">{error}</p>
      ) : displayProducts.length === 0 ? (
        <p className="products-status">No products available yet.</p>
      ) : (
        <div className="product-grid">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

      <div className="view-all-wrapper">
        <Link to="/shop" className="view-all-link">
          Explore all creations
          <ArrowRight size={18} />
        </Link>
      </div>

    </section>
  );
}

export default FeaturedProducts;