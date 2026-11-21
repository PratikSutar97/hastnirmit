import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

const CATEGORIES_COLLECTION = "categories";
const categoriesRef = collection(db, CATEGORIES_COLLECTION);

function generateSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getAllCategories() {
  const q = query(categoriesRef, orderBy("name", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function createCategory(categoryData) {
  const name = String(categoryData.name || "").trim();
  if (!name) {
    throw new Error("Category name is required.");
  }

  const payload = {
    name,
    slug: generateSlug(categoryData.slug || name),
    description: String(categoryData.description || "").trim(),
    color: categoryData.color || "category-pink",
    icon: categoryData.icon || "Gem",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(categoriesRef, payload);
  return docRef.id;
}

export async function updateCategory(id, categoryData) {
  const name = String(categoryData.name || "").trim();
  if (!name) {
    throw new Error("Category name is required.");
  }

  const payload = {
    name,
    slug: generateSlug(categoryData.slug || name),
    description: String(categoryData.description || "").trim(),
    color: categoryData.color || "category-pink",
    icon: categoryData.icon || "Gem",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, CATEGORIES_COLLECTION, id), payload);
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}