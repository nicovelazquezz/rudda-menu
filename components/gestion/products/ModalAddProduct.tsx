"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ModalProductAddProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalProductAdd = ({ onClose, onSuccess }: ModalProductAddProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [precioEspecial, setPrecioEspecial] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categorySubcategoryPairs, setCategorySubcategoryPairs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isSinTacc, setIsSinTacc] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [promocional, setPromocional] = useState("");

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await axios.get(`${API_URL}/categorias.php`);
        console.log("Categorías recibidas:", response.data);
        
        // Asegurarnos de que sea un array
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory) {
      // Find the selected category and its subcategories
      const category = categories.find(
        (cat) => cat.categoria.id === Number(selectedCategory)
      );
      if (category && Array.isArray(category.subcategorias)) {
        setSubcategories(category.subcategorias);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories]);

  const handleAddPair = () => {
    if (
      selectedCategory &&
      selectedSubcategory &&
      !categorySubcategoryPairs.some(
        (pair) =>
          pair.categoryId === selectedCategory &&
          pair.subcategoryId === selectedSubcategory
      )
    ) {
      const newPair = {
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
        categoryName: categories.find(
          (cat) => cat.categoria.id === Number(selectedCategory)
        )?.categoria.nombre,
        subcategoryName: subcategories.find(
          (subcat) => subcat.id === Number(selectedSubcategory)
        )?.nombre,
      };
      setCategorySubcategoryPairs([...categorySubcategoryPairs, newPair]);
      setSelectedCategory("");
      setSelectedSubcategory("");
      setSubcategories([]);
    }
  };

  const handleRemovePair = (index: number) => {
    const updatedPairs = categorySubcategoryPairs.filter((_, i) => i !== index);
    setCategorySubcategoryPairs(updatedPairs);
  };

