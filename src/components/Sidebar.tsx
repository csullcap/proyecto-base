"use client";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";
import { Home, Users, X, LogOut, ChevronRight, User } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } bg-white shadow-lg w-64 md:sticky rounded-r-lg`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-tr-lg">
            <Link
              to="/dashboard"
              className="flex items-center"
              onClick={closeSidebar}
            >
              <Logo className="h-10 w-auto" />
            </Link>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-200 md:hidden transition-colors duration-200"
              aria-label="Cerrar sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <div className="flex items-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL || "/placeholder.svg"}
                  alt={user.displayName || "Usuario"}
                  className="h-10 w-10 rounded-full mr-3 border border-gray-200 object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-medium mr-3 border border-gray-200">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="font-medium text-gray-800 truncate">
                  {user?.displayName || user?.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  user?.role === "admin"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {user?.role === "admin" ? "Administrador" : "Usuario"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className={`flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                    isActive("/dashboard")
                      ? "bg-gray-100 text-primary font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={closeSidebar}
                >
                  <Home size={18} className="mr-3" />
                  <span>Dashboard</span>
                  {isActive("/dashboard") && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/users"
                    className={`flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                      isActive("/users")
                        ? "bg-gray-100 text-primary font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={closeSidebar}
                  >
                    <Users size={18} className="mr-3" />
                    <span>Usuarios</span>
                    {isActive("/users") && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                    isActive("/profile")
                      ? "bg-gray-100 text-primary font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={closeSidebar}
                >
                  <User size={18} className="mr-3" />
                  <span>Perfil</span>
                  {isActive("/profile") && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <button
              onClick={() => {
                handleLogout();
                closeSidebar();
              }}
              className="flex items-center w-full p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut size={18} className="mr-3" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
