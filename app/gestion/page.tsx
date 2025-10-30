"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Tag,
  Users,
  Heart,
  Ticket,
  BarChart3,
  Clock,
  Menu,
  X,
  Search,
  Plus,
  Edit,
  Trash2,
  Percent
} from "lucide-react";
import ModalProductAdd from "@/components/gestion/products/ModalAddProduct";
import ModalProductEdit from "@/components/gestion/products/ModalEditProduct";
import Promociones from "@/components/gestion/products/Promociones";
import ModalAddSubcategoria from "@/components/gestion/categorias/ModalAddSubcategoria";
import ModalEditSubcategoria from "@/components/gestion/categorias/ModalEditSubcategoria";
import axios from "axios";
import { Producto, CategoriaConSubcategorias } from "@/lib/api";

const menuItems = [
  { icon: Package, label: "Productos", value: "productos" },
  { icon: Tag, label: "Categorías", value: "categorias" },
  { icon: Percent, label: "Promociones", value: "promociones" },
  { icon: Users, label: "Clientes", value: "clientes" },
  { icon: Heart, label: "Beneficios", value: "beneficios" },
  { icon: Ticket, label: "Cupones Activos", value: "cupones" },
  { icon: BarChart3, label: "Estadísticas", value: "estadisticas" },
  { icon: Clock, label: "Horarios Especiales", value: "horarios" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GestionDashboard() {
  const [activeTab, setActiveTab] = useState("productos");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoriaConSubcategorias | null>(null);
  

  // Estados para API
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaConSubcategorias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  const [isAddSubcategoriaModalOpen, setIsAddSubcategoriaModalOpen] = useState(false);
const [isEditSubcategoriaModalOpen, setIsEditSubcategoriaModalOpen] = useState(false);
const [selectedSubcategoria, setSelectedSubcategoria] = useState<any>(null);

  // Fetch productos
  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/productostotal.php`);
      setProductos(response.data);
    } catch (err) {
      console.error("Error fetching productos:", err);
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categorías
  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/categorias.php`);
      setCategorias(response.data);
    } catch (err) {
      console.error("Error fetching categorías:", err);
      setError("Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

const filteredSubcategorias =
  selectedCategory?.subcategorias?.filter((s) =>
    s.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleProductAdded = () => {
    fetchProductos(); // Recargar productos
    setIsModalOpen(false);
  };

  const handleEditProduct = (product: Producto) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleProductEdited = () => {
    fetchProductos(); // Recargar productos
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteSubcategoria = async (subcategoria: any) => {
  if (!confirm(`¿Estás seguro de eliminar la subcategoría "${subcategoria.nombre}"?`)) {
    return;
  }

  try {
    await axios.post(`${API_URL}/delete_subcategoria`, {
      id: subcategoria.id,
    });
    
    fetchCategorias(); // Recargar categorías
    alert("Subcategoría eliminada correctamente");
  } catch (error) {
    console.error("Error deleting subcategoria:", error);
    alert("Error al eliminar la subcategoría");
  }
};

  return (
    <div className="min-h-screen bg-[#d9cebe]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#d9cebe] border-r border-[#c4b8a8] transition-all duration-300 z-50 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#c4b8a8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo-rudda.png"
                alt="Rudda Coffee Club Logo"
                className="w-100 h-20 object-cover rounded-lg"
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-black hover:text-[#658c5f]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                disabled={!["productos", "categorias", "promociones"].includes(
                  item.value
                )}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.value
                    ? "bg-[#658c5f] text-[#d9cebe] shadow-lg"
                    : "text-black hover:bg-[#658c5f] hover:text-[#d9cebe]"
                } ${
                  !["productos", "categorias", "promociones"].includes(item.value) &&
                  "cursor-not-allowed opacity-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-[#c4b8a8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#658c5f] rounded-full flex items-center justify-center">
                <span className="text-[#d9cebe] font-bold">BN</span>
              </div>
              <div>
                <p className="text-sm font-medium text-black">Borean Nicolas</p>
                <p className="text-xs text-black/70">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <header className="bg-[#d9cebe] border-b border-[#c4b8a8] sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-black hover:text-[#658c5f]"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="font-display text-2xl text-black">
                {menuItems.find((item) => item.value === activeTab)?.label}
              </h1>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "productos"
                    ? "Buscar productos"
                    : "Buscar subcategorías"
                }
                className="w-full pl-10 pr-4 py-3 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-black">Cargando...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Productos Tab */}
          {activeTab === "productos" && !loading && (
            <div className="space-y-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Añadir Producto
              </button>

              {filteredProductos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-black">No hay productos disponibles</p>
                </div>
              ) : (
                <div className="bg-[#d9cebe] rounded-lg border-2 border-[#c4b8a8] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#c4b8a8] border-b-2 border-[#b3a898]">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-black">
                            NOMBRE
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-black">
                            DESCRIPCIÓN
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-black">
                            PRECIO
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-black">
                            CATEGORÍA
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-black">
                            SUBCATEGORÍAS
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-black">
                            ACCIONES
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c4b8a8]">
                        {filteredProductos.map((producto) => (
                          <tr
                            key={producto.id}
                            className="hover:bg-[#c4b8a8] transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-black font-medium">
                              {producto.nombre}
                            </td>
                            <td className="px-6 py-4 text-sm text-black/80">
                              {producto.descripcion.substring(0, 50)}...
                            </td>
                            <td className="px-6 py-4 text-sm text-black font-medium">
                              ${parseFloat(producto.precio).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-black/80">
                              {producto.categorias.map(c => c.nombre).join(", ")}
                            </td>
                            <td className="px-6 py-4 text-sm text-black/80">
                              {producto.subcategorias.map(s => s.nombre).join(", ")}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleEditProduct(producto)}
                                className="bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

{/* Subcategorías Tab */}
{activeTab === "categorias" && !loading && (
  <div className="space-y-6">
    <h2 className="font-display text-xl text-black mb-4">
      Categorías
    </h2>

    {categorias.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-black">No hay categorías disponibles</p>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.isArray(categorias) && categorias.map((categoria) => (
            <button
              key={categoria.categoria.id}
              onClick={() => setSelectedCategory(categoria)}
              className={`p-6 rounded-lg text-left transition-all border-2 ${
                selectedCategory?.categoria.id === categoria.categoria.id
                  ? "bg-[#658c5f] text-[#d9cebe] border-[#658c5f] shadow-lg scale-105"
                  : "bg-[#d9cebe] text-black border-[#658c5f] hover:bg-[#658c5f] hover:text-[#d9cebe] hover:border-[#658c5f] hover:shadow-md"
              }`}
            >
              <h3 className="font-display text-xl">{categoria.categoria.nombre}</h3>
              <p className="text-sm mt-2 opacity-80">
                {categoria.subcategorias?.length || 0} subcategorías
              </p>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-black">
                Subcategorías de {selectedCategory.categoria.nombre}
              </h3>
                <button 
                  onClick={() => setIsAddSubcategoriaModalOpen(true)}
                  className="bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Añadir Subcategoría
                </button>
            </div>

            {filteredSubcategorias.length === 0 ? (
              <div className="text-center py-8 bg-[#d9cebe] rounded-lg border-2 border-[#c4b8a8]">
                <p className="text-black">No hay subcategorías en esta categoría</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubcategorias.map((subcategoria) => (
                  <div
                    key={subcategoria.id}
                    className="bg-[#d9cebe] p-6 rounded-lg border-2 border-[#c4b8a8] flex justify-between items-start group hover:border-[#658c5f] hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-black mb-1">
                        {subcategoria.nombre}
                      </h4>
                      <p className="text-sm text-black/70">
                        {subcategoria.descripcion || "Sin descripción"}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
  <button 
    onClick={() => {
      setSelectedSubcategoria(subcategoria);
      setIsEditSubcategoriaModalOpen(true);
    }}
    className="p-2 bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] rounded transition-colors"
  >
    <Edit className="w-4 h-4" />
  </button>
  <button 
    onClick={() => handleDeleteSubcategoria(subcategoria)}
    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
  >
    <Trash2 className="w-4 h-4" />
  </button>
</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </>
    )}
  </div>
)}

          {/* Promociones Tab */}
          {activeTab === "promociones" && <Promociones />}
        </main>
      </div>

      {/* Modal Añadir Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <ModalProductAdd
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleProductAdded}
          />
        </div>
      )}

      {/* Modal Editar Producto */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <ModalProductEdit
            product={selectedProduct}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
            onSuccess={handleProductEdited}
          />
        </div>
      )}


{/* Modal Añadir Subcategoría */}
{isAddSubcategoriaModalOpen && selectedCategory && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <ModalAddSubcategoria
      onClose={() => setIsAddSubcategoriaModalOpen(false)}
      onSuccess={() => {
        fetchCategorias();
        setIsAddSubcategoriaModalOpen(false);
      }}
      categoriaId={selectedCategory.categoria.id}
      categoriaNombre={selectedCategory.categoria.nombre}
    />
  </div>
)}

{/* Modal Editar Subcategoría */}
{isEditSubcategoriaModalOpen && selectedSubcategoria && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <ModalEditSubcategoria
      onClose={() => {
        setIsEditSubcategoriaModalOpen(false);
        setSelectedSubcategoria(null);
      }}
      onSuccess={() => {
        fetchCategorias();
        setIsEditSubcategoriaModalOpen(false);
        setSelectedSubcategoria(null);
      }}
      subcategoria={selectedSubcategoria}
    />
  </div>
)}

    </div>
  );
}