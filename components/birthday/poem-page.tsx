"use client"

import { useState, useEffect, useRef } from "react"
import { Heart } from "lucide-react"

interface PoemPageProps {
  title: string
  stanzas: string[][]
  author?: string
  accentColor?: string
}

export function PoemPage({
  title,
  stanzas,
  author,
  accentColor = "#d06090",
}: PoemPageProps) {
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
      {/* Title area */}
      <div className="text-center mb-5">
        {/* Ornamental top */}
        <div
          className="flex items-center justify-center gap-2 mb-3"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
        >
          <div
            className="w-6 h-px rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor})`,
            }}
          />
          <Heart
            className="w-3 h-3 fill-current"
            style={{ color: accentColor }}
          />
          <div
            className="w-6 h-px rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            }}
          />
        </div>

        <h3
          className="font-serif text-2xl md:text-3xl text-primary"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.8s ease-out 0.1s",
          }}
        >
          {title}
        </h3>

        <div
          className="mt-2 w-12 h-0.5 mx-auto rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.3s",
          }}
        />
      </div>

      {/* Stanzas */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {stanzas.map((stanza, stanzaIdx) => (
          <div
            key={stanzaIdx}
            className="text-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: `all 0.7s ease-out ${0.3 + stanzaIdx * 0.2}s`,
            }}
          >
            {stanza.map((line, lineIdx) => (
              <p
                key={lineIdx}
                className="font-serif text-foreground text-sm md:text-base leading-relaxed"
                style={{ lineHeight: "1.8" }}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Author / footer */}
      {author && (
        <div
          className="text-center mt-4 pt-3"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease-out 1s",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className="w-8 h-px rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}40)`,
              }}
            />
            <Heart
              className="w-2.5 h-2.5 fill-current"
              style={{ color: `${accentColor}60` }}
            />
            <div
              className="w-8 h-px rounded-full"
              style={{
                background: `linear-gradient(90deg, ${accentColor}40, transparent)`,
              }}
            />
          </div>
          <p
            className="text-xs font-medium italic"
            style={{ color: `${accentColor}90` }}
          >
            {author}
          </p>
        </div>
      )}
    </section>
  )
}
