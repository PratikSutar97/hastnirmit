import { MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function CartSummary({ subtotal, cartCount }) {
  return (
    <div className="cart-summary">

      <h2>Order Summary</h2>

      <div className="summary-row">
        <span>Total Items</span>
        <strong>{cartCount}</strong>
      </div>

      <div className="summary-row">
        <span>Subtotal</span>
        <strong>₹{subtotal}</strong>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <span>To be confirmed</span>
      </div>

      <div className="summary-total">
        <span>Estimated Total</span>
        <strong>₹{subtotal}</strong>
      </div>

      <Link
        to="/checkout"
        className="checkout-button"
      >
        Proceed to Checkout
        <ArrowRight size={17} />
      </Link>

      <p>
        <MessageCircle size={15} />
        Orders are confirmed through WhatsApp.
      </p>

    </div>
  );
}

export default CartSummary;