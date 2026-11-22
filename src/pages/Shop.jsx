
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RotateCcw, ShoppingBag } from "lucide-react";
import SEO from "../components/common/SEO";
import { useProducts } from "../hooks/useProducts";
import ProductFilters from "../components/shop/ProductFilters";
import ProductGrid from "../components/shop/ProductGrid";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, loading, error, refreshProducts } = useProducts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sort, setSort] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((product) =>
        [
          product.name,
          product.category,
          product.description,
          ...(product.tags || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    if (category !== "all") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    if (minPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) >= Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) <= Number(maxPrice)
      );
    }

    switch (sort) {
      case "price-low":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "price-high":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "newest":
        result.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });
        break;

      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        result.sort(
          (a, b) => Number(b.featured) - Number(a.featured)
        );
    }

    return result;
  }, [products, search, category, sort, minPrice, maxPrice]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("featured");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({});
  };

  const changeCategory = (value) => {
    setCategory(value);

    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  return (
    <main className="shop-page">
      <SEO
          path="/shop"
          title="Shop Handmade Collection"
          description="Browse all handcrafted jewellery, crochet hats, and custom handmade gifts from Hastnirmit."
        />
      <section className="shop-banner">
        {/* <span className="section-eyebrow">
          HANDCRAFTED WITH LOVE
        </span> */}

        <h1>
          Explore Our <span>Creations</span>
        </h1>
{/* 
        <p>
          Discover handmade jewellery, festive decorations
          and beautiful creations for every occasion.
        </p> */}
      </section>

      <section className="shop-container">
        <div className="shop-heading-row">
          <div>
            <h2>
              <ShoppingBag size={23} />
              All Products
            </h2>

            <p>
              {loading
                ? "Loading products..."
                : `Showing ${filteredProducts.length} of ${products.length} products`}
            </p>
          </div>

          <button
            className="reset-filters"
            onClick={resetFilters}
            type="button"
          >
            <RotateCcw size={15} />
            Reset Filters
          </button>
        </div>

        {!loading && !error && (
          <ProductFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={changeCategory}
            sort={sort}
            setSort={setSort}
            categories={categories}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        )}

        {loading && (
          <div className="empty-products">
            <p>Loading handmade creations...</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-products">
            <h3>Unable to load products</h3>
            <p>{error}</p>

            <button
              type="button"
              className="reset-filters"
              onClick={refreshProducts}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <ProductGrid products={filteredProducts} />
        )}
      </section>
    </main>
  );
}

export default Shop;
