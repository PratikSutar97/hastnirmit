
import { useCallback, useEffect, useState } from "react";

import {
  getActiveProducts,
  getAllProducts,
  getProductBySlug,
} from "../services/productService";

export function useProducts({ admin = false } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = admin
        ? await getAllProducts()
        : await getActiveProducts();

      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [admin]);

  useEffect(() => {
    // Schedule the fetch outside the synchronous effect execution.
    Promise.resolve().then(fetchProducts);
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
  };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return undefined;

    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductBySlug(slug);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);

        if (!cancelled) {
          setError("Unable to load this product.");
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    Promise.resolve().then(fetchProduct);

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return {
    product: slug ? product : null,
    loading: slug ? loading : false,
    error: slug ? error : "",
  };
}
