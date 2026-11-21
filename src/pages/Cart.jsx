
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { useCart } from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

function Cart() {
  const { cartItems, subtotal, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">

        <div className="empty-cart">

          <ShoppingBag size={55} />

          <h1>Your Cart is Empty</h1>

          <p>
            Discover handmade creations
            and add something special to your cart.
          </p>

          <Link to="/shop" className="btn-primary">
            Explore Collection
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-container">

        <h1>Your Shopping Cart</h1>

        <p className="cart-subtitle">
          {cartCount} items selected for your order
        </p>

        <div className="cart-layout">

          <div className="cart-items-list">

            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}

            <Link to="/shop" className="continue-shopping">
              ← Continue Shopping
            </Link>

          </div>

          <CartSummary
            subtotal={subtotal}
            cartCount={cartCount}
          />

        </div>

      </div>

    </main>
  );
}

export default Cart;
