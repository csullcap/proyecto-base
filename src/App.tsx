"use client";

import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileNavbar from "./components/MobileNavbar";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="container mx-auto px-4 py-8 flex-1 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNavbar />

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
