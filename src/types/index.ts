// Tipos de usuario
export interface User {
  id: string; // Ahora usamos un ID automático
  email: string;
  displayName: string | null;
  photoURL?: string | null;
  role: "admin" | "user";
  createdAt?: string;
  createdBy?: string;
}

// Tipos para el contexto de autenticación
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<boolean>;
}

// Tipos para los hooks de usuarios
export interface UsersHookReturn {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  userByIdQuery: (id: string | undefined) => any;
  saveUser: (userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  isSaving: boolean;
  isDeleting: boolean;
}
