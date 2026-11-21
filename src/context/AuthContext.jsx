import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { AuthContext } from "./AuthContextDefinition";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAdmin(false);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const adminRef = doc(db, "admins", currentUser.uid);
        const adminSnapshot = await getDoc(adminRef);

        setIsAdmin(
          adminSnapshot.exists() &&
          adminSnapshot.data().active === true
        );
      } catch (error) {
        console.error("Admin verification failed:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    try {
      const adminRef = doc(db, "admins", result.user.uid);
      const adminSnapshot = await getDoc(adminRef);

      if (
        !adminSnapshot.exists() ||
        adminSnapshot.data().active !== true
      ) {
        await signOut(auth);
        throw new Error(
          "You are not authorized as an administrator."
        );
      }

      return result;
    } catch (error) {
      if (auth.currentUser) {
        await signOut(auth);
      }

      throw error;
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}