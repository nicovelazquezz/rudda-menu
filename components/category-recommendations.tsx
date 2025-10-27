"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

interface Recommendation {
  name: string
  image: string
  tag: string
}

interface CategoryRecommendationsProps {
  recommendations: Recommendation[]
  categoryName: string
}

export function CategoryRecommendations({ recommendations, categoryName }: CategoryRecommendationsProps) {
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
    <div className="px-6 py-5 border-b border-primary-foreground/10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-primary-foreground">Recomendados de {categoryName}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-lg bg-primary-foreground/10 border border-primary-foreground/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-foreground/20 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-3 w-3 text-primary-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-1.5 rounded-lg bg-primary-foreground/10 border border-primary-foreground/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-foreground/20 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-3 w-3 text-primary-foreground" />
          </button>
        </div>
      </div>
      <div ref={scrollContainerRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth -mx-6 px-6">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="flex-shrink-0 w-32">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
              <Image src={rec.image || "/placeholder.svg"} alt={rec.name} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-accent/95 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <span className="text-[10px] font-semibold text-primary">{rec.tag}</span>
              </div>
            </div>
            <h3 className="font-medium text-xs text-primary-foreground">{rec.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
