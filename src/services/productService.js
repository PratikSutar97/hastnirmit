
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../config/firebase";

const PRODUCTS_COLLECTION = "products";
const productsRef = collection(db, PRODUCTS_COLLECTION);

function generateSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureUniqueSlug(slug, excludeId = null) {
  const normalizedSlug = generateSlug(slug);

  if (!normalizedSlug) {
    throw new Error("A valid product slug is required.");
  }

  const slugQuery = query(
    productsRef,
    where("slug", "==", normalizedSlug)
  );

  const snapshot = await getDocs(slugQuery);

  const duplicate = snapshot.docs.some(
    (item) => item.id !== excludeId
  );

  if (duplicate) {
    throw new Error(
      "A product with this name already exists. Please choose a different name."
    );
  }

  return normalizedSlug;
}

export async function getAllProducts() {
  const productsQuery = query(
    productsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getActiveProducts() {
  const productsQuery = query(
    productsRef,
    where("status", "==", "active")
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getProductBySlug(slug) {
  const normalizedSlug = generateSlug(slug);

  const productQuery = query(
    productsRef,
    where("slug", "==", normalizedSlug),
    where("status", "==", "active")
  );

  const snapshot = await getDocs(productQuery);

  if (snapshot.empty) return null;

  const item = snapshot.docs[0];

  return {
    id: item.id,
    ...item.data(),
  };
}

export async function getProductById(id) {
  const snapshot = await getDoc(
    doc(db, PRODUCTS_COLLECTION, id)
  );

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function createProduct(productData) {
  const slug = await ensureUniqueSlug(productData.slug);

  const product = {
    ...productData,
    slug,
    price: Number(productData.price),
    originalPrice:
      productData.originalPrice === "" ||
      productData.originalPrice == null
        ? null
        : Number(productData.originalPrice),
    stock: Number(productData.stock),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const result = await addDoc(productsRef, product);

  return result.id;
}

export async function updateProduct(id, productData) {
  const slug = await ensureUniqueSlug(productData.slug, id);

  const product = {
    ...productData,
    slug,
    price: Number(productData.price),
    originalPrice:
      productData.originalPrice === "" ||
      productData.originalPrice == null
        ? null
        : Number(productData.originalPrice),
    stock: Number(productData.stock),
    updatedAt: serverTimestamp(),
  };

  await updateDoc(
    doc(db, PRODUCTS_COLLECTION, id),
    product
  );
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

export async function updateProductStock(id, stock) {
  const numericStock = Number(stock);

  if (!Number.isInteger(numericStock) || numericStock < 0) {
    throw new Error("Stock must be a non-negative whole number.");
  }

  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
    stock: numericStock,
    updatedAt: serverTimestamp(),
  });
}
