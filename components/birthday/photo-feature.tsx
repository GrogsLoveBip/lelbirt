"use client"

import { useState, useEffect, useRef } from "react"
import { Heart } from "lucide-react"
import Image from "next/image"

interface PhotoFeatureProps {
  src: string
  alt: string
  caption: string
  message: string
}

export function PhotoFeature({ src, alt, caption, message }: PhotoFeatureProps) {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-8 md:py-10 px-5 md:px-8 h-full flex flex-col items-center justify-center"
    >
      {/* Large featured photo */}
      <div
        className="relative mb-4 w-full max-w-[220px] md:max-w-[260px]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) rotate(-1deg)" : "translateY(30px) rotate(-3deg)",
          transition: "all 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.1s",
        }}
      >
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            background: "#fffbfc",
            padding: "8px 8px 40px 8px",
            boxShadow:
              "0 8px 30px rgba(180, 100, 140, 0.12), 0 4px 12px rgba(180, 100, 140, 0.06)",
          }}
        >
          {/* Tape decoration */}
          <div
            className="absolute -top-1 left-1/4 z-10"
            style={{
              width: "36px",
              height: "14px",
              background: "rgba(220, 180, 140, 0.3)",
              borderRadius: "0 0 3px 3px",
              transform: "rotate(-8deg)",
            }}
          />
          <div
            className="absolute -top-1 right-1/4 z-10"
            style={{
              width: "36px",
              height: "14px",
              background: "rgba(200, 180, 200, 0.25)",
              borderRadius: "0 0 3px 3px",
              transform: "rotate(5deg)",
            }}
          />

          <div className="relative aspect-[3/4] rounded overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 60vw, 260px"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(180,120,150,0.08) 100%)",
              }}
            />
          </div>

          {/* Caption on polaroid */}
          <div className="pt-2 text-center">
            <p className="font-serif text-xl md:text-2xl text-primary">
              {caption}
            </p>
          </div>
        </div>
      </div>

      {/* Message below */}
      <div
        className="text-center max-w-xs"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.8s ease-out 0.5s",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className="w-6 h-px rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #d0a0b0)" }}
          />
          <Heart className="w-3 h-3 text-primary fill-primary" style={{ opacity: 0.6 }} />
          <div
            className="w-6 h-px rounded-full"
            style={{ background: "linear-gradient(90deg, #d0a0b0, transparent)" }}
          />
        </div>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          {message}
        </p>
      </div>
    </section>
  )
}
