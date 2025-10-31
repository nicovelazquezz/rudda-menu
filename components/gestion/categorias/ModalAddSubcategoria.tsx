"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ModalAddSubcategoriaProps {
  onClose: () => void;
  onSuccess: () => void;
  categoriaId: number;
  categoriaNombre: string;
}

const ModalAddSubcategoria = ({
  onClose,
  onSuccess,
  categoriaId,
  categoriaNombre,
}: ModalAddSubcategoriaProps) => {
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSubcategoria = async () => {
    if (!nombre.trim()) {
      alert("Por favor ingresa un nombre para la subcategoría");
      return;
    }

    setIsLoading(true);

    const payload = {
      nombre: nombre,
      categoriaId: categoriaId,
    };

    console.log("POST to", `${API_URL}/add-subcategoria`, "payload:", payload);

    try {
      const response = await axios.post(`${API_URL}/add-subcategoria.php`, payload);
      console.log("POST response:", response);

        // ✅ Llamar onSuccess y esperar a que termine
  await onSuccess();
  
  // Limpiar formulario
  setNombre("");

    } catch (error) {
      console.error("Error adding subcategoria:", error);
      alert("Error al añadir la subcategoría");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#d9cebe] rounded-lg max-w-lg w-full">
      {/* Header */}
      <div className="bg-[#d9cebe] border-b-2 border-[#c4b8a8] p-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-black">
          Añadir Subcategoría a {categoriaNombre}
        </h2>
        <button
          onClick={onClose}
          className="text-black hover:text-[#658c5f] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <div>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Clásicos, Premium, etc."
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
          />
        </div>


      </div>

      {/* Footer */}
      <div className="bg-[#d9cebe] border-t-2 border-[#c4b8a8] p-6 flex gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 border-2 border-[#c4b8a8] text-black rounded-lg hover:bg-[#c4b8a8] transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleAddSubcategoria}
          disabled={isLoading}
          className="flex-1 bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Añadiendo..." : "Añadir Subcategoría"}
        </button>
      </div>
    </div>
  );
};

export default ModalAddSubcategoria;