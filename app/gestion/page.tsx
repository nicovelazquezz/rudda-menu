"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
  Percent,
} from "lucide-react";
import ModalProductAdd from "@/components/gestion/products/ModalAddProduct";
import ModalProductEdit from "@/components/gestion/products/ModalEditProduct";
import Promociones from "@/components/gestion/Promociones";
import ModalAddSubcategoria from "@/components/gestion/categorias/ModalAddSubcategoria";
import ModalEditSubcategoria from "@/components/gestion/categorias/ModalEditSubcategoria";
import axios from "axios";
import { Producto, CategoriaConSubcategorias } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import ToggleSwitch from "@/components/gestion/products/ToggleSwitch";

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
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("productos");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Estados para API
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaConSubcategorias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const selectedCategory =
    categorias.find((c) => c.categoria.id === selectedCategoryId) ?? null;

  const [isAddSubcategoriaModalOpen, setIsAddSubcategoriaModalOpen] =
    useState(false);
  const [isEditSubcategoriaModalOpen, setIsEditSubcategoriaModalOpen] =
    useState(false);
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
  // Fetch categorías
  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/categorias.php`
      );

      // La respuesta ya viene en el formato correcto
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

  const filteredProductos = productos.filter((p) => {
    if (searchQuery === "ACTIVO") return p.isActive === "1";
    if (searchQuery === "INACTIVO") return p.isActive === "0";
    const query = searchQuery.toLowerCase();

    // Buscar en nombre del producto
    const matchNombre = p.nombre.toLowerCase().includes(query);

    // Buscar en subcategorías
    const matchSubcategoria = p.subcategorias.some((sub) =>
      sub.nombre.toLowerCase().includes(query)
    );

    return matchNombre || matchSubcategoria;
  });

  const filteredSubcategorias = (selectedCategory?.subcategorias ?? []).filter(
    (s) => s.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    if (
      !confirm(
        `¿Estás seguro de eliminar la subcategoría "${subcategoria.nombre}"?`
      )
    ) {
      return;
    }

    try {
      await axios.post(`${API_URL}/delete_subcategoria.php`, {
        id: subcategoria.id,
      });

      fetchCategorias(); // Recargar categorías
      alert("Subcategoría eliminada correctamente");
    } catch (error) {
      console.error("Error deleting subcategoria:", error);
      alert("Error al eliminar la subcategoría");
    }
  };

  const handleDeleteProduct = async (producto: Producto) => {
    if (
      !confirm(
        `¿Estás seguro de eliminar "${
          producto.nombre
        }"?\n\nSe eliminará permanentemente de las siguientes categorías:\n${producto.categorias
          .map((c) => `- ${c.nombre}`)
          .join("\n")}`
      )
    ) {
      return;
    }

    try {
      await axios.post(`${API_URL}/delete_product.php`, {
        id: producto.id,
      });

      fetchProductos(); // Recargar productos
      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto");
    }
  };

  const handleToggleActive = async (itemId: number, currentStatus: string) => {
    const newStatus = currentStatus === "1" ? 0 : 1;

    try {
      await axios.post(`${API_URL}/activar-desactivar_producto.php`, {
        id: itemId,
        status: newStatus,
      });

      fetchProductos(); // Recargar productos
      alert(newStatus === 1 ? "Producto activado" : "Producto desactivado");
    } catch (error) {
      console.error("Error al actualizar el estado del producto:", error);
      alert("Error al cambiar el estado del producto");
    }
  };

  const handleTogglePromocion = async (itemId: number, isPromoted: boolean) => {
    try {
      await axios.post(`${API_URL}/set_promocion.php`, {
        id: itemId,
        promocionar: !isPromoted, // Invertir el estado actual
      });

      fetchProductos(); // Recargar productos
      alert(!isPromoted ? "Producto promocionado" : "Promoción eliminada");
    } catch (error) {
      console.error("Error al cambiar la promoción del producto:", error);
      alert("Error al cambiar la promoción del producto");
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
          <div className="p-6 border-b border-[#c4b8a8] bg-[#658c5f] flex items-center justify-between">
            <div className="flex items-center gap-3 ">
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
                disabled={
                  !["productos", "categorias", "promociones"].includes(
                    item.value
                  )
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.value
                    ? "bg-[#658c5f] text-[#d9cebe] shadow-lg"
                    : "text-black hover:bg-[#658c5f] hover:text-[#d9cebe]"
                } ${
                  !["productos", "categorias", "promociones"].includes(
                    item.value
                  ) && "cursor-not-allowed opacity-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info */}
          {/* User Info */}
          <div className="p-4 border-t border-[#c4b8a8]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#658c5f] rounded-full flex items-center justify-center">
                  <span className="text-[#d9cebe] font-bold">
                    {user?.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    {user?.nombre}
                  </p>
                  <p className="text-xs text-black/70">Admin</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/gestion/login");
                }}
                className="p-2 hover:bg-[#658c5f] hover:text-[#d9cebe] rounded transition-colors"
                title="Cerrar sesión"
              >
                <X className="w-5 h-5" />
              </button>
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
              {/* Botón Añadir Producto - Rediseñado */}
              {/* Contenedor Flex - Filtros a la izquierda, Botón a la derecha */}
              <div className="flex items-center justify-between w-full gap-4 mb-6">
                {/* Filtros a la izquierda */}
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-black/60 mr-2">
                    Filtrar:
                  </p>

                  {/* Todos */}
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      searchQuery === "" ||
                      (searchQuery !== "ACTIVO" && searchQuery !== "INACTIVO")
                        ? "bg-[#658c5f] text-[#d9cebe] shadow-lg shadow-[#658c5f]/30"
                        : "bg-black/5 text-black/70 hover:bg-black/10 border border-[#c4b8a8]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Todos</span>
                      {(searchQuery === "" ||
                        (searchQuery !== "ACTIVO" &&
                          searchQuery !== "INACTIVO")) && (
                        <span className="ml-1 rounded-full bg-[#d9cebe]/20 px-2 py-0.5 text-xs font-bold">
                          {productos.length}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Activos */}
                  <button
                    onClick={() => setSearchQuery("ACTIVO")}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      searchQuery === "ACTIVO"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                        : "bg-black/5 text-black/70 hover:bg-green-50 border border-[#c4b8a8]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          searchQuery === "ACTIVO" ? "bg-white" : "bg-green-500"
                        }`}
                      />
                      <span>Activos</span>
                      {searchQuery === "ACTIVO" && (
                        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                          {productos.filter((p) => p.isActive === "1").length}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Inactivos */}
                  <button
                    onClick={() => setSearchQuery("INACTIVO")}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      searchQuery === "INACTIVO"
                        ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30"
                        : "bg-black/5 text-black/70 hover:bg-red-50 border border-[#c4b8a8]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          searchQuery === "INACTIVO" ? "bg-white" : "bg-red-500"
                        }`}
                      />
                      <span>Inactivos</span>
                      {searchQuery === "INACTIVO" && (
                        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                          {productos.filter((p) => p.isActive === "0").length}
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Botón Añadir Producto a la derecha - ocupa el resto del espacio */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className=" cursor-pointer rounded-2xl bg-[#658c5f] px-4 py-2 transition-shadow hover:shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="rounded-full bg-[#d9cebe]/20 p-1.5">
                      <Plus className="w-5 h-5 text-[#d9cebe]" />
                    </div>
                  </div>
                </button>
              </div>

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
                            PRODUCTO
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
                            TAGS
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-black">
                            PROMOCIONAR
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
                            className={`hover:bg-[#c4b8a8] transition-colors ${
                              producto.isActive === "0"
                                ? "bg-red-100 opacity-60"
                                : ""
                            }`}
                          >
                            {/* Columna de Producto con imagen */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {/* Miniatura de imagen */}
                                <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border-2 border-[#c4b8a8] bg-white/50">
                                  {producto.foto ? (
                                    <Image
                                      src={producto.foto}
                                      alt={producto.nombre}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-black/30">
                                      <Package className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                                {/* Nombre del producto */}
                                <span className="text-sm text-black font-medium">
                                  {producto.nombre}
                                </span>
                                {producto.isActive === "0" && (
                                  <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                    INACTIVO
                                  </span>
                                )}
                                {producto.destacado === "1" && (
                                  <span className="ml-2 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                    ⭐
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 text-sm text-black/80">
                              {producto.descripcion.substring(0, 50)}...
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                {producto.precioespecial &&
                                parseFloat(producto.precioespecial) > 0 &&
                                parseFloat(producto.precioespecial) <
                                  parseFloat(producto.precio) ? (
                                  <>
                                    {/* Precio original tachado sin centavos */}
                                    <span className="text-xs text-black/50 line-through">
                                      $
                                      {Math.trunc(
                                        parseFloat(producto.precio || "0")
                                      )}
                                    </span>
                                    {/* Precio especial destacado sin centavos */}
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-[#658c5f] font-bold">
                                        $
                                        {Math.trunc(
                                          parseFloat(
                                            producto.precioespecial || "0"
                                          )
                                        )}
                                      </span>
                                      <span className="bg-[#658c5f] text-[#d9cebe] text-xs px-2 py-0.5 rounded-full font-medium">
                                        OFERTA
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  /* Precio normal sin centavos */
                                  <span className="text-sm text-black font-medium">
                                    $
                                    {Math.trunc(
                                      parseFloat(producto.precio || "0")
                                    )}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-black/80">
                              {producto.categorias
                                .map((c) => c.nombre)
                                .join(", ")}
                            </td>
                            <td className="px-6 py-4 text-sm text-black/80">
                              {producto.subcategorias
                                .map((s) => s.nombre)
                                .join(", ")}
                            </td>
                            <td className="px-6 py-4">
                              {producto.tags && producto.tags.trim() !== "" ? (
                                <div
                                className={`backdrop-blur-sm rounded-md px-2.5 py-1 shadow-sm flex items-center justify-center overflow-hidden ${
                                producto.tags === "Happy Hour"
                                  ? "bg-amber-500/10"
                                  : producto.tags === "2x1"
                                  ? "bg-emerald-500/10"
                                  : producto.tags === "Destacado"
                                  ? "bg-rose-500/10"
                                  : producto.tags === "Menú del Día"
                                  ? "bg-sky-500/10"
                                  : producto.tags === "Promoción"
                                  ? "bg-orange-500/10"
                                  : "bg-white/10"
                                }`}
                                >
                                <span className="w-full text-[10px] text-center font-semibold text-[#2e4b2a]/60 uppercase tracking-wide whitespace-nowrap truncate">
                                  {producto.tags}
                                </span>
                                </div>
                              ) : null}
                            </td>
                            <td className="px-6 py-4 flex items-center justify-center">
                              <ToggleSwitch
                                checked={producto.destacado === "1"}
                                onChange={() =>
                                  handleTogglePromocion(producto.id, producto.destacado === "1")
                                }
                                labelOn="Promocionado"
                                labelOff="Promocionar"
                              />
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                {/* Botón Editar */}
                                <button
                                  onClick={() => handleEditProduct(producto)}
                                  className="cursor-pointer rounded-xl bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] px-4 py-2 text-sm font-medium transition-all hover:shadow-lg hover:shadow-[#658c5f]/30 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Editar
                                </button>

                                {/* Botón Eliminar */}
                                <button
                                  onClick={() => handleDeleteProduct(producto)}
                                  className="cursor-pointer rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white px-4 py-2 text-sm font-medium transition-all hover:shadow-lg hover:shadow-red-600/30 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Eliminar
                                </button>

                                {/* Botón Activar/Desactivar */}
                                <button
                                  onClick={() =>
                                    handleToggleActive(
                                      producto.id,
                                      producto.isActive
                                    )
                                  }
                                  className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                                    producto.isActive === "1"
                                      ? "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white hover:shadow-lg hover:shadow-yellow-500/30"
                                      : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30"
                                  }`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      producto.isActive === "1"
                                        ? "bg-white"
                                        : "bg-white"
                                    }`}
                                  />
                                  {producto.isActive === "1"
                                    ? "Desactivar"
                                    : "Activar"}
                                </button>

                                
                              </div>
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
                    {Array.isArray(categorias) &&
                      categorias.map((categoria) => (
                        <button
                          key={categoria.categoria.id}
                          onClick={() =>
                            setSelectedCategoryId(categoria.categoria.id)
                          }
                          className={`p-6 rounded-lg text-left transition-all border-2 ${
                            selectedCategoryId === categoria.categoria.id
                              ? "bg-[#658c5f] text-[#d9cebe] border-[#658c5f] shadow-lg scale-105"
                              : "bg-[#d9cebe] text-black border-[#658c5f] hover:bg-[#658c5f] hover:text-[#d9cebe] hover:border-[#658c5f] hover:shadow-md"
                          }`}
                        >
                          <h3 className="font-display text-xl">
                            {categoria.categoria.nombre}
                          </h3>
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
                          <p className="text-black">
                            No hay subcategorías en esta categoría
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredSubcategorias.map((subcategoria) => (
                            <div
                              key={subcategoria.id}
                              className="bg-[#d9cebe] rounded-lg border-2 border-[#c4b8a8] overflow-hidden group hover:border-[#658c5f] hover:shadow-md transition-all"
                            >
                              {/* Imagen de subcategoría */}
                              <div className="relative h-32 w-full bg-white/50">
                                {subcategoria.foto ? (
                                  <Image
                                    src={subcategoria.foto}
                                    alt={subcategoria.nombre}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-black/30">
                                    <Tag className="w-12 h-12" />
                                  </div>
                                )}
                              </div>

                              {/* Contenido */}
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-black">
                                    {subcategoria.nombre}
                                  </h4>
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
                                      onClick={() =>
                                        handleDeleteSubcategoria(subcategoria)
                                      }
                                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <p className="text-xs text-black/50 mt-2">
                                  {subcategoria.count || 0} productos
                                </p>
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
            onSuccess={async () => {
              await fetchCategorias(); // ✅ Esperar a que termine
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
            onSuccess={async () => {
              await fetchCategorias();
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
