"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./useAuth";
import type { User, UsersHookReturn } from "../types";
import { useMemo } from "react";

export const useUsers = (): UsersHookReturn => {
  const queryClient = useQueryClient();
  const { createUser } = useAuth();

  // Obtener todos los usuarios
  const getUsers = async (): Promise<User[]> => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as User)
    );
  };

  // Obtener un usuario por ID
  const getUserById = async (id?: string): Promise<User | null> => {
    if (!id) return null;
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  };

  // Crear o actualizar usuario
  const saveUser = async (userData: Partial<User>): Promise<Partial<User>> => {
    if (!userData.email) {
      throw new Error("El correo electrónico es requerido");
    }

    // Asegurarse de que el rol sea del tipo correcto
    const validatedUserData: Partial<User> = {
      ...userData,
      role: userData.role === "admin" ? "admin" : "user",
    };

    try {
      // Crear usuario en Firestore
      await createUser(validatedUserData);
      return validatedUserData;
    } catch (error) {
      console.error("Error en saveUser:", error);
      throw error;
    }
  };

  // Eliminar usuario
  const deleteUser = async (id: string): Promise<string> => {
    await deleteDoc(doc(db, "users", id));
    return id;
  };

  // React Query hooks
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const userByIdQueryFn = async (id?: string) => {
    if (!id) return null;
    return getUserById(id);
  };

  const userByIdQuery = (id?: string) => {
    return useQuery({
      queryKey: ["users", id],
      queryFn: () => userByIdQueryFn(id),
      enabled: !!id,
    });
  };

  const saveUserMutation = useMutation({
    mutationFn: saveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const memoizedUserByIdQuery = useMemo(() => userByIdQuery, []);

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error as Error | null,
    userByIdQuery: memoizedUserByIdQuery,
    saveUser: saveUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isSaving: saveUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
