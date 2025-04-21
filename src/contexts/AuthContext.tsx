"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import type { AuthContextType, User } from "../types";

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser: FirebaseUser | null) => {
        if (currentUser) {
          // Obtener datos adicionales del usuario desde Firestore
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              ...(userSnap.data() as Partial<User>),
            } as User);
          } else {
            // Si el usuario no existe en Firestore, cerrar sesión
            await signOut(auth);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Verificar si el usuario está registrado en Firestore
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Si el usuario no existe, cerrar sesión
        await signOut(auth);
        throw new Error("Usuario no autorizado. Contacte al administrador.");
      }

      return result.user;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      // Generate a random UID if not provided
      const uid =
        userData.uid ||
        `user_${Date.now().toString(36)}_${Math.random()
          .toString(36)
          .substr(2, 5)}`;

      // Create or update user in Firestore
      await setDoc(
        doc(db, "users", uid),
        {
          email: userData.email,
          displayName: null, // No display name provided
          role: "user", // Default role is user
          createdAt: new Date().toISOString(),
          createdBy: user?.uid || "system",
        },
        { merge: true }
      );

      return true;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    loginWithGoogle,
    logout,
    createUser,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
