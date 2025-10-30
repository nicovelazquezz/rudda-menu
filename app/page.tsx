"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { useMenuData, createSlug } from "@/hooks/useMenuData";
import ModalPromos from "@/components/ModalPromos";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { productos, categorias, loading, error } = useMenuData();

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 160;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Filtrar productos para recomendados (productos con precio especial o promocional)
  const recomendados = productos
    .filter((p) => p.precioespecial || p.promocional)
    .slice(0, 5);

  // Si no hay productos con promoción, mostrar los primeros 5
  const recommendedItems = recomendados.length > 0 ? recomendados : productos.slice(0, 5);

  // Filtrar productos por búsqueda
  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-6">
            <ModalPromos /> 

      <header className="sticky top-0 z-50 bg-primary px-6 py-4 text-center">
        <Image
          src="/logo-rudda.png"
          alt="Rudda Coffee Club"
          width={200}
          height={55}
          className="mx-auto"
        />
      </header>

      <div className="px-6 pt-4 pb-2">
        <h1 className="text-base font-normal text-accent mb-0.5">
          Elegí tu comida favorita
        </h1>
        <p className="text-accent/80 text-xs">
          Menú completo de desayunos, brunch y café specialty
        </p>
      </div>

      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/60" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-accent/30 bg-accent/20 pl-10 pr-4 py-2.5 text-sm text-accent placeholder:text-accent/60 focus:outline-none focus:border-accent/50 focus:bg-accent/30 transition-colors"
          />
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {searchQuery && (
        <div className="px-6 mb-5">
          <h2 className="text-sm font-semibold text-accent mb-2.5">
            Resultados de búsqueda ({filteredProductos.length})
          </h2>
          <div className="space-y-2">
            {filteredProductos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-3 flex gap-3"
              >
                {producto.imagen && (
                  <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-accent truncate">
                    {producto.nombre}
                  </h3>
                  <p className="text-xs text-accent/80 line-clamp-2 mt-0.5">
                    {producto.descripcion}
                  </p>
                  <p className="text-sm font-bold text-accent mt-1">
                    ${producto.precio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendados */}
      {!searchQuery && recommendedItems.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5 px-6">
            <h2 className="text-sm font-semibold text-accent">
              Recomendados & Promociones
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="p-1.5 rounded-lg bg-accent/30 border border-accent/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/40 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4 text-accent" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="p-1.5 rounded-lg bg-accent/30 border border-accent/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/40 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4 text-accent" />
              </button>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 px-6 scrollbar-hide scroll-smooth"
          >
            {recommendedItems.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-36">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                  {item.imagen ? (
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/20" />
                  )}
                  {item.promocional && (
                    <div className="absolute top-2 right-2 bg-accent/95 backdrop-blur-sm px-2 rounded-full py-1 flex items-center justify-center">
                      <span className="text-[10px] font-semibold text-primary">
                        Promo
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-xs text-accent mb-0.5">
                  {item.nombre}
                </h3>
                <p className="text-xs text-accent font-bold">${item.precio}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="px-6 py-12 text-center">
          <p className="text-accent/70">Cargando menú...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-6 py-12 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Categorías */}
      {!loading && !error && !searchQuery && (
        <div className="px-6">
          <h2 className="text-sm font-semibold text-accent mb-2.5">Categorías</h2>
          <div className="space-y-3">
            {categorias.map((c) => {
              const slug = createSlug(c.categoria.nombre);
              const productosCount = productos.filter((p) =>
                p.categorias.some((cat) => String(cat.id) === String(c.categoria.id))
              ).length;

              return (
                <CategoryCard
                  key={c.categoria.id}
                  href={`/category/${c.categoria.id}`}
                  name={c.categoria.nombre}
                  itemCount={productosCount}
                  image="/placeholder.svg" // Puedes agregar imágenes default por categoría
                  variant="glass"
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}