"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useMenuData, getProductosByCategoria } from "@/hooks/useMenuData";

function MenuItemRow({
  name,
  description,
  price,
  precioEspecial,
  image,
  promocional,
  options,
}: {
  name: string;
  description?: string;
  price: string;
  precioEspecial?: string;
  image?: string;
  promocional?: string;
  options?: { label: string; value: string }[];
}) {
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
              {precioEspecial ? (
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xs text-white/50 line-through">${price}</span>
                  <span className="rounded-lg bg-accent/20 px-2.5 py-1 text-sm font-bold text-accent">
                    ${precioEspecial}
                  </span>
                </div>
              ) : (
                <span className="rounded-lg bg-accent/20 px-2.5 py-1 text-sm font-bold text-accent">
                  ${price}
                </span>
              )}
            </div>
          </div>

          {description && (
            <p className="mt-1 text-xs leading-relaxed text-white/80 line-clamp-3">
              {description}
            </p>
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
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { productos, categorias, loading, error } = useMenuData();

  const categoria = categorias.find((c) => c.categoria.id === Number(id));
  const productosCategoria = getProductosByCategoria(productos, Number(id));

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  if (error || !categoria) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-white">Categoría no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
        <div className="flex items-center gap-3 px-6 py-3">
          <Link
            href="/"
            className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-medium flex-1">{categoria.categoria.nombre}</h1>
        </div>
      </header>

      {/* Items */}
      <div className="px-6 py-6 space-y-4">
        {productosCategoria.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70">No hay productos en esta categoría</p>
          </div>
        ) : (
          productosCategoria.map((item) => {
            // Crear array de opciones basado en características del producto
            const options = [];
            if (item.sin_gluten === "1") options.push({ label: "Sin Gluten", value: "gluten-free" });
            if (item.sin_tacc === "1") options.push({ label: "Sin TACC", value: "tacc-free" });
            if (item.vegetariano === "1") options.push({ label: "Vegetariano", value: "vegetarian" });
            if (item.vegano === "1") options.push({ label: "Vegano", value: "vegan" });

            return (
              <MenuItemRow
                key={item.id}
                name={item.nombre}
                description={item.descripcion}
                price={item.precio}
                precioEspecial={item.precioespecial || undefined}
                image={item.imagen}
                promocional={item.promocional}
                options={options}
              />
            );
          })
        )}
      </div>

      <div className="h-6" />
    </div>
  );
}