import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Gem,
  Flame,
  Flower2,
  House,
  Gift,
  Palette,
  ArrowUpRight,
} from "lucide-react";

import { getAllCategories } from "../../services/categoryService";

const ICON_MAP = {
  Gem,
  Flame,
  Flower2,
  House,
  Gift,
  Palette,
};

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchCategories() {
      try {
        setLoading(true);
        const data = await getAllCategories();
        if (active) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section categories-section" id="categories">
      <div className="section-heading">
        <span className="section-eyebrow">EXPLORE OUR WORLD</span>

        <h2>
          Shop by <span>Category</span>
        </h2>

        <p>
          Find something special for yourself, your home or someone you love.
        </p>
      </div>

      {loading ? (
        <p className="products-status">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="products-status">
          No categories added yet. Create categories in Admin &gt; Categories.
        </p>
      ) : (
        <div className="category-grid">
          {categories.map((category) => {
            const Icon = ICON_MAP[category.icon] || Gem;

            return (
              <Link
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className={`category-card ${category.color || "category-pink"}`}
                key={category.id}
              >
                <div className="category-icon">
                  <Icon size={30} strokeWidth={1.5} />
                </div>

                <div>
                  <h3>{category.name}</h3>
                  {category.description && <p>{category.description}</p>}
                </div>

                <ArrowUpRight className="category-arrow" size={20} />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CategorySection;