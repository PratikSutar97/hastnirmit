import { useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContextDefinition";

const STORAGE_KEY = "hastnirmit_cart";

function getInitialCart() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Unable to load cart:", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) return;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) => {
          if (item.id !== product.id) return item;

          const newQuantity = item.quantity + quantity;

          return {
            ...item,
            quantity: product.stock
              ? Math.min(newQuantity, product.stock)
              : newQuantity,
          };
        });
      }

      const safeQuantity = product.stock
        ? Math.min(quantity, product.stock)
        : quantity;

      return [
        ...currentItems,
        { ...product, quantity: safeQuantity },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) return item;

        const safeQuantity = item.stock
          ? Math.min(quantity, item.stock)
          : quantity;

        return { ...item, quantity: safeQuantity };
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    subtotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
