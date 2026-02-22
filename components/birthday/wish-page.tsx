"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Star } from "lucide-react"

interface Wish {
  text: string
  icon: "heart" | "star"
}

interface WishPageProps {
  title?: string
  wishes: Wish[]
}

export function WishPage({
  title = "Meus Desejos Para Voce",
  wishes,
}: WishPageProps) {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-8 md:py-10 px-5 md:px-8 h-full flex flex-col"
    >
      {/* Title */}
      <div className="text-center mb-5">
        <h3
          className="font-serif text-2xl md:text-3xl text-primary mb-2"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.8s ease-out",
          }}
        >
          {title}
        </h3>
        <div
          className="w-14 h-0.5 mx-auto rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #e0a0c0, transparent)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.2s",
          }}
        />
      </div>

      {/* Wishes list */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        {wishes.map((wish, i) => (
          <div
            key={i}
            className="flex items-start gap-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-15px)",
              transition: `all 0.6s ease-out ${0.3 + i * 0.12}s`,
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background:
                  wish.icon === "heart"
                    ? "linear-gradient(135deg, rgba(208,96,144,0.12), rgba(176,96,160,0.12))"
                    : "linear-gradient(135deg, rgba(208,160,112,0.12), rgba(200,128,144,0.12))",
              }}
            >
              {wish.icon === "heart" ? (
                <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
              ) : (
                <Star
                  className="w-3.5 h-3.5 fill-current"
                  style={{ color: "#d0a070" }}
                />
              )}
            </div>
            <p className="text-xs md:text-sm text-foreground leading-relaxed pt-1">
              {wish.text}
            </p>
          </div>
        ))}
      </div>

      {/* Footer ornament */}
      <div
        className="flex items-center justify-center gap-2 mt-4"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease-out 1.2s",
        }}
      >
        <div
          className="w-8 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #d0a0b080)" }}
        />
        <Heart className="w-2.5 h-2.5 text-primary fill-primary" style={{ opacity: 0.4 }} />
        <div
          className="w-8 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, #d0a0b080, transparent)" }}
        />
      </div>
    </section>
  )
}
