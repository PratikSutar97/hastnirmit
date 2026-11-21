import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

const ORDERS_COLLECTION = "orders";
const ordersRef = collection(db, ORDERS_COLLECTION);

export async function getAllOrders() {
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function updateOrderStatus(orderId, status) {
  if (!orderId || !status) {
    throw new Error("Order ID and status are required.");
  }

  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}