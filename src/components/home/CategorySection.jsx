import {
  Gem,
  Flame,
  Flower2,
  House,
  Gift,
  Palette,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Handmade Jewellery",
    description: "Beautiful accessories for every occasion",
    icon: Gem,
    color: "category-pink",
  },
  {
    name: "Diyas & Candles",
    description: "Add warmth to your special moments",
    icon: Flame,
    color: "category-orange",
  },
  {
    name: "Rangoli & Decor",
    description: "Traditional art with a creative touch",
    icon: Flower2,
    color: "category-purple",
  },
  {
    name: "Home Decor",
    description: "Little details that make a home",
    icon: House,
    color: "category-green",
  },
  {
    name: "Handmade Gifts",
    description: "Thoughtful gifts made with love",
    icon: Gift,
    color: "category-yellow",
  },
  {
    name: "Custom Creations",
    description: "Something special, made your way",
    icon: Palette,
    color: "category-blue",
  },
];

function CategorySection() {
  return (
    <section className="section categories-section" id="categories">

      <div className="section-heading">
        <span className="section-eyebrow">EXPLORE OUR WORLD</span>

        <h2>
          Shop by <span>Category</span>
        </h2>

        <p>
          Find something special for yourself, your home
          or someone you love.
        </p>
      </div>

      <div className="category-grid">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <a
              href="#shop"
              className={`category-card ${category.color}`}
              key={category.name}
            >
              <div className="category-icon">
                <Icon size={30} strokeWidth={1.5} />
              </div>

              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>

              <ArrowUpRight
                className="category-arrow"
                size={20}
              />
            </a>
          );
        })}
      </div>

    </section>
  );
}

export default CategorySection;