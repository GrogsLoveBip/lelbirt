"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, Sparkles } from "lucide-react"
import Image from "next/image"

const photos = [
  {
    src: "/images/photo-1.jpg",
    alt: "Uma rosa delicada representando voce",
    caption: "Voce",
    rotation: -4,
    accent: "#d06090",
  },
  {
    src: "/images/photo-2.jpg",
    alt: "Borboletas voando juntas",
    caption: "E",
    rotation: 2,
    accent: "#b060a0",
  },
  {
    src: "/images/photo-3.jpg",
    alt: "Estrelas formando um coracao",
    caption: "Muito",
    rotation: -2,
    accent: "#c88090",
  },
  {
    src: "/images/photo-4.jpg",
    alt: "Presente com coracao e confetes",
    caption: "Especial",
    rotation: 3,
    accent: "#d0709a",
  },
]

export function PhotoGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    /* Short delay so the slide-in animation finishes before staggered items pop in */
    const timer = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section ref={sectionRef} className="py-8 md:py-10 px-4 md:px-6 h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Section title */}
        <div className="text-center mb-6 md:mb-8">
          <div
            className="inline-flex items-center gap-2 mb-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.7s ease-out",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#d0a070" }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#c09080" }}
            >
              {"Momentos Especiais"}
            </span>
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#d0a070" }} />
          </div>
          <h3
            className="font-serif text-3xl md:text-4xl text-primary"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out 0.1s",
            }}
          >
            {"Voce E Muito Especial"}
          </h3>
          <div
            className="mt-3 w-16 h-0.5 mx-auto rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #e0a0c0, transparent)",
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease-out 0.4s",
            }}
          />
        </div>

        {/* Photos grid - polaroid style */}
        <div className="grid grid-cols-2 gap-4 md:gap-5 flex-1 content-start">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="group flex justify-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? `translateY(0) rotate(${photo.rotation}deg)`
                  : `translateY(50px) rotate(${photo.rotation + 5}deg)`,
                transition: `all 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${0.3 + index * 0.15}s`,
              }}
            >
              {/* Polaroid frame */}
              <div
                className="relative rounded-lg overflow-hidden transition-all duration-500 ease-out cursor-default group-hover:scale-105"
                style={{
                  background: "#fffbfc",
                  padding: "8px 8px 36px 8px",
                  boxShadow:
                    "0 4px 16px rgba(180, 100, 140, 0.1), 0 8px 24px rgba(180, 100, 140, 0.06)",
                  maxWidth: "180px",
                  width: "100%",
                }}
              >
                {/* Decorative tape on top */}
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 z-10"
                  style={{
                    width: "40px",
                    height: "14px",
                    background: "rgba(220, 180, 140, 0.35)",
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
                    sizes="(max-width: 768px) 50vw, 220px"
                  />

                  {/* Subtle vignette overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, transparent 60%, rgba(180, 120, 150, 0.08) 100%)",
                    }}
                  />

                  {/* Heart icon on hover */}
                  <div
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Heart
                      className="w-4 h-4 drop-shadow-sm"
                      style={{ color: photo.accent, fill: photo.accent }}
                    />
                  </div>
                </div>

                {/* Caption area - handwritten feel */}
                <div className="pt-2 text-center">
                  <p
                    className="font-serif text-lg md:text-xl"
                    style={{ color: photo.accent }}
                  >
                    {photo.caption}
                  </p>
                </div>

                {/* Subtle corner decoration */}
                <div
                  className="absolute bottom-2 left-2 w-3 h-3 opacity-20"
                  style={{
                    borderLeft: `1.5px solid ${photo.accent}`,
                    borderBottom: `1.5px solid ${photo.accent}`,
                    borderRadius: "0 0 0 3px",
                  }}
                />
                <div
                  className="absolute bottom-2 right-2 w-3 h-3 opacity-20"
                  style={{
                    borderRight: `1.5px solid ${photo.accent}`,
                    borderBottom: `1.5px solid ${photo.accent}`,
                    borderRadius: "0 0 3px 0",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Read-together phrase below the grid */}
        <p
          className="text-center mt-4 text-muted-foreground text-xs font-medium tracking-wide"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease-out 1.2s",
          }}
        >
          {"Leia as legendas juntas"}
        </p>
      </div>
    </section>
  )
}
