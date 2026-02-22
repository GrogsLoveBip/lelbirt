"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, Sparkles } from "lucide-react"
import Image from "next/image"

interface MemoriesGalleryProps {
  title?: string
  subtitle?: string
  photos: {
    src: string
    alt: string
    caption: string
    rotation: number
    accent: string
  }[]
}

export function MemoriesGallery({
  title = "Momentos Nossos",
  subtitle = "Cada momento com voce e um tesouro",
  photos,
}: MemoriesGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-8 md:py-10 px-4 md:px-6 h-full flex flex-col"
    >
      <div className="flex-1 flex flex-col">
        {/* Section title */}
        <div className="text-center mb-5 md:mb-6">
          <div
            className="inline-flex items-center gap-2 mb-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.7s ease-out",
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: "#d0a070" }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#c09080" }}
            >
              {subtitle}
            </span>
            <Sparkles className="w-3 h-3" style={{ color: "#d0a070" }} />
          </div>
          <h3
            className="font-serif text-2xl md:text-3xl text-primary"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.8s ease-out 0.1s",
            }}
          >
            {title}
          </h3>
          <div
            className="mt-2 w-12 h-0.5 mx-auto rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #e0a0c0, transparent)",
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease-out 0.4s",
            }}
          />
        </div>

        {/* Photos - 2x2 compact grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 flex-1 content-center">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="group flex justify-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? `translateY(0) rotate(${photo.rotation}deg)`
                  : `translateY(40px) rotate(${photo.rotation + 4}deg)`,
                transition: `all 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${0.25 + index * 0.12}s`,
              }}
            >
              <div
                className="relative rounded-lg overflow-hidden transition-all duration-500 ease-out cursor-default group-hover:scale-105"
                style={{
                  background: "#fffbfc",
                  padding: "6px 6px 28px 6px",
                  boxShadow:
                    "0 3px 12px rgba(180, 100, 140, 0.1), 0 6px 18px rgba(180, 100, 140, 0.05)",
                  maxWidth: "160px",
                  width: "100%",
                }}
              >
                {/* Tape */}
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 z-10"
                  style={{
                    width: "32px",
                    height: "12px",
                    background: "rgba(220, 180, 140, 0.3)",
                    borderRadius: "0 0 3px 3px",
                  }}
                />

                {/* Image */}
                <div className="relative aspect-[4/5] rounded overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 45vw, 160px"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, transparent 60%, rgba(180,120,150,0.06) 100%)",
                    }}
                  />
                  <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart
                      className="w-3.5 h-3.5 drop-shadow-sm"
                      style={{ color: photo.accent, fill: photo.accent }}
                    />
                  </div>
                </div>

                {/* Caption */}
                <div className="pt-1.5 text-center">
                  <p
                    className="font-serif text-base md:text-lg"
                    style={{ color: photo.accent }}
                  >
                    {photo.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
