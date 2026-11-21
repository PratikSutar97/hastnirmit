import ProductCard from "../common/ProductCard";
import { SearchX } from "lucide-react";

function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-products">
        <SearchX size={42} />

        <h3>No products found</h3>

        <p>
          Try changing your search or filters
          to discover more creations.
        </p>
      </div>
    );
  }

  return (
    <div className="shop-product-grid">
      {products.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
        />
      ))}
    </div>
  );
}

export default ProductGrid;