"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "glass" | "gradientLeft" | "elevated";

export interface CategoryCardProps {
  href: string;
  name: string;
  itemCount: number | string;
  image: string;
  variant?: Variant;
}

export function CategoryCard({
  href,
  name,
  itemCount,
  image,
  variant = "glass",
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      aria-label={`Ver categoría ${name}`}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl p-3 transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        "active:scale-[0.99] min-h-20",
        // ✅ NUEVO: Añadir max-width en desktop
        "w-full md:max-w-md lg:max-w-lg",
        variant === "glass" &&
          "border border-white/20 bg-white/15 backdrop-blur-md shadow-[0_6px_24px_-8px_rgba(0,0,0,0.35)] hover:bg-white/20 dark:border-white/10 dark:bg-white/10",
        variant === "gradientLeft" &&
          "border border-accent/20 bg-gradient-to-r from-white/70 via-white/60 to-accent/25 hover:from-white/80 hover:via-white/70 hover:to-accent/35 dark:from-white/10 dark:via-white/5 dark:to-accent/30",
        variant === "elevated" &&
          "border border-accent/25 bg-white shadow-sm hover:shadow-md dark:bg-white/5 dark:border-white/10"
      )}
    >
      {/* imagen */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          sizes="64px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 to-black/0" />
      </div>

      {/* textos */}
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold text-[#2e4b2a] leading-tight truncate">
          {name}
        </h3>
        <p className="mt-0.5 text-[12px] text-[#2e4b2a]/80">
          {itemCount} items
        </p>
      </div>

      {/* chevron */}
      <ChevronRight
        className={cn(
          "h-5 w-5 shrink-0",
          variant === "glass" ? "text-white" : "text-primary/60"
        )}
        aria-hidden
      />

      {/* acentos decorativos */}
      {variant === "glass" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/20"
        />
      )}
      {variant === "gradientLeft" && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-full w-1.5 rounded-r-2xl bg-accent/80"
        />
      )}
      {variant === "elevated" && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-black/5"
        />
      )}
    </Link>
  );
}