"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Promocion {
  id: string;
  nombre: string;
  imagen: string;
  activo: string;
}

export default function ModalPromos() {
  const [isOpen, setIsOpen] = useState(false);
  const [promos, setPromos] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    // @ts-ignore
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/obtener_promos.php`);
        console.log("Promociones obtenidas:", response.data);

        if (Array.isArray(response.data)) {
          // Filtrar solo promociones activas
          const promosActivas = response.data.filter((p) => p.activo === "1");
          setPromos(promosActivas);

          // Abrir modal solo si hay promociones activas
          if (promosActivas.length > 0) {
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error("Error al obtener promociones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (loading || promos.length === 0) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#d9cebe] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[#c4b8a8]">
          <h2 className="text-xl font-display font-bold text-black">
            ¡Bienvenido a Rudda Coffee Club!
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-[#c4b8a8] rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {promos.map((promo) => (
                <div key={promo.id} className="flex-[0_0_100%] min-w-0 relative">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={promo.imagen}
                      alt={promo.nombre}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Título de la promo sobre la imagen */}

                </div>
              ))}
            </div>
          </div>

          {/* Controles de navegación */}
          {promos.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 text-black" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>
            </>
          )}

          {/* Indicadores de dots */}
          {promos.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {promos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors"
                  aria-label={`Ir a promoción ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer opcional */}
        <div className="p-4 text-center border-t-2 border-[#c4b8a8]">
          <p className="text-sm text-black/70">
            Válidas hasta agotar stock • Consultá condiciones
          </p>
        </div>
      </div>
    </div>
  );
}