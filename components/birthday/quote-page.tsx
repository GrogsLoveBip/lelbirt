"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Quote } from "lucide-react"

interface QuotePageProps {
  quote: string
  author: string
  reflection?: string
}

export function QuotePage({ quote, author, reflection }: QuotePageProps) {
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
      {/* Large decorative quote mark */}
      <div
        style={{
          opacity: visible ? 0.12 : 0,
          transition: "opacity 1s ease-out",
        }}
      >
        <Quote
          className="w-16 h-16 md:w-20 md:h-20 mb-2"
          style={{ color: "#d06090" }}
        />
      </div>

      {/* Quote text */}
      <blockquote
        className="text-center max-w-xs md:max-w-sm mb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(15px)",
          transition: "all 0.9s ease-out 0.2s",
        }}
      >
        <p className="font-serif text-lg md:text-xl text-foreground leading-relaxed">
          {`\u201C${quote}\u201D`}
        </p>
      </blockquote>

      {/* Author */}
      <div
        className="flex items-center gap-2 mb-5"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.5s",
        }}
      >
        <div
          className="w-6 h-px rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #d0a0b0)",
          }}
        />
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {author}
        </p>
        <div
          className="w-6 h-px rounded-full"
          style={{
            background: "linear-gradient(90deg, #d0a0b0, transparent)",
          }}
        />
      </div>

      {/* Reflection text */}
      {reflection && (
        <div
          className="relative max-w-xs md:max-w-sm"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.9s ease-out 0.7s",
          }}
        >
          <div
            className="bg-card rounded-xl p-4"
            style={{
              boxShadow: "0 6px 20px rgba(200,120,160,0.08)",
              border: "1px solid rgba(220,160,190,0.12)",
            }}
          >
            <Heart
              className="w-3 h-3 text-primary fill-primary mx-auto mb-2"
              style={{ opacity: 0.5 }}
            />
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-center">
              {reflection}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
