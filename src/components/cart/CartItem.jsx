
import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { useCart } from "../../hooks/useCart";

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">

      <div className={`cart-item-image ${item.color}`}>
        {item.images?.[0] ? (
          <img src={item.images[0]} alt={item.name} />
        ) : (
          <span>{item.symbol}</span>
        )}
      </div>

      <div className="cart-item-details">

        <span>{item.category}</span>

        <h3>{item.name}</h3>

        <strong>₹{item.price}</strong>

        <div className="quantity-control">

          <button
            onClick={() =>
              updateQuantity(item.id, item.quantity - 1)
            }
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() =>
              updateQuantity(item.id, item.quantity + 1)
            }
            disabled={
              item.stock != null &&
              item.quantity >= item.stock
            }
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>

        </div>

      </div>

      <div className="cart-item-end">

        <strong>
          ₹{item.price * item.quantity}
        </strong>

        <button
          className="remove-cart-item"
          onClick={() => removeFromCart(item.id)}
          aria-label="Remove product"
        >
          <Trash2 size={17} />
        </button>

      </div>

    </div>
  );
}

export default CartItem;
