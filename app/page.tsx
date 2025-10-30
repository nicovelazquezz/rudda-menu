"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ChevronRight, ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { menuCategories } from "@/lib/menu-data"
import { CategoryCard } from "@/components/ui/CategoryCard";

const recommendedItems = [
  {
    id: "rec-1",
    name: "Avocado Toast",
    price: "8500",
    image: "/avocado-toast-eggs.png",
    tag: "Popular",
  },
  {
    id: "rec-2",
    name: "Greek Bowl",
    price: "7800",
    image: "/greek-yogurt-berries.png",
    tag: "Recomendado",
  },
  {
    id: "rec-3",
    name: "Cappuccino",
    price: "3500",
    image: "/cappuccino-coffee.png",
    tag: "Favorito",
  },
  {
    id: "rec-4",
    name: "Power Brunch",
    price: "11500",
    image: "/eggs-breakfast.jpg",
    tag: "Menú del Día",
  },
  {
    id: "rec-5",
    name: "Açaí Bowl",
    price: "9200",
    image: "/yogurt-bowl-berries.jpg",
    tag: "Promoción",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      return () => container.removeEventListener("scroll", checkScroll)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 160
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background pb-6">
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
        <h1 className="text-base font-normal text-accent mb-0.5">Elegí tu comida favorita</h1>
        <p className="text-accent/80 text-xs">Menú completo de desayunos, brunch y café specialty</p>
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

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5 px-6">
          <h2 className="text-sm font-semibold text-accent">Recomendados & Promociones</h2>
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
        <div ref={scrollContainerRef} className="flex gap-3 overflow-x-auto pb-2 px-6 scrollbar-hide scroll-smooth">
          {recommendedItems.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-36">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                <div className="absolute top-2 right-2 bg-accent/95 backdrop-blur-sm px-2  rounded-full py-1 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-primary">{item.tag}</span>
                </div>
              </div>
              <h3 className="font-medium text-xs text-accent mb-0.5">{item.name}</h3>
              <p className="text-xs text-accent font-bold">${item.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6">
        <h2 className="text-sm font-semibold text-accent mb-2.5">Categorías</h2>
         <div className="space-y-3">
    {menuCategories.map((c) => (
      <CategoryCard
        key={c.id}
        href={`/category/${c.id}`}
        name={c.name}
        itemCount={c.itemCount}
        image={c.image}
        variant="glass"
      />
    ))}
  </div>
      </div>
    </div>
  )
}
