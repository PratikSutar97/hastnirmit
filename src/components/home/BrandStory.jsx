import { Heart, Sparkles, Leaf, HandHeart } from "lucide-react";

function BrandStory() {
  const values = [
    {
      icon: HandHeart,
      title: "Made with Care",
      description: "Every creation receives individual attention.",
    },
    {
      icon: Sparkles,
      title: "Unique Designs",
      description: "Discover designs that stand out from the ordinary.",
    },
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every piece is created with creativity and passion.",
    },
    {
      icon: Leaf,
      title: "Personal Touch",
      description: "Thoughtful creations for meaningful moments.",
    },
  ];

  return (
    <section className="section brand-section" id="about">

      <div className="brand-story-content">

        <span className="section-eyebrow">A LITTLE ABOUT US</span>

        <h2>
          More Than Products,
          <br />
          <span>It's a Handmade Story.</span>
        </h2>

        <p>
          Hastnirmit brings together creativity, tradition
          and the joy of handmade creations.

          From beautiful jewellery to decorative pieces,
          we believe that even the smallest creations
          can make everyday moments special.
        </p>

        <p>
          Each design reflects our love for creativity
          and our passion for making something unique.
        </p>

        <a href="#contact" className="btn-primary">
          Connect With Us
        </a>

      </div>

      <div className="brand-values-grid">

        {values.map((item) => {
          const Icon = item.icon;

          return (
            <div className="brand-value-card" key={item.title}>
              <div className="brand-value-icon">
                <Icon size={25} />
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          );
        })}

      </div>

    </section>
  );
}

export default BrandStory;