// src/lib/api.ts (o src/lib/types/api.ts)

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Subcategoria {
  id: string;
  nombre: string;
}

export interface Vinculacion {
  id: string;
  categoria_id: string;
  categoria_nombre: string;
  subcategoria_id: string;
  subcategoria_nombre: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  promocional: string;
  precio: string;
  precioespecial: string;
  precio33cl: string;
  precio50cl: string;
  precio37cl: string;
  type: string;
  isActive: string;
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  vinculaciones: Vinculacion[];
  sin_gluten: string;
  sin_tacc: string;
  vegetariano: string;
  vegano: string;
}

export interface CategoriaConSubcategorias {
  categoria: {
    id: number;
    nombre: string;
  };
  subcategorias: {
    id: number;
    nombre: string;
    descripcion?: string;
  }[];
  horarios: any[]; // <-- AGREGAR ESTE CAMPO
}