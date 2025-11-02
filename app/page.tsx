"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { useMenuData } from "@/hooks/useMenuData";
import ModalPromos from "@/components/ModalPromos";
import BackToTop from "@/components/BackToTop";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef2 = useRef<HTMLDivElement>(null); // ← NUEVO: Para productos destacados
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft2, setCanScrollLeft2] = useState(false); // ← NUEVO
  const [canScrollRight2, setCanScrollRight2] = useState(true); // ← NUEVO

  // ← MODIFICADO: Agregar productosDestacados
  const { categorias, destacados, productosDestacados, loading, error } =
    useMenuData();

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // ← NUEVO: Función para scroll de productos destacados
  const checkScroll2 = () => {
    if (scrollContainerRef2.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef2.current;
      setCanScrollLeft2(scrollLeft > 0);
      setCanScrollRight2(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    checkScroll2(); // ← NUEVO
    const container = scrollContainerRef.current;
    const container2 = scrollContainerRef2.current; // ← NUEVO

    if (container) {
      container.addEventListener("scroll", checkScroll);
    }

    // ← NUEVO
    if (container2) {
      container2.addEventListener("scroll", checkScroll2);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
      if (container2) {
        container2.removeEventListener("scroll", checkScroll2);
      }
    };
  }, [destacados, productosDestacados]); // ← MODIFICADO: Agregar productosDestacados

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 160;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ← NUEVO: Función para scroll de productos destacados
  const scroll2 = (direction: "left" | "right") => {
    if (scrollContainerRef2.current) {
      const scrollAmount = 160;
      scrollContainerRef2.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Obtener todas las subcategorías o filtradas por categoría seleccionada
  const subcategoriasToShow = selectedCategoryId
    ? categorias.find((c) => c.id === selectedCategoryId)?.subcategorias || []
    : categorias.flatMap((c) =>
        c.subcategorias.map((sub) => ({
          ...sub,
          categoriaAlias: c.alias,
          categoriaNombre: c.nombre,
        }))
      );

  // Filtrar subcategorías por búsqueda
  const filteredSubcategorias = subcategoriasToShow.filter((sub) =>
    sub.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading Screen - Pantalla de carga elegante
  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-48 h-16 animate-pulse">
            <Image
              src="/logo-rudda.png"
              alt="Rudda Coffee Club"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex gap-2">
            <div
              className="w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Error State - Pantalla de error
  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <div className="text-center">
          <div className="relative w-48 h-16 mx-auto mb-6 opacity-50">
            <Image
              src="/logo-rudda.png"
              alt="Rudda Coffee Club"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-accent mb-4 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <ModalPromos />

      <header className="sticky top-0 z-50 bg-primary px-6 py-4 text-center">
        <Image
          src="/logo-rudda.png"
          alt="Rudda Coffee Club"
          width={250}
          height={100}
          quality={100}          
          className="mx-auto"
        />
      </header>

      <div className="px-6 pb-2">
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

      {/* Recomendados - Solo si hay destacados */}
      {!searchQuery && destacados.length > 0 && (
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
            {destacados.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-36">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
            {item.imagen ? (
<Image
  src={item.imagen}
  alt={item.nombre}
  fill
  className="object-cover"
  sizes="144px"
  quality={100}
/>
            ) : (
              <Image
  src="/placeholder-subcategori.png"
  alt="Rudda placeholder"
  fill
  className="object-contain bg-accent/20 p-4"
  sizes="144px"
  quality={100}

/>
            )}
                  {item.tags && item.tags.trim() !== "" && (
                    <div
                      className={`absolute top-2 right-2 backdrop-blur-sm rounded-md px-2.5 py-1 shadow-sm flex items-center ${
                        item.tags === "Happy Hour"
                          ? "bg-amber-500/10"
                          : item.tags === "2x1"
                          ? "bg-emerald-500/10"
                          : item.tags === "Destacado"
                          ? "bg-rose-500/10"
                          : item.tags === "Menú del Día"
                          ? "bg-sky-500/10"
                          : item.tags === "Promoción"
                          ? "bg-orange-500/10"
                          : "bg-white/10"
                      }`}
                    >
                      <span className="text-[10px] font-semibold text-[#2e4b2a]/60 uppercase tracking-wide">
                        {item.tags}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-xs text-accent mb-0.5 line-clamp-2">
                  {item.nombre}
                </h3>

                {/* Mostrar precio especial si existe */}
                {item.precioespecial &&
                parseFloat(item.precioespecial) > 0 &&
                parseFloat(item.precioespecial) < parseFloat(item.precio) ? (
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] text-accent/60 line-through">
                      ${parseFloat(item.precio).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-accent font-bold">
                        ${parseFloat(item.precioespecial).toFixed(2)}
                      </p>
                      <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold">
                        OFERTA
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-accent font-bold">
                    ${parseFloat(item.precio).toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categorías y Subcategorías */}
      <div className="px-6">
        {/* Header con Chips de Categorías */}
        {!searchQuery && (
          <div className="flex items-center gap-3 mb-3 overflow-x-auto scrollbar-hide pb-2">
            <div className="flex gap-2">
              {/* Chip "Todas" */}
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-4 py-1.5 rounded-full text-xs transition-colors shrink-0 ${
                  selectedCategoryId === null
                    ? "bg-accent text-primary font-bold"
                    : "bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30"
                }`}
              >
                TODO
              </button>

              {/* Chips de Categorías */}
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => setSelectedCategoryId(categoria.id)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-colors shrink-0 ${
                    selectedCategoryId === categoria.id
                      ? "bg-accent text-primary font-bold"
                      : "bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30"
                  }`}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Título para resultados de búsqueda */}
        {searchQuery && (
          <h2 className="text-sm font-semibold text-accent mb-2.5">
            Resultados de búsqueda ({filteredSubcategorias.length})
          </h2>
        )}

        {/* Subcategorías */}
        {filteredSubcategorias.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-accent/70">
              {searchQuery
                ? `No se encontraron resultados para "${searchQuery}"`
                : "No hay subcategorías disponibles"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {filteredSubcategorias.map((sub: any) => {
              const categoria = categorias.find((c) =>
                c.subcategorias.some((s) => s.id === sub.id)
              );

              const shouldShowSponsor =
                sub.nombre === "Signature Drinks" ||
                sub.nombre === "Smoothies Energeticos";

              return (
                <CategoryCard
                  key={`${sub.id}-${categoria?.id || "all"}`}
                  href={`/category/${categoria?.alias || sub.categoriaAlias}/${
                    sub.id
                  }`}
                  name={sub.nombre}
                  itemCount={sub.count}
                  image={sub.foto}
                  variant="glass"
                  sponsorLogo={shouldShowSponsor ? "/ena-sport.png" : undefined} // ← AGREGAR
                />
              );
            })}
          </div>
        )}
      </div>
      <BackToTop />
    </div>
  );
}
