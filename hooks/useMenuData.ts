"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Subcategoria {
  id: number;
  nombre: string;
  foto: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  alias: string;
  subcategorias: Subcategoria[];
}

export interface Destacado {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  precioespecial?: string;
  imagen?: string;
  promocional?: string;
  label?: string; // "Menú del Día", "Promo", "Recomendado", etc.
}

export interface MenuData {
  categorias: Categoria[];
  destacados: Destacado[];
}

export function useMenuData() {
  const [menuData, setMenuData] = useState<MenuData>({
    categorias: [],
    destacados: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/categorias_y_destacados.php`);
        
        if (response.data.success) {
          setMenuData({
            categorias: response.data.categorias || [],
            destacados: response.data.destacados || [],
          });
        } else {
          setError("Error al cargar el menú");
        }
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError("Error al cargar el menú");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ...menuData, loading, error };
}

// Hook para obtener productos de una subcategoría específica
// Hook para obtener productos de una subcategoría específica
export function useProductosPorSubcategoria(alias: string, subcategoriaId: string) {
  const [data, setData] = useState<{
    productos: any[];
    subcategoria: { id: number; nombre: string; descripcion: string } | null;
    categoria: { id: number; alias: string } | null;
    mostrarPrecioEspecial: boolean;
  }>({
    productos: [],
    subcategoria: null,
    categoria: null,
    mostrarPrecioEspecial: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      if (!alias || !subcategoriaId) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/productos_por_categoria_subcategoria.php?alias=${alias}&subcategoria_id=${subcategoriaId}`
        );

        console.log("Productos recibidos:", response.data);

        if (response.data.success) {
          setData({
            productos: response.data.productos || [],
            subcategoria: response.data.subcategoria || null,
            categoria: response.data.categoria || null,
            mostrarPrecioEspecial: response.data.mostrar_precio_especial || false,
          });
        } else {
          setError("Error al cargar los productos");
        }
      } catch (err) {
        console.error("Error fetching productos:", err);
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [alias, subcategoriaId]);

  return { ...data, loading, error };
}

// Helper para crear slug desde nombre
export function createSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}