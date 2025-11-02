"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Subcategoria {
  id: number;
  nombre: string;
  foto: string;
  count?: number;
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
  tags?: string;
  precioespecial?: string;
  imagen?: string;
  promocional?: string;
  label?: string; // "Menú del Día", "Promo", "Recomendado", etc.
}

// ← NUEVA INTERFAZ para productos destacados
export interface ProductoDestacado {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  precioespecial?: string;
  foto: string;
  promocional?: string;
  label?: string; // "Popular" o "Recomendado"
  categorias: Array<{ id: string; nombre: string }>;
  subcategorias: Array<{ id: string; nombre: string }>;
  sin_gluten?: string;
  sin_tacc?: string;
  vegetariano?: string;
  vegano?: string;
}

export interface MenuData {
  categorias: Categoria[];
  destacados: Destacado[];
  productosDestacados: ProductoDestacado[]; // ← NUEVO
}

export function useMenuData() {
  const [menuData, setMenuData] = useState<MenuData>({
    categorias: [],
    destacados: [],
    productosDestacados: [], // ← NUEVO
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categorías y destacados
        const response = await axios.get(`${API_URL}/categorias_y_destacados.php`);
        
        if (response.data.success) {
          setMenuData((prev) => ({
            ...prev,
            categorias: response.data.categorias || [],
            destacados: response.data.destacados || [],
          }));
        } else {
          setError("Error al cargar el menú");
        }
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError("Error al cargar el menú");
      }
    };


const fetchProductosDestacados = async () => {
  try {
    const response = await axios.get(`${API_URL}/productostotal.php`);
    const productos = response.data;
    
    // Filtrar solo productos con imagen (SIN filtro de isActive)
    const productosConImagen = productos.filter(
      (p: any) => p.foto && p.foto.trim() !== ""
    );
    
    // Función para mezclar array aleatoriamente (Fisher-Yates shuffle)
    const shuffleArray = (array: any[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    // Mezclar productos y tomar 5 aleatorios
    const productosAleatorios = shuffleArray(productosConImagen).slice(0, 5);
    
    // Asignar badges alternados
    const badges = ["Popular", "Recomendado"];
    const destacados: ProductoDestacado[] = productosAleatorios.map(
      (producto: any, index: number) => ({
        ...producto,
        label: badges[index % badges.length]
      })
    );
    
    setMenuData((prev) => ({
      ...prev,
      productosDestacados: destacados,
    }));
    
    console.log("✅ Productos destacados cargados:", destacados.length); // ← Para debug
  } catch (err) {
    console.error("Error fetching productos destacados:", err);
  }
};

    // Ejecutar ambas funciones
    const loadAllData = async () => {
      await Promise.all([fetchData(), fetchProductosDestacados()]);
      setLoading(false);
    };

    loadAllData();
  }, []);

  return { 
    categorias: menuData.categorias,
    destacados: menuData.destacados,
    productosDestacados: menuData.productosDestacados, // ← NUEVO
    loading, 
    error 
  };
}

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