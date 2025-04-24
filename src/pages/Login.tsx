"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";
import toast from "react-hot-toast";

const Login = () => {
  const { loginWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Mover la redirección a un useEffect
  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]); // Dependencias del useEffect

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  // Si el usuario ya está autenticado, no renderizamos nada mientras se redirige
  if (user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Fondo con imagen y overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/ceprunsa_local.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Primera capa de desenfoque con color sólido */}
        <div className="absolute inset-0 backdrop-blur-md bg-blue-900/60"></div>

        {/* Segunda capa con gradiente para añadir profundidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/50 mix-blend-overlay"></div>
      </div>

      {/* Contenido del login */}
      <div className="relative z-10 max-w-md w-full mx-4 space-y-8 bg-white bg-opacity-95 p-8 rounded-lg shadow-2xl">
        <div className="flex flex-col items-center">
          <Logo className="h-20 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta para continuar
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Iniciar sesión con Google
              </span>
            )}
          </button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Centro Pre-Universitario de la Universidad Nacional de San Agustín
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
