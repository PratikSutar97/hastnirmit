import { useEffect, useRef, useState } from "react";
import { useCart } from "../../hooks/useCart";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
} from "lucide-react";

import { SiInstagram } from "react-icons/si";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { STORE_CONFIG } from "../../config/storeConfig";

function scrollToSectionId(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function Navbar() {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartPop, setCartPop] = useState(false);
  const prevCartCountRef = useRef(cartCount);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setCartPop(true);
      const timer = setTimeout(() => setCartPop(false), 450);
      prevCartCountRef.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  const closeMenu = () => setMenuOpen(false);

  const handleSectionLinkClick = (event, href) => {
    if (!href.startsWith("/#")) {
      closeMenu();
      return;
    }

    event.preventDefault();
    const targetId = href.slice(2);
    closeMenu();

    if (location.pathname === "/") {
      window.history.replaceState(null, "", href);
      scrollToSectionId(targetId);
    } else {
      navigate("/");
      setTimeout(() => {
        window.history.replaceState(null, "", href);
        scrollToSectionId(targetId);
      }, 80);
    }
  };

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/#categories" },
    { label: "Our Story", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header className="navbar">

      <div className="navbar-inner">

        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
        >
          <img
            src={STORE_CONFIG.logo}
            alt="Hastnirmit logo"
            className="brand-logo"
          />
        </Link>

        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

          {navLinks.map((link) => {
            const isHashLink = link.href.startsWith("/#");
            const className =
              link.label === "Shop" && location.pathname === "/shop"
                ? "nav-link nav-link-active"
                : "nav-link";

            return isHashLink ? (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSectionLinkClick(e, link.href)}
                className={className}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={closeMenu}
                className={className}
              >
                {link.label}
              </Link>
            );
          })}

          <a
            href="/#custom-order"
            onClick={(e) => handleSectionLinkClick(e, "/#custom-order")}
            className="nav-custom-order"
          >
            Custom Order <span>✦</span>
          </a>

          <a
            href={STORE_CONFIG.instagram}
            target="_blank"
            rel="noreferrer"
            className="mobile-instagram"
          >
            <SiInstagram size={17} />
            Instagram
          </a>

        </nav>

        <div className="nav-actions">

          <button
            className="icon-button"
            aria-label="Search products"
            onClick={() => {
              closeMenu();
              navigate("/shop");
            }}
          >
            <Search size={20} />
          </button>

          <Link
            to="/cart"
            className={`icon-button cart-nav-button ${cartPop ? "cart-pop" : ""}`}
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>

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