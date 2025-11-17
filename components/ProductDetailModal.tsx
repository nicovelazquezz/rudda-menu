"use client";

import Image from "next/image";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    name: string;
    description?: string;
    price: string;
    special_price?: string | null;
    photo?: string;
    promotion?: string;
    sin_gluten?: string;
    sin_tacc?: string;
    vegetariano?: string;
    vegano?: string;
  };
  mostrarPrecioEspecial?: boolean;
}

export function ProductDetailModal({
  open,
  onOpenChange,
  product,
  mostrarPrecioEspecial,
}: ProductDetailModalProps) {
  // Normaliza la descripción
  const normalizedDescription = (product.description ?? "")
    .replaceAll("\\n", "\n")
    .replace(/\r\n|\r|\n/g, "\n");

  // Crear array de opciones
  const options = [];
  if (product.sin_gluten === "1")
    options.push({ label: "Sin Gluten", value: "gluten-free" });
  if (product.sin_tacc === "1")
    options.push({ label: "Sin TACC", value: "tacc-free" });
  if (product.vegetariano === "1")
    options.push({ label: "Vegetariano", value: "vegetarian" });
  if (product.vegano === "1")
    options.push({ label: "Vegano", value: "vegan" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-primary/98 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Título oculto para accesibilidad - siempre presente */}
        <VisuallyHidden.Root>
          <DialogTitle>{product.name}</DialogTitle>
        </VisuallyHidden.Root>

        {/* Imagen con overlay gradient */}
        {product.photo && (
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={product.photo}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/5 to-transparent" />

            {/* Título sobre la imagen */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pt-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Badge de oferta flotante */}
            {mostrarPrecioEspecial &&
              product.special_price &&
              Number(product.special_price) > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg animate-pulse">
                  OFERTA
                </div>
              )}
          </div>
        )}

        {/* Si no hay foto, mostrar título tradicional */}
        {!product.photo && (
          <div className="p-6 pb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-left">
              {product.name}
            </h2>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Precio destacado */}
          <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/8 border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            {mostrarPrecioEspecial &&
            product.special_price &&
            Number(product.special_price) > 0 ? (
              <div className="flex items-center gap-4">
                <span className="text-xl text-white/50 line-through">
                  ${Math.trunc(Number(product.price))}
                </span>
                <span className="text-4xl sm:text-5xl font-bold text-accent drop-shadow-md">
                  ${Math.trunc(Number(product.special_price))}
                </span>
              </div>
            ) : (
              <span className="text-4xl sm:text-5xl font-bold text-accent drop-shadow-md">
                ${Math.trunc(Number(product.price))}
              </span>
            )}
          </div>

          {/* Divisor decorativo */}
          {(normalizedDescription || product.promotion || options.length > 0) && (
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          )}

          {/* Descripción */}
          {normalizedDescription && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-accent uppercase tracking-wide flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Descripción
              </h3>
              <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-line">
                {normalizedDescription}
              </p>
            </div>
          )}

          {/* Texto promocional */}
          {product.promotion && (
            <div className="relative rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/30 p-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
              <p className="text-sm text-accent font-medium italic relative z-10">
                {product.promotion}
              </p>
            </div>
          )}

          {/* Características */}
          {options.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-accent uppercase tracking-wide flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Características
              </h3>
              <div className="flex flex-wrap gap-2">
                {options.map((opt, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm text-white font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:bg-white/15 transition-colors"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {opt.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
