"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { useProductosPorSubcategoria } from "@/hooks/useMenuData";
import BackToTop from "@/components/BackToTop";

function MenuItemRow({
  name,
  description,
  price,
  specialPrice,
  image,
  promocional,
  options,
  mostrarPrecioEspecial,
}: {
  name: string;
  description?: string;
  price: string;
  specialPrice?: string | null;
  image?: string;
  promocional?: string;
  options?: { label: string; value: string }[];
  mostrarPrecioEspecial?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongDescription = description && description.length > 120;

    // Normaliza: convierte "\n" literales a saltos reales y unifica CRLF/CR/LF
  const normalizedDescription =
    (description ?? "")
      .replaceAll("\\n", "\n")
      .replace(/\r\n|\r|\n/g, "\n");

  return (
    <div className="group rounded-2xl border border-white/15 bg-white/8 hover:bg-white/12 transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex gap-4 p-3 sm:p-4">
        {/* imagen */}
        {image ? (
          <Image
            src={image}
            alt={name}
            width={72}
            height={72}
            className="h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-xl object-cover ring-1 ring-black/10"
          />
        ) : (
          <div
            aria-hidden
            className="h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-xl bg-white/5"
          />
        )}

        {/* contenido */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="flex-1 truncate text-[15px] font-semibold text-white leading-tight">
              {name}
            </h3>
            {/* precio */}
            <div className="shrink-0">
              {mostrarPrecioEspecial &&
              specialPrice &&
              Number(specialPrice) > 0 ? (
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xs text-white/50 line-through">
                    ${Math.trunc(Number(price))}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-accent/20 px-2.5 py-1 text-sm font-bold text-accent">
                      ${Math.trunc(Number(specialPrice))}
                    </span>
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      OFERTA
                    </span>
                  </div>
                </div>
              ) : (
                <span className="rounded-lg bg-accent/20 px-2.5 py-1 text-sm font-bold text-accent">
                  ${Math.trunc(Number(price))}
                </span>
              )}
            </div>
          </div>
 {normalizedDescription && (
            <div className="mt-1">
              <p
                className={`text-xs leading-relaxed text-white/80 whitespace-pre-line ${
                  !isExpanded && hasLongDescription ? "line-clamp-3" : ""
                }`}
              >
                {normalizedDescription}
              </p>

              {hasLongDescription && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  {isExpanded ? (
                    <>
                      Ver menos <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Ver más <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
          {promocional && (
            <p className="mt-1 text-xs text-accent/90 italic">{promocional}</p>
          )}

          {options && options.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {options.map((opt, i) => (
                <li
                  key={i}
                  className="rounded-md bg-black/15 px-2 py-0.5 text-[11px] text-white/85"
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ alias: string; subcategoriaId: string }>;
}) {
  const { alias, subcategoriaId } = use(params);
  const { productos, subcategoria, mostrarPrecioEspecial, loading, error } =
    useProductosPorSubcategoria(alias, subcategoriaId);

  // ← NUEVO: Estados para scroll de productos destacados
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [productosDestacados, setProductosDestacados] = useState<any[]>([]);

  // ← NUEVO: Determinar si debe mostrar sponsor
  const shouldShowSponsor =
    subcategoria?.nombre === "Signature Drinks" ||
    subcategoria?.nombre === "Smoothies Energeticos";

  // ← NUEVO: Función para mezclar y seleccionar productos aleatorios
  useEffect(() => {
    if (productos.length > 0) {
      const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      // Filtrar productos con foto
      const productosConFoto = productos.filter((p: any) => p.photo);

      // Mezclar y tomar 3 aleatorios
      const aleatorios = shuffleArray(productosConFoto).slice(0, 3);

      // Asignar badges
      const badges = ["Popular", "Recomendado"];
      const destacados = aleatorios.map((producto: any, index: number) => ({
        ...producto,
        label: badges[index % badges.length],
      }));

      setProductosDestacados(destacados);
    }
  }, [productos]);

  // ← NUEVO: Función para verificar scroll
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // ← NUEVO: Listener para scroll
  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [productosDestacados]);

  // ← NUEVO: Función para scroll
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 160;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Error al cargar los productos</p>
          <Link href="/" className="text-accent hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Buscar la primera imagen disponible en los productos
  const heroImage =
    productos.find((p: any) => p.photo)?.photo || "/logo-rudda.png";

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/98 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="flex items-center gap-3 px-6 py-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Link>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            {subcategoria?.nombre}
          </h1>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={heroImage}
          alt={subcategoria?.nombre || "Productos"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
      </div>

      {/* ← DESCRIPCIÓN DE LA SUBCATEGORÍA */}
{subcategoria?.descripcion && (
  <div className="px-6 pt-6 pb-3 max-w-7xl mx-auto">
    <div className="border-l-4 border-accent/40 pl-4 py-2">
      <p className="text-sm sm:text-base leading-relaxed text-white/80 whitespace-pre-line">
        {subcategoria.descripcion}
      </p>
    </div>
  </div>
)}
      {/* ==========================================
          ← NUEVA SECCIÓN: PRODUCTOS DESTACADOS
          ========================================== */}
      {productosDestacados.length > 0 && (
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">
              Destacados de {subcategoria?.nombre}
            </h2>
            {productosDestacados.length > 2 && (
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className="p-1.5 rounded-lg bg-white/10 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className="p-1.5 rounded-lg bg-white/10 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
          >
            {productosDestacados.map((producto) => (
              <div key={producto.id} className="flex-shrink-0 w-36">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                  <Image
                    src={producto.photo}
                    alt={producto.name}
                    fill
                    className="object-cover"
                  />
                  {/* Badge Popular/Recomendado */}
                  {producto.label && (
                    <div className="absolute top-2 right-2 bg-accent/95 backdrop-blur-sm px-2 rounded-full py-1 flex items-center justify-center">
                      <span className="text-[10px] font-semibold text-primary">
                        {producto.label}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-medium text-xs text-white mb-0.5 line-clamp-2">
                  {producto.name}
                </h3>

                {/* Mostrar precio (sin badge de oferta) */}
                {mostrarPrecioEspecial &&
                producto.special_price &&
                Number(producto.special_price) > 0 ? (
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] text-white/50 line-through">
                      ${Math.trunc(Number(producto.price))}
                    </p>
                    <p className="text-xs text-accent font-bold">
                      ${Math.trunc(Number(producto.special_price))}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-accent font-bold">
                    ${Math.trunc(Number(producto.price))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ========================================== */}

      {/* ← NUEVO: Badge Sponsor - Solo para categorías patrocinadas */}
      {shouldShowSponsor && (
        <div className="px-6  max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 shadow-sm flex items-center justify-center gap-2">
            <span className="text-[16px] font-bold text-white/70">
              Powered by
            </span>
            <Image
              src="/ena-sport.png"
              alt="ENA Sport"
              width={56}
              height={37}
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Items - Mejorado para Desktop */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {productos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70">No hay productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((item: any) => {
              // Crear array de opciones basado en características del producto
              const options = [];
              if (item.sin_gluten === "1")
                options.push({ label: "Sin Gluten", value: "gluten-free" });
              if (item.sin_tacc === "1")
                options.push({ label: "Sin TACC", value: "tacc-free" });
              if (item.vegetariano === "1")
                options.push({ label: "Vegetariano", value: "vegetarian" });
              if (item.vegano === "1")
                options.push({ label: "Vegano", value: "vegan" });

              return (
                <MenuItemRow
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  specialPrice={item.special_price}
                  image={item.photo}
                  promocional={item.promotion}
                  options={options}
                  mostrarPrecioEspecial={mostrarPrecioEspecial}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="h-6" />
      <BackToTop />
    </div>
  );
}
