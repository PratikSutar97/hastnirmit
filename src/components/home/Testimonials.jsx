import { ArrowUpRight } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { STORE_CONFIG } from "../../config/storeConfig";

function Testimonials() {
  return (
    <section className="instagram-section">

      <div className="instagram-content">

        <div className="instagram-icon">
          <SiInstagram size={30} />
        </div>

        <span className="section-eyebrow">
          FOLLOW OUR JOURNEY
        </span>

        <h2>
          A Little More <span>Hastnirmit</span>
        </h2>

        <p>
          Explore our latest handmade creations,
          behind-the-scenes moments and new collections
          on Instagram.
        </p>

        <a
          href={STORE_CONFIG.instagram}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          Follow Us on Instagram
          <ArrowUpRight size={18} />
        </a>

        <span className="instagram-handle">
          @_hastnirmit_
        </span>

      </div>

    </section>
  );
}

export default Testimonials;