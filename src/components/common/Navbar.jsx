import { useState } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
} from "lucide-react";

import { SiInstagram } from "react-icons/si";

import { STORE_CONFIG } from "../../config/storeConfig";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Shop", href: "#shop" },
    { label: "Collections", href: "#categories" },
    { label: "Our Story", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">

        <a href="#home" className="brand" onClick={closeMenu}>
          <img
            src={STORE_CONFIG.logo}
            alt="Hastnirmit logo"
            className="brand-logo"
          />

          <span className="brand-name">
            HASTNIRMIT
            <small>HANDMADE WITH LOVE</small>
          </span>
        </a>

        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
          <a
  href="#custom-order"
  onClick={closeMenu}
  className="nav-custom-order"
>
  <span>Custom Order</span>
  <span>✦</span>
</a>

          <a
            href={STORE_CONFIG.instagram}
            target="_blank"
            rel="noreferrer"
            className="mobile-instagram"
          >
            <SiInstagram size={19} />
            Instagram
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="icon-button"
            aria-label="Search products"
            onClick={() =>
              document.getElementById("shop")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            <Search size={20} />
          </button>

          <a href="#shop" className="icon-button" aria-label="Shop products">
            <ShoppingBag size={20} />
          </a>

          <a
            href={STORE_CONFIG.instagram}
            target="_blank"
            rel="noreferrer"
            className="instagram-link"
            aria-label="Instagram"
          >
            <SiInstagram size={19} />
          </a>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;