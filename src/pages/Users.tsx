"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import toast from "react-hot-toast";
import type { User } from "../types";
import { Plus, Trash2 } from "lucide-react";

const Users = () => {
  const { users, isLoading, isError, deleteUser, isDeleting } = useUsers();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">
          {" "}
          No se pudieron cargar los usuarios.
        </span>
      </div>
    );
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete || !userToDelete.id) return;

    try {
      await deleteUser(userToDelete.id);
      toast.success("Usuario eliminado correctamente");
      setUserToDelete(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("Error al eliminar usuario");
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Usuarios
        </h1>
        <Link
          to="/users/new"
          className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus size={18} className="mr-1 md:mr-2" />
          <span className="hidden sm:inline">Nuevo Usuario</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {/* Vista de tarjetas para todos los tamaños de pantalla */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hay usuarios registrados
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Encabezado de la tabla (solo visible en pantallas grandes) */}
            <div className="hidden xl:grid xl:grid-cols-12 bg-gray-50 px-6 py-3 rounded-t-lg">
              <div className="xl:col-span-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </div>
              <div className="xl:col-span-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </div>
              <div className="xl:col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </div>
              <div className="xl:col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de creación
              </div>
              <div className="xl:col-span-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </div>
            </div>

            {/* Filas de usuarios */}
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`p-4 xl:p-0 hover:bg-gray-50 transition-colors duration-150 ${
                  index === users.length - 1 ? "rounded-b-lg" : ""
                }`}
              >
                {/* Vista para pantallas grandes (similar a tabla) */}
                <div className="hidden xl:grid xl:grid-cols-12 xl:items-center xl:px-6 xl:py-4">
                  <div className="xl:col-span-4">
                    <div className="flex items-center">
                      {user.photoURL ? (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            src={user.photoURL || "/placeholder.svg"}
                            alt=""
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-medium border border-gray-200">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="xl:col-span-3 text-sm text-gray-900">
                    {user.email}
                  </div>
                  <div className="xl:col-span-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </div>
                  <div className="xl:col-span-2 text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="xl:col-span-1 text-right">
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-md transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Vista para pantallas pequeñas y medianas (tarjetas) */}
                <div className="xl:hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {user.photoURL ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          src={user.photoURL || "/placeholder.svg"}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-medium border border-gray-200">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {user.displayName || user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : "Usuario"}
                    </span>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {userToDelete && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Eliminar usuario
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar a este usuario?
                        Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={cancelDelete}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