const handleAddProduct = async () => {
  // 🔍 DEBUGGING - Ver qué valores tenemos
  console.log("=== DEBUGGING AÑADIR PRODUCTO ===");
  console.log("name:", name);
  console.log("name.trim():", name.trim());
  console.log("price:", price);
  console.log("price.trim():", price.trim());
  console.log("categorySubcategoryPairs:", categorySubcategoryPairs);
  console.log("categorySubcategoryPairs.length:", categorySubcategoryPairs.length);
  console.log("================================");

  if (!name.trim() || !price.trim() || categorySubcategoryPairs.length === 0) {
    console.log("❌ Validación falló:");
    console.log("  - name válido?", !!name.trim());
    console.log("  - price válido?", !!price.trim());
    console.log("  - pares válidos?", categorySubcategoryPairs.length > 0);
    alert("Por favor completa todos los campos requeridos");
    return;
  }

  console.log("✅ Validación pasó, enviando producto...");

  setIsLoading(true);

  try {
    const response = await axios.post(`${API_URL}/add-product.php`, {
      nombre: name,
      descripcion: description,
      precio: price,
      precioespecial: precioEspecial,
      promocional: promocional,
      vinculaciones: categorySubcategoryPairs,
      sin_gluten: isGlutenFree ? 1 : 0,
      sin_tacc: isSinTacc ? 1 : 0,
      vegetariano: isVegetarian ? 1 : 0,
      vegano: isVegan ? 1 : 0,
    });

    console.log("Producto añadido:", response.data);

    if (onSuccess) onSuccess();

    // Reset form
    setName("");
    setDescription("");
    setPrice("");
    setPrecioEspecial("");
    setPromocional("");
    setIsGlutenFree(false);
    setIsSinTacc(false);
    setIsVegetarian(false);
    setIsVegan(false);
    setCategorySubcategoryPairs([]);
    onClose();
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Error al añadir el producto. Revisa la consola para más detalles.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="bg-[#d9cebe] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#d9cebe] border-b-2 border-[#c4b8a8] p-6 flex items-center justify-between z-10">
        <h2 className="font-display text-2xl text-black">Añadir Producto</h2>
        <button
          onClick={onClose}
          className="text-black hover:text-[#658c5f] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Mensaje si no hay categorías */}
        {!isLoadingCategories && categories.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">⚠️ No hay categorías disponibles</p>
            <p className="text-sm">Por favor, crea categorías antes de añadir productos.</p>
          </div>
        )}

        {/* Loading categorías */}
        {isLoadingCategories && (
          <div className="text-center py-4">
            <p className="text-black">Cargando categorías...</p>
          </div>
        )}

        {/* Nombre del Producto */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del producto"
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Descripción del Producto
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del producto"
            rows={3}
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
          />
        </div>

        {/* Promocional */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Promocional (Texto Opcional)
          </label>
          <input
            type="text"
            value={promocional}
            onChange={(e) => setPromocional(e.target.value)}
            placeholder="Ej: Sumale cheddar por $500"
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Precio *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio del producto"
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
          />
        </div>

        {/* Precio Promocional */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Precio Promocional
          </label>
          <input
            type="number"
            value={precioEspecial}
            onChange={(e) => setPrecioEspecial(e.target.value)}
            placeholder="Precio promocional (opcional)"
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
          />
          {precioEspecial && Number(precioEspecial) >= Number(price) && (
            <p className="text-red-600 text-sm mt-1">
              El precio promocional debe ser menor que el precio original.
            </p>
          )}
        </div>

        {/* Categoría */}
        {!isLoadingCategories && (
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Categoría *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={categories.length === 0}
              className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black focus:outline-none focus:border-[#658c5f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona una categoría</option>
              {Array.isArray(categories) && categories.map((category) => (
                <option key={category.categoria.id} value={category.categoria.id}>
                  {category.categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subcategoría */}
        {!isLoadingCategories && (
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Subcategoría *
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory || subcategories.length === 0}
              className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black focus:outline-none focus:border-[#658c5f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona una subcategoría</option>
              {Array.isArray(subcategories) && subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botón agregar par */}
        {!isLoadingCategories && (
          <button
            onClick={handleAddPair}
            disabled={!selectedCategory || !selectedSubcategory}
            className="w-full bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar otra categoría/subcategoría
          </button>
        )}

        {/* Lista de pares */}
        {categorySubcategoryPairs.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black mb-2">
              Categorías y subcategorías asignadas:
            </label>
            {categorySubcategoryPairs.map((pair, index) => (
              <div
                key={index}
                onClick={() => handleRemovePair(index)}
                className="p-4 border-2 border-[#c4b8a8] rounded-lg cursor-pointer hover:border-red-600 hover:bg-red-50 transition-colors"
              >
                <p className="text-black">
                  <strong>Categoría:</strong> {pair.categoryName}
                </p>
                <p className="text-black">
                  <strong>Subcategoría:</strong> {pair.subcategoryName}
                </p>
                <p className="text-red-600 text-sm mt-2">
                  Haga clic para eliminar
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Opciones especiales */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">
            Opciones especiales
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isGlutenFree}
                onChange={(e) => setIsGlutenFree(e.target.checked)}
                className="w-4 h-4 text-[#658c5f] border-[#c4b8a8] rounded focus:ring-[#658c5f]"
              />
              <span className="text-black">Sin gluten</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSinTacc}
                onChange={(e) => setIsSinTacc(e.target.checked)}
                className="w-4 h-4 text-[#658c5f] border-[#c4b8a8] rounded focus:ring-[#658c5f]"
              />
              <span className="text-black">Sin TACC</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
                className="w-4 h-4 text-[#658c5f] border-[#c4b8a8] rounded focus:ring-[#658c5f]"
              />
              <span className="text-black">Vegetariano</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVegan}
                onChange={(e) => setIsVegan(e.target.checked)}
                className="w-4 h-4 text-[#658c5f] border-[#c4b8a8] rounded focus:ring-[#658c5f]"
              />
              <span className="text-black">Vegano</span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-[#d9cebe] border-t-2 border-[#c4b8a8] p-6 flex gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 border-2 border-[#c4b8a8] text-black rounded-lg hover:bg-[#c4b8a8] transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleAddProduct}
          disabled={isLoading || categories.length === 0}
          className="flex-1 bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Añadiendo..." : "Añadir"}
        </button>
      </div>
    </div>
  );
};

export default ModalProductAdd;