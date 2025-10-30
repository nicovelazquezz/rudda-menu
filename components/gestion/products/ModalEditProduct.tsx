"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalProductEditProps {
  onClose: () => void;
  product: any;
  onSuccess?: () => void;
}

const ModalProductEdit = ({ onClose, product, onSuccess }: ModalProductEditProps) => {
  const [name, setName] = useState(product?.nombre || "");
  const [description, setDescription] = useState(product?.descripcion || "");
  const [price, setPrice] = useState(product?.precio || "");
  const [precioEspecial, setPrecioEspecial] = useState(product?.precioespecial || "");
  const [ibu, setIbu] = useState(product?.ibu || "");
  const [alc, setAlc] = useState(product?.alc || "");
  const [presentation, setPresentation] = useState(product?.type || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [precio33cl, setPrecio33cl] = useState(product?.precio33cl || "");
  const [precio50cl, setPrecio50cl] = useState(product?.precio50cl || "");
  const [precio37cl, setPrecio37cl] = useState(product?.precio37cl || "");
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categorySubcategoryPairs, setCategorySubcategoryPairs] = useState<any[]>(
    product?.vinculaciones || []
  );
  const [presentationType, setPresentationType] = useState(product?.type || "");
  const [promocional, setPromocional] = useState(product?.promocional || "");
  const [isGlutenFree, setIsGlutenFree] = useState(product?.sin_gluten == "1");
  const [isSinTacc, setIsSinTacc] = useState(product?.sin_tacc == "1");
  const [isVegetarian, setIsVegetarian] = useState(product?.vegetariano == "1");
  const [isVegan, setIsVegan] = useState(product?.vegano == "1");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch categories
    fetch("https://cerveceriacolumbus.com.ar/api/categorias")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory) {
      // Find the selected category and its subcategories
      const category = categories.find(
        (cat) => cat.categoria.id === Number(selectedCategory)
      );
      if (category) {
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
          pair.categoria_id === selectedCategory &&
          pair.subcategoria_id === selectedSubcategory
      )
    ) {
      const newPair = {
        categoria_id: selectedCategory,
        subcategoria_id: selectedSubcategory,
        categoria_nombre: categories.find(
          (cat) => cat.categoria.id === Number(selectedCategory)
        )?.categoria.nombre,
        subcategoria_nombre: subcategories.find(
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

  const showIbuAlcFields = categorySubcategoryPairs.some(
    (pair) => pair.categoria_id === "1"
  );

  const handleEditProduct = async () => {
    if (!name.trim() || !price.trim() || categorySubcategoryPairs.length === 0)
      return;

    setIsLoading(true);

    try {
      const response = await fetch("https://cerveceriacolumbus.com.ar/api/edit_product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          nombre: name,
          descripcion: description,
          precio: price,
          precioespecial: precioEspecial,
          ibu,
          alc,
          precio_33cl: precio33cl,
          precio_50cl: precio50cl,
          precio_37cl: precio37cl,
          promocional: promocional,
          presentacion: showIbuAlcFields ? presentationType : presentation,
          vinculaciones: categorySubcategoryPairs.map((pair) => ({
            categoria_id: pair.categoria_id,
            subcategoria_id: pair.subcategoria_id,
          })),
          sin_gluten: isGlutenFree ? 1 : 0,
          sin_tacc: isSinTacc ? 1 : 0,
          vegetariano: isVegetarian ? 1 : 0,
          vegano: isVegan ? 1 : 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al editar el producto");
      }

      if (onSuccess) onSuccess();

      setName("");
      setDescription("");
      setPrice("");
      setPrecioEspecial("");
      setIbu("");
      setAlc("");
      setPresentation("");
      setCategorySubcategoryPairs([]);
      onClose();
    } catch (error) {
      console.error("Error editing product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#d9cebe] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#d9cebe] border-b-2 border-[#c4b8a8] p-6 flex items-center justify-between z-10">
        <h2 className="font-display text-2xl text-black">Editar Producto</h2>
        <button
          onClick={onClose}
          className="text-black hover:text-[#658c5f] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Nombre del Producto */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Nombre del Producto
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
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del producto"
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
            placeholder="Promocional: Sumale cheddar por $"
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Precio
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
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black focus:outline-none focus:border-[#658c5f]"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.categoria.id} value={category.categoria.id}>
                {category.categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategoría */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Subcategoría
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            disabled={!selectedCategory}
            className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black focus:outline-none focus:border-[#658c5f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Selecciona una subcategoría</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Botón agregar par */}
        <button
          onClick={handleAddPair}
          disabled={!selectedCategory || !selectedSubcategory}
          className="w-full bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar otra categoría/subcategoría
        </button>

        {/* Lista de pares */}
        {categorySubcategoryPairs.length > 0 && (
          <div className="space-y-2">
            {categorySubcategoryPairs.map((pair, index) => (
              <div
                key={index}
                onClick={() => handleRemovePair(index)}
                className="p-4 border-2 border-[#c4b8a8] rounded-lg cursor-pointer hover:border-red-600 hover:bg-red-50 transition-colors"
              >
                <p className="text-black">
                  <strong>Categoría:</strong> {pair.categoria_nombre || "Categoría no disponible"}
                </p>
                <p className="text-black">
                  <strong>Subcategoría:</strong> {pair.subcategoria_nombre || "Subcategoría no disponible"}
                </p>
                <p className="text-red-600 text-sm mt-2">
                  Haga clic para eliminar
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Campos IBU, ALC y Presentación */}
        {showIbuAlcFields && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  IBU
                </label>
                <input
                  type="text"
                  value={ibu}
                  onChange={(e) => setIbu(e.target.value)}
                  placeholder="IBU"
                  className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  ALC
                </label>
                <input
                  type="number"
                  value={alc}
                  onChange={(e) => setAlc(e.target.value)}
                  placeholder="ALC"
                  className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-[#658c5f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Presentación
              </label>
              <select
                value={presentationType}
                onChange={(e) => setPresentationType(e.target.value)}
                className="w-full px-4 py-2 bg-[#d9cebe] border-2 border-[#c4b8a8] rounded-lg text-black focus:outline-none focus:border-[#658c5f]"
              >
                <option value="">Selecciona presentación</option>
                <option value="copa">Copa</option>
                <option value="pinta">Pinta</option>
              </select>
            </div>
          </>
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
          onClick={handleEditProduct}
          disabled={isLoading}
          className="flex-1 bg-[#658c5f] hover:bg-[#5a7a54] text-[#d9cebe] font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
};

export default ModalProductEdit;