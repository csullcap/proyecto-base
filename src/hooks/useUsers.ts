"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
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
          uid: doc.id,
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
      return { uid: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  };

  // Crear o actualizar usuario
  const saveUser = async (userData: Partial<User>): Promise<Partial<User>> => {
    // Crear usuario en Authentication y Firestore
    await createUser(userData);
    return userData;
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

  const userByIdQuery = (id?: string): UseQueryResult<User | null, Error> => {
    const query = useQuery({
      queryKey: ["users", id],
      queryFn: () => getUserById(id),
      enabled: !!id,
    });
    return query;
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

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error as Error | null,
    userByIdQuery,
    saveUser: saveUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isSaving: saveUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
