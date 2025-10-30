"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(false);
  setLoading(true);

  try {
    const { data } = await axios.post(`${API_URL}/login_api_panel.php`, {
      usuario: username,
      password: password,
    });

    console.log("✅ Respuesta del backend:", data);
    
    // Pasar directamente el objeto usuario
    login(data.usuario);  // <-- CAMBIO AQUÍ
    
    console.log("✅ Login ejecutado, redirigiendo...");
    
    router.push("/gestion");
  } catch (err) {
    console.error("❌ Error al iniciar sesión:", err);
    setError(true);
    setPassword("");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      {/* Contenedor del formulario */}
      <div className="w-full max-w-md">
        {/* Card de login con glassmorphism */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Logo dentro del card */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-48 h-16">
              <Image
                src="/logo-rudda.png"
                alt="Rudda Coffee Club"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario */}
            <div>
              <label
                htmlFor="username"
                className="block text-md font-bold text-accent mb-2"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-accent placeholder:text-accent/200 focus:outline-none focus:border-accent focus:bg-white/30 transition-all"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-md font-bold text-accent mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-accent placeholder:text-accent/200 focus:outline-none focus:border-accent focus:bg-white/30 transition-all"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-100 px-4 py-3 rounded-lg text-sm">
                Usuario o contraseña incorrectos
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-accent/60 text-sm mt-6">
          Rudda Coffee Club © 2025
        </p>
      </div>
    </div>
  );
}