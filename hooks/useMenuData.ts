"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Subcategoria {
  id: number;
  nombre: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  precioespecial: string;
  imagen?: string; // Asumiendo que la API puede devolver una imagen
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  promocional?: string;
  sin_gluten: string;
  sin_tacc: string;
  vegetariano: string;
  vegano: string;
}

export interface CategoriaCompleta {
  categoria: {
    id: number;
    nombre: string;
  };
  subcategorias: any[];
  horarios: any[];
}

export function useMenuData() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productosRes, categoriasRes] = await Promise.all([
          axios.get(`${API_URL}/productostotal.php`),
          axios.get(`${API_URL}/categorias.php`),
        ]);

        setProductos(Array.isArray(productosRes.data) ? productosRes.data : []);
        setCategorias(Array.isArray(categoriasRes.data) ? categoriasRes.data : []);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError("Error al cargar el menú");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { productos, categorias, loading, error };
}

// Helper para obtener productos por categoría
export function getProductosByCategoria(productos: Producto[], categoriaId: number) {
  return productos.filter((p) =>
    p.categorias.some((c) => c.id === categoriaId)
  );
}

// Helper para crear slug desde nombre
export function createSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}