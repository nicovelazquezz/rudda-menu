"use client";

import React, { useState } from 'react';
import { Package, Tag, Users, Heart, Ticket, BarChart3, Clock, Menu, X, Search, Plus, Edit, Trash2 } from 'lucide-react';
import ModalProductAdd from '@/components/gestion/products/ModalAddProduct';
import ModalProductEdit from '@/components/gestion/products/ModalEditProduct';

// Datos mock
const mockProductos = [
  {
    id: 1,
    nombre: 'KOLSCH - Jophiels',
    descripcion: 'Cuerpo liviano y suave a...',
    precio: 4200.00,
    categoria: 'Nuestras Cervezas',
    subcategoria: 'cerveza',
    especiales: ''
  },
  {
    id: 2,
    nombre: 'SCOTCH - Jophiels',
    descripcion: 'Color cobrizo intenso co...',
    precio: 4200.00,
    categoria: 'Nuestras Cervezas',
    subcategoria: 'cerveza',
    especiales: ''
  },
  {
    id: 3,
    nombre: 'GOLDEN - Garufa',
    descripcion: 'Refrescante y muy fácil ...',
    precio: 4200.00,
    categoria: 'Nuestras Cervezas',
    subcategoria: 'cerveza',
    especiales: ''
  },
  {
    id: 4,
    nombre: 'HONEY - Columbus',
    descripcion: 'Cuerpo intenso, maltoso ...',
    precio: 4200.00,
    categoria: 'Nuestras Cervezas',
    subcategoria: 'cerveza',
    especiales: ''
  },
  {
    id: 5,
    nombre: 'FRAMBUESA - Columbus',
    descripcion: 'Rojiza, maltosa con nota...',
    precio: 4200.00,
    categoria: 'Nuestras Cervezas',
    subcategoria: 'cerveza',
    especiales: ''
  }
];

const mockCategorias = [
  {
    id: 1,
    nombre: 'Nuestras Cervezas',
    subcategorias: [
      { id: 1, nombre: 'cerveza', descripcion: 'Cervezas artesanales' },
      { id: 2, nombre: 'IPA', descripcion: 'India Pale Ale' },
      { id: 3, nombre: 'Stout', descripcion: 'Cervezas oscuras' }
    ]
  },
  {
    id: 2,
    nombre: 'Comidas',
    subcategorias: [
      { id: 4, nombre: 'Pizzas', descripcion: 'Pizzas artesanales' },
      { id: 5, nombre: 'Hamburguesas', descripcion: 'Hamburguesas gourmet' }
    ]
  },
  {
    id: 3,
    nombre: 'Postres',
    subcategorias: [
      { id: 6, nombre: 'Helados', descripcion: 'Helados artesanales' },
      { id: 7, nombre: 'Tartas', descripcion: 'Tartas caseras' }
    ]
  }
];

const menuItems = [
  { icon: Package, label: 'Productos', value: 'productos' },
  { icon: Tag, label: 'Subcategorías', value: 'subcategorias' },
  { icon: Users, label: 'Clientes', value: 'clientes' },
  { icon: Heart, label: 'Beneficios', value: 'beneficios' },
  { icon: Ticket, label: 'Cupones Activos', value: 'cupones' },
  { icon: BarChart3, label: 'Estadísticas', value: 'estadisticas' },
  { icon: Clock, label: 'Horarios Especiales', value: 'horarios' },
];

