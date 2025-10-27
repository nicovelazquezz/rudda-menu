// app/category/[id]/page.tsx  (SERVER COMPONENT)
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { menuCategories, getMenuItemsByCategory } from "@/lib/menu-data"
import { CategoryRecommendations } from "@/components/category-recommendations"


export function generateStaticParams() {
  return menuCategories.map(c => ({ id: c.id }));
}
export const dynamicParams = true;


const categoryRecommendations: Record<string, Array<{ name: string; image: string; tag: string }>> = {
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
}
export default async function CategoryPage(
  { params }: { params: Promise<{ id: string }> }   // ⬅️ importante: Promise
) {
  const { id } = await params                         // ⬅️ importante: await

  const category = menuCategories.find((c) => c.id === id)
  if (!category) notFound()

  const items = getMenuItemsByCategory(id)
  const recommendations = categoryRecommendations[id] || []

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
        <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
      </div>

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <CategoryRecommendations recommendations={recommendations} categoryName={category.name} />
      )}

      {/* Items */}
      <div className="px-6 py-6 space-y-6">
        {items.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-base font-medium mb-1.5 text-balance leading-snug">{item.name}</h2>
                {item.description && (
                  <p className="text-xs text-primary-foreground/70 leading-relaxed mb-2">{item.description}</p>
                )}
                {item.options?.length ? (
                  <ul className="space-y-0.5 mb-2">
                    {item.options.map((option, idx) => (
                      <li key={idx} className="text-xs text-primary-foreground/75 flex items-start gap-2">
                        <span className="text-accent mt-0.5 text-[10px]">●</span>
                        <span className="leading-relaxed">{option}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-lg font-bold text-accent">${item.price}</p>
              </div>
            </div>
            <div className="h-px bg-primary-foreground/10" />
          </div>
        ))}
      </div>

      <div className="h-6" />
    </div>
  )
}
