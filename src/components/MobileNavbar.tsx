"use client";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Home, Users, LogOut, User } from "lucide-react";

const MobileNavbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-30">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive("/dashboard") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>

        {isAdmin && (
          <Link
            to="/users"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/users") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Usuarios</span>
          </Link>
        )}

        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive("/profile") ? "text-primary" : "text-gray-500"
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Perfil</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-full text-red-500"
        >
          <LogOut size={20} />
          <span className="text-xs mt-1">Salir</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavbar;
