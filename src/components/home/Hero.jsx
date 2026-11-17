import { ArrowRight, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <div className="hero-label">
          <Sparkles size={15} />
          <span>HANDCRAFTED WITH LOVE</span>
        </div>

        <h1>
          Little Creations,
          <br />
          <span>Beautiful Memories.</span>
        </h1>

        <p>
          Explore a world of handmade jewellery, artistic home décor and
          thoughtful creations made with love and care.
        </p>

        <div className="hero-buttons">
          <a href="#shop" className="btn-primary">
            Explore Collection
            <ArrowRight size={18} />
          </a>

          <a href="#custom-order" className="btn-secondary">
            Create Something Special
          </a>
        </div>

        <div className="hero-features">
          <span>✦ Unique Designs</span>
          <span>✦ Handmade Creations</span>
          <span>✦ Pan India Shipping</span>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-decoration decoration-one"></div>
        <div className="hero-decoration decoration-two"></div>

        <div className="hero-art-card">
          <div className="hero-art-inner">
            <span className="hero-art-flower">✿</span>
            <span className="hero-art-text">Made with Love</span>
            <span className="hero-art-subtext">HASTNIRMIT</span>
          </div>
        </div>

        <div className="hero-floating-note">
          <Sparkles size={17} />
          Every piece tells a story
        </div>
      </div>
    </section>
  );
}

export default Hero;
