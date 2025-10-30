"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Promocion {
  id: number;
  nombre: string;
  imagen: string;
  activo: string;
}

interface PromocionesProps {
  onSuccess?: () => void;
}

const PromocionCard = ({ 
  promocion, 
  index,
  onToggleActivo, 
  onDelete 
}: { 
  promocion: Promocion;
  index: number;
  onToggleActivo: (id: number, currentStatus: string) => void;
  onDelete: (id: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef.current;
    
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element: dragHandle,
        getInitialData: () => ({ promocion, index }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        getData: () => ({ index }),
      })
    );
  }, [promocion, index]);

  return (
    <div
      ref={ref}
      className={`bg-[#d9cebe] p-4 rounded-lg border-2 border-[#c4b8a8] transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-3">
        {/* Drag Handle */}
        <div
          ref={dragHandleRef}
          className="cursor-grab active:cursor-grabbing w-full flex justify-center py-2 hover:bg-[#c4b8a8] rounded transition-colors"
        >
          <GripVertical className="w-5 h-5 text-black/50" />
        </div>

        {/* Imagen */}
        <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-[#c4b8a8]">
          <img
            src={promocion.imagen}
            alt={promocion.nombre}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Título */}
        <p className="font-medium text-black text-center w-full">
          {promocion.nombre}
        </p>

        {/* Controles */}
        <div className="flex items-center gap-3 w-full justify-center">
          {/* Switch Activo/Inactivo */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-black">
              {promocion.activo === "1" ? "Activo" : "Inactivo"}
            </span>
            <button
              onClick={() => onToggleActivo(promocion.id, promocion.activo)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                promocion.activo === "1" ? "bg-[#658c5f]" : "bg-[#c4b8a8]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  promocion.activo === "1" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>

          {/* Botón Eliminar */}
          <button
            onClick={() => onDelete(promocion.id)}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalAddPromocion = ({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onAdd: (titulo: string, imagen: string) => void;
}) => {
  const [titulo, setTitulo] = useState("");
  const [imagen, setImagen] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim() || !imagen.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }
    
    setIsLoading(true);
    await onAdd(titulo, imagen);
    setIsLoading(false);
    
    setTitulo("");
    setImagen("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#d9cebe] rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="border-b-2 border-[#c4b8a8] p-6">
          <h2 className="font-display text-2xl text-black">Añadir Promoción</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Título de la promoción *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la promoción"
              className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Imagen *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#658c5f] file:text-[#d9cebe] file:cursor-pointer hover:file:bg-[#5a7a54]"
            />
          </div>

          {imagen && (
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-lg overflow-hidden border-2 border-[#c4b8a8]">
                <img
                  src={imagen}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#c4b8a8] p-6 flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-[#c4b8a8] text-black rounded-lg hover:bg-[#c4b8a8] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !titulo.trim() || !imagen.trim()}
            className="flex-1 bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Añadiendo..." : "Añadir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Promociones({ onSuccess }: PromocionesProps) {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchPromociones();
  }, []);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const fetchPromociones = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/obtener_promos.php`);
      console.log("Promociones obtenidas:", response.data);
      
      if (Array.isArray(response.data)) {
        setPromociones(response.data);
      } else {
        setPromociones([]);
      }
    } catch (error) {
      console.error("Error al obtener las promociones:", error);
      setShowToast({
        message: "Error al obtener las promociones",
        type: "error"
      });
      setPromociones([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPromocion = async (titulo: string, imagen: string) => {
    try {
      const response = await axios.post(`${API_URL}/agregar_promo.php`, {
        nombre: titulo,
        imagen: imagen,
        activo: "1",
      });

      console.log("Promoción añadida:", response.data);

      if (response.data) {
        // Recargar promociones desde el servidor
        await fetchPromociones();
        setIsModalOpen(false);
        setShowToast({
          message: "Promoción añadida correctamente",
          type: "success"
        });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error al añadir la promoción:", error);
      setShowToast({
        message: "Error al añadir la promoción",
        type: "error"
      });
    }
  };

  const handleToggleActivo = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "1" ? "0" : "1";
      
      await axios.post(`${API_URL}/actualizar_estado_promo.php`, {
        id,
        activo: newStatus,
      });

      setPromociones(
        promociones.map((promo) =>
          promo.id === id ? { ...promo, activo: newStatus } : promo
        )
      );
      
      setShowToast({
        message: `Promoción ${newStatus === "1" ? "activada" : "desactivada"} correctamente`,
        type: "success"
      });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      setShowToast({
        message: "Error al actualizar el estado",
        type: "error"
      });
    }
  };

  const handleDeletePromocion = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta promoción?")) return;

    try {
      await axios.post(`${API_URL}/eliminar_promo.php`, {
        id
      });

      setPromociones(promociones.filter((promo) => promo.id !== id));
      
      setShowToast({
        message: "Promoción eliminada correctamente",
        type: "success"
      });
    } catch (error) {
      console.error("Error al eliminar la promoción:", error);
      setShowToast({
        message: "Error al eliminar la promoción",
        type: "error"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border-2 ${
          showToast.type === 'success' 
            ? 'bg-[#658c5f] border-[#5a7a54] text-[#d9cebe]' 
            : 'bg-red-600 border-red-700 text-white'
        }`}>
          <p className="font-medium">{showToast.message}</p>
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Añadir Promoción
      </button>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-black">Cargando promociones...</p>
        </div>
      )}

      {/* Grid de Promociones */}
      {!isLoading && promociones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promociones.map((promocion, index) => (
            <PromocionCard
              key={promocion.id}
              promocion={promocion}
              index={index}
              onToggleActivo={handleToggleActivo}
              onDelete={handleDeletePromocion}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && promociones.length === 0 && (
        <div className="bg-[#d9cebe] rounded-lg border-2 border-[#c4b8a8] p-12 text-center">
          <p className="text-black/70">
            No hay promociones. Añade una nueva promoción para comenzar.
          </p>
        </div>
      )}

      <ModalAddPromocion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPromocion}
      />
    </div>
  );
}