"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import Image from "next/image";

export default function GestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated } = useAuthStore(); // ← NUEVO: Agregar _hasHydrated
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Esperar a que Zustand termine de hidratar
    if (!_hasHydrated) {
      return; // ← NUEVO: No hacer nada hasta que hidrate
    }

    // Si estamos en /gestion/login, no verificar auth
    if (pathname === "/gestion/login") {
      setIsLoading(false);
      return;
    }

    // Verificar autenticación
    if (!isAuthenticated) {
      router.push("/gestion/login");
      return;
    }

    // Solo si está autenticado, permitir ver contenido
    setIsLoading(false);
  }, [isAuthenticated, pathname, router, _hasHydrated]); // ← NUEVO: Agregar _hasHydrated como dependencia

  // Pantalla de carga
  if (isLoading || !_hasHydrated) { // ← NUEVO: Mostrar loading mientras hidrata
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-16 animate-pulse">
            <Image
              src="/logo-rudda.png"
              alt="Rudda Coffee Club"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Si es la página de login, mostrar solo el children
  if (pathname === "/gestion/login") {
    return <>{children}</>;
  }

  // 🔒 PROTECCIÓN ADICIONAL
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-16 animate-pulse">
            <Image
              src="/logo-rudda.png"
              alt="Rudda Coffee Club"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  // Contenido protegido
  return <>{children}</>;
}