export default function GestionDashboard() {
  const [activeTab, setActiveTab] = useState('productos');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    nombre: string;
    subcategorias: { id: number; nombre: string; descripcion: string }[];
  } | null>(null);

  const filteredProductos = mockProductos.filter(p => 
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubcategorias = selectedCategory?.subcategorias.filter(s =>
    s.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductAdded = () => {
    // Aquí puedes recargar los productos desde la API
    // Por ahora solo cerramos el modal
    setIsModalOpen(false);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  
  const handleProductEdited = () => {
    // Aquí puedes recargar los productos desde la API
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#d9cebe]">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-[#d9cebe] border-r border-[#c4b8a8] transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.value
                    ? 'bg-[#658c5f] text-[#d9cebe] shadow-lg'
                    : 'text-black hover:bg-[#658c5f] hover:text-[#d9cebe]'
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
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
                {menuItems.find(item => item.value === activeTab)?.label}
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
                placeholder={activeTab === 'productos' ? 'Buscar productos' : 'Buscar subcategorías'}
                className="w-full pl-10 pr-4 py-3 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
              />
            </div>
          </div>

          {/* Productos Tab */}
          {activeTab === 'productos' && (
            <div className="space-y-4">
<button 
  onClick={() => setIsModalOpen(true)}
  className="w-full bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
>
                <Plus className="w-5 h-5" />
                Añadir Producto
              </button>

              <div className="bg-[#d9cebe] rounded-lg border-2 border-[#c4b8a8] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#c4b8a8] border-b-2 border-[#b3a898]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-black">NOMBRE</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-black">DESCRIPCIÓN</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-black">PRECIO</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-black">CATEGORÍA</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-black">SUBCATEGORÍAS</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-black">ESPECIALES</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-black">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c4b8a8]">
                      {filteredProductos.map((producto) => (
                        <tr key={producto.id} className="hover:bg-[#c4b8a8] transition-colors">
                          <td className="px-6 py-4 text-sm text-black font-medium">{producto.nombre}</td>
                          <td className="px-6 py-4 text-sm text-black/80">{producto.descripcion}</td>
                          <td className="px-6 py-4 text-sm text-black font-medium">{producto.precio.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-black/80">{producto.categoria}</td>
                          <td className="px-6 py-4 text-sm text-black/80">{producto.subcategoria}</td>
                          <td className="px-6 py-4 text-sm text-black/80">{producto.especiales || '-'}</td>
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
            </div>
          )}

          {/* Subcategorías Tab */}
          {activeTab === 'subcategorias' && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-black mb-4">Categorías</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {mockCategorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => setSelectedCategory(categoria)}
                    className={`p-6 rounded-lg text-left transition-all border-2 ${
                      selectedCategory?.id === categoria.id
                        ? 'bg-[#658c5f] text-[#d9cebe] border-[#658c5f] shadow-lg scale-105'
                        : 'bg-[#d9cebe] text-black border-[#c4b8a8] hover:bg-[#658c5f] hover:text-[#d9cebe] hover:border-[#658c5f] hover:shadow-md'
                    }`}
                  >
                    <h3 className="font-display text-xl">{categoria.nombre}</h3>
                    <p className="text-sm mt-2 opacity-80">{categoria.subcategorias.length} subcategorías</p>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-black">
                      Subcategorías de {selectedCategory.nombre}
                    </h3>
                    <button className="bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Añadir Subcategoría
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSubcategorias.map((subcategoria) => (
                      <div
                        key={subcategoria.id}
                        className="bg-[#d9cebe] p-6 rounded-lg border-2 border-[#c4b8a8] flex justify-between items-start group hover:border-[#658c5f] hover:shadow-md transition-all"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-black mb-1">{subcategoria.nombre}</h4>
                          <p className="text-sm text-black/70">{subcategoria.descripcion}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Placeholder para otras tabs */}
          {!['productos', 'subcategorias'].includes(activeTab) && (
            <div className="bg-[#d9cebe] rounded-lg border-2 border-[#c4b8a8] p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#c4b8a8] rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.createElement(menuItems.find(item => item.value === activeTab)?.icon || Package, {
                    className: "w-8 h-8 text-black"
                  })}
                </div>
                <h3 className="font-display text-xl text-black mb-2">
                  {menuItems.find(item => item.value === activeTab)?.label}
                </h3>
                <p className="text-black/70">Esta sección estará disponible próximamente</p>
              </div>
            </div>
          )}
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
    </div>
  );
}