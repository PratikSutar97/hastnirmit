import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";

function NotFound() {
  return (
    <main className="not-found-page">
      <span>404</span>
      <h1>Oops! Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>

      <div>
        <Link to="/" className="btn-primary">
          <Home size={17} />
          Go Home
        </Link>

        <Link to="/shop" className="btn-secondary">
          <ShoppingBag size={17} />
          Explore Shop
        </Link>
      </div>
    </main>
  );
}

export default NotFound;