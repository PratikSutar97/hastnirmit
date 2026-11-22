import {
  Heart,
  Mail,
  MapPin,
} from "lucide-react";

import { SiInstagram } from "react-icons/si";
import { Link } from "react-router-dom";
import { STORE_CONFIG } from "../../config/storeConfig";

function Footer() {
  return (
    <footer className="footer" id="contact">

      <div className="footer-main">

        <div className="footer-brand">

          <div className="footer-logo">
            <img src={STORE_CONFIG.logo} alt="Hastnirmit" />
            <div>
              <h2>HASTNIRMIT</h2>
              <span>HANDMADE WITH LOVE</span>
            </div>
          </div>

          <p>
            Bringing creativity, tradition and handmade
            beauty into your everyday life.
          </p>

          <a
            href={STORE_CONFIG.instagram}
            target="_blank"
            rel="noreferrer"
            className="footer-social"
          >
            <SiInstagram size={19} />
            Follow us and contact on Instagram
          </a>

        </div>

        <div className="footer-links">
          <h3>Explore</h3>
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#categories">Collections</a>
          <a href="#about">Our Story</a>
        </div>

        <div className="footer-links">
          <h3>Customer Care</h3>
          <a href="#contact">Contact Us</a>
          <a href="#custom-order">Custom Orders</a>
          <Link to="/shipping">Shipping Information</Link>
          <Link to="/faq">FAQs</Link>
        </div>

        <div className="footer-contact">
          <h3>Get in Touch</h3>

          <p>
            <MapPin size={17} />
            Shipping Across India
          </p>

          <p>
            <Mail size={17} />
            adminhastnirmit@gmail.com
          </p>
        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Hastnirmit.
          All rights reserved.
        </p>

        <p>
          Made with <Heart size={14} fill="currentColor" />
          for handmade lovers.
        </p>

      </div>

    </footer>
  );
}

export default Footer;