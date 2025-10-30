"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ModalEditSubcategoriaProps {
  onClose: () => void;
  onSuccess: () => void;
  subcategoria: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
}

const ModalEditSubcategoria = ({
  onClose,
  onSuccess,
  subcategoria,
}: ModalEditSubcategoriaProps) => {
  const [nombre, setNombre] = useState(subcategoria.nombre);
  const [descripcion, setDescripcion] = useState(subcategoria.descripcion || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleEditSubcategoria = async () => {
    if (!nombre.trim()) {
      alert("Por favor ingresa un nombre para la subcategoría");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/edit_subcategoria.php`, {
        id: subcategoria.id,
        nombre: nombre,
        descripcion: descripcion,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error editing subcategoria:", error);
      alert("Error al editar la subcategoría");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#d9cebe] rounded-lg max-w-lg w-full">
      {/* Header */}
      <div className="bg-[#d9cebe] border-b-2 border-[#c4b8a8] p-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-black">
          Editar Subcategoría
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
          <label className="block text-sm font-medium text-black mb-2">
            Nombre de la Subcategoría *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la subcategoría"
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Descripción (Opcional)
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción de la subcategoría"
            rows={3}
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
          onClick={handleEditSubcategoria}
          disabled={isLoading}
          className="flex-1 bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
};

export default ModalEditSubcategoria;