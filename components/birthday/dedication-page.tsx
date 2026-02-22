"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Sparkles } from "lucide-react"

export function DedicationPage() {
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
          "radial-gradient(ellipse at 50% 30%, rgba(240,180,210,0.08) 0%, transparent 60%)",
      }}
    >
      {/* Decorative top ornament */}
      <div
        className="flex items-center gap-2 mb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-15px)",
          transition: "all 0.8s ease-out",
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

      {/* Main title */}
      <h3
        className="font-serif text-4xl md:text-5xl text-primary mb-3 text-balance"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(15px)",
          transition: "all 0.9s ease-out 0.15s",
          textShadow: "0 2px 12px rgba(200,120,160,0.12)",
        }}
      >
        {"Para a pessoa mais especial do mundo"}
      </h3>

      {/* Divider */}
      <div
        className="w-20 h-0.5 mx-auto rounded-full mb-5"
        style={{
          background:
            "linear-gradient(90deg, transparent, #e0a0c0, transparent)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease-out 0.4s",
        }}
      />

      {/* Dedication text */}
      <p
        className="font-sans text-foreground text-sm md:text-base leading-relaxed max-w-xs md:max-w-sm mb-5"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.9s ease-out 0.5s",
        }}
      >
        {"Este livro foi feito com todo o carinho do meu coracao, para que voce sinta, em cada pagina, o quanto e amada e o quanto ilumina minha vida."}
      </p>

      {/* Heart ornament */}
      <div
        className="flex items-center gap-3 mb-5"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease-out 0.7s",
        }}
      >
        <div
          className="w-10 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #e0a0c0)" }}
        />
        <Heart
          className="w-5 h-5 text-primary fill-primary"
          style={{ animation: "dedicationPulse 2.5s ease-in-out infinite" }}
        />
        <div
          className="w-10 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, #e0a0c0, transparent)" }}
        />
      </div>

      {/* Subtitle */}
      <p
        className="font-serif text-xl md:text-2xl text-primary"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.9s ease-out 0.8s",
        }}
      >
        {"Com todo meu amor, para voce, Leleh"}
      </p>

      <style jsx>{`
        @keyframes dedicationPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
      `}</style>
    </section>
  )
}
