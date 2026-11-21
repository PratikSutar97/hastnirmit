
import { Search, SlidersHorizontal } from "lucide-react";

function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
  categories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) {
  return (
    <div className="shop-filters">

      <div className="shop-search">
        <Search size={19} />

        <input
          type="search"
          placeholder="Search handmade creations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-controls">

        <div className="filter-field">
          <label>
            <SlidersHorizontal size={15} />
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label>Minimum Price (₹)</label>

          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label>Maximum Price (₹)</label>

          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label>Sort By</label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

      </div>
    </div>
  );
}

export default ProductFilters;
