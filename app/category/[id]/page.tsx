// app/category/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { menuCategories, getMenuItemsByCategory } from "@/lib/menu-data";
import { CategoryRecommendations } from "@/components/category-recommendations";

export function generateStaticParams() {
  return menuCategories.map((c) => ({ id: c.id }));
}
export const dynamicParams = true;

// Card/row para cada item del menú
function MenuItemRow({
  name,
  description,
  price,
  image,
  options,
}: {
  name: string;
  description?: string;
  price: string;
  image?: string;
  options?: string[];
}) {
  return (
    <div className="group rounded-2xl border border-white/15 bg-white/8 hover:bg-white/12 transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] focus-within:ring-2 focus-within:ring-white/60">
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
          <div className="h-16 w-16 shrink-0 rounded-xl bg-black/10" />
        )}

        {/* contenido */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="flex-1 truncate text-[15px] font-semibold text-white leading-tight">
              {name}
            </h3>
            {/* precio en “pill” */}
            <span className="ml-2 shrink-0 rounded-lg bg-accent/20 px-2.5 py-1 text-sm font-bold text-accent tracking-tight">
              ${price}
            </span>
          </div>

          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-white/80 line-clamp-3">
              {description}
            </p>
          ) : null}

          {options?.length ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {options.map((opt, i) => (
                <li
                  key={i}
                  className="rounded-md bg-black/15 px-2 py-0.5 text-[11px] text-white/85"
                >
                  {opt}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const categoryRecommendations: Record<
  string,
  Array<{ name: string; image: string; tag: string }>
> = {
  "huevos-king": [
    { name: "Green King", image: "/avocado-toast-eggs.png", tag: "Popular" },
    { name: "Salmón Ahumado", image: "/eggs-breakfast.jpg", tag: "Premium" },
  ],
  "power-bowls": [
    { name: "Açaí", image: "/yogurt-bowl-berries.jpg", tag: "Popular" },
    { name: "Greek Bowl", image: "/greek-yogurt-berries.png", tag: "Recomendado" },
  ],
  "pancakes-waffles": [
    { name: "Protein", image: "/pancakes-stack.jpg", tag: "Popular" },
    { name: "Cacao & Avena", image: "/pancakes-stack.jpg", tag: "Favorito" },
  ],
  ensaladas: [
    { name: "Completa de Pollo", image: "/fresh-salad-bowl.jpg", tag: "Popular" },
    { name: "Salmón", image: "/fresh-salad-bowl.jpg", tag: "Premium" },
  ],
  tartas: [
    { name: "Caprese", image: "/savory-tart.jpg", tag: "Popular" },
    { name: "Verduras Asadas", image: "/savory-tart.jpg", tag: "Recomendado" },
  ],
  wraps: [
    { name: "Thai de Pollo", image: "/wrap-sandwich.jpg", tag: "Popular" },
    { name: "Proteico", image: "/wrap-sandwich.jpg", tag: "Fitness" },
  ],
  rituales: [
    { name: "Power Brunch", image: "/breakfast-toast-coffee.jpg", tag: "Popular" },
    { name: "Avocado Toast", image: "/avocado-toast-eggs.png", tag: "Favorito" },
  ],
  smoothies: [
    { name: "Açaí", image: "/fruit-smoothie.png", tag: "Popular" },
    { name: "Proteico", image: "/fruit-smoothie.png", tag: "Fitness" },
  ],
  sandwiches: [
    { name: "Club Crispy", image: "/gourmet-sandwich.png", tag: "Popular" },
    { name: "Argento", image: "/gourmet-sandwich.png", tag: "Premium" },
  ],
  tostones: [
    { name: "Avocado Toast", image: "/avocado-toast.png", tag: "Popular" },
    { name: "Burrata Ibérico", image: "/avocado-toast.png", tag: "Premium" },
  ],
  dulces: [
    { name: "Croissant", image: "/golden-croissant.png", tag: "Popular" },
    { name: "Medialuna Jamón y Queso", image: "/golden-croissant.png", tag: "Favorito" },
  ],
  coffee: [
    { name: "Cappuccino", image: "/cappuccino-coffee.png", tag: "Popular" },
    { name: "Cold Brew", image: "/specialty-coffee-latte-art.jpg", tag: "Specialty" },
  ],
  tea: [
    { name: "Chai Especiado", image: "/loose-leaf-tea.jpg", tag: "Popular" },
    { name: "Earl Grey", image: "/loose-leaf-tea.jpg", tag: "Clásico" },
  ],
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = menuCategories.find((c) => c.id === id);
  if (!category) notFound();

  const items = getMenuItemsByCategory(id);
  const recommendations = categoryRecommendations[id] || [];

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
          <h1 className="text-lg font-medium flex-1">{category.name}</h1>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
      </div>

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <CategoryRecommendations
          recommendations={recommendations}
          categoryName={category.name}
        />
      )}

      {/* Items (usando MenuItemRow) */}
      <div className="px-6 py-6 space-y-4">
        {items.map((item) => (
          <MenuItemRow
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={(item as any).image}
            options={item.options}
          />
        ))}
      </div>

      <div className="h-6" />
    </div>
  );
}
