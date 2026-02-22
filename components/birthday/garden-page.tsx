"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Sparkles } from "lucide-react"
import Image from "next/image"

export function GardenPage() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-8 md:py-10 px-5 md:px-8 h-full flex flex-col items-center justify-center text-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(240,200,220,0.06) 0%, transparent 65%)",
      }}
    >
      {/* Decorative top */}
      <div
        className="flex items-center gap-2 mb-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.7s ease-out",
        }}
      >
        <div
          className="w-8 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #d4a0c0)" }}
        />
        <Sparkles className="w-3.5 h-3.5" style={{ color: "#d0a080" }} />
        <div
          className="w-8 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, #d4a0c0, transparent)" }}
        />
      </div>

      {/* Illustration */}
      <div
        className="relative w-full max-w-[200px] md:max-w-[240px] mb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(15px) scale(0.95)",
          transition: "all 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.15s",
        }}
      >
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            boxShadow:
              "0 10px 35px rgba(180,100,140,0.12), 0 4px 14px rgba(180,100,140,0.06)",
            border: "1px solid rgba(220,160,190,0.12)",
          }}
        >
          <div className="relative aspect-square">
            <Image
              src="/images/romantic-garden.jpg"
              alt="Ilustracao de um jardim encantado com rosas"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 55vw, 240px"
            />
            {/* Soft vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(254,248,250,0.2) 100%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Quote */}
      <blockquote
        className="max-w-xs md:max-w-sm mb-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.8s ease-out 0.4s",
        }}
      >
        <p
          className="font-serif text-lg md:text-xl text-foreground leading-relaxed"
          style={{ lineHeight: "1.7" }}
        >
          {"\u201CVoce e o jardim mais bonito que a vida me deu para cuidar, e cada dia ao seu lado e uma flor nova que desabrocha no meu coracao.\u201D"}
        </p>
      </blockquote>

      {/* Divider */}
      <div
        className="flex items-center gap-2 mb-3"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.6s",
        }}
      >
        <div
          className="w-6 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #d0a0b0)" }}
        />
        <Heart
          className="w-3 h-3 fill-current"
          style={{
            color: "#d06090",
            animation: "gardenPulse 3s ease-in-out infinite",
          }}
        />
        <div
          className="w-6 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, #d0a0b0, transparent)" }}
        />
      </div>

      {/* Personal note */}
      <div
        className="relative max-w-[250px] md:max-w-xs"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.8s ease-out 0.7s",
        }}
      >
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(255,252,253,0.7)",
            boxShadow: "0 4px 16px rgba(200,120,160,0.06)",
            border: "1px solid rgba(220,160,190,0.1)",
          }}
        >
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            {"Leleh, voce e a prova de que existem pessoas que fazem o mundo girar com mais leveza. Que este novo ano da sua vida seja cheio de flores, risos e momentos que mereca guardar para sempre."}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gardenPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </section>
  )
}
