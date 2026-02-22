"use client"

import { useState, useEffect, useRef } from "react"
import { Heart } from "lucide-react"

const MESSAGE = `Leleh, voce ilumina minha vida como as velinhas desse bolo. Cada risada sua e uma melodia que faz meu coracao dancar. Que seu sorriso continue sendo meu lugar favorito no mundo. Voce merece tudo de mais lindo que a vida pode oferecer, porque voce e, sem duvida, a pessoa mais incrivel que eu ja conheci. Feliz aniversario.`

export function TypewriterText() {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [started, setStarted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    /* Start typing on mount (when the page becomes active) */
    const timer = setTimeout(() => {
      setStarted(true)
      setIsTyping(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isTyping) return

    const interval = setInterval(() => {
      if (indexRef.current < MESSAGE.length) {
        setDisplayedText(MESSAGE.slice(0, indexRef.current + 1))
        indexRef.current += 1
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 35)

    return () => clearInterval(interval)
  }, [isTyping])

  return (
    <section ref={sectionRef} className="py-8 md:py-10 px-4 md:px-6 h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Decorative header */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-10 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg, transparent, #e0a0c0)" }} />
          <Heart className="w-4 h-4 text-primary fill-primary" />
          <div className="w-10 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg, #e0a0c0, transparent)" }} />
        </div>

        {/* Card container */}
        <div
          className="relative bg-card rounded-2xl p-6 md:p-8 flex-1"
          style={{
            boxShadow: "0 15px 40px rgba(200, 120, 160, 0.12)",
          }}
        >
          {/* Opening quote mark */}
          <span
            className="absolute top-4 left-6 font-serif text-6xl leading-none text-primary/20"
          >
            {"\u201C"}
          </span>

          {/* Text */}
          <p className="font-sans text-foreground text-base md:text-lg leading-relaxed relative z-10 pt-4">
            {displayedText}
            {isTyping && (
              <span
                className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
                style={{ animation: "blink 0.8s ease-in-out infinite" }}
              />
            )}
          </p>

          {/* Closing quote mark */}
          {!isTyping && displayedText.length === MESSAGE.length && (
            <span
              className="absolute bottom-4 right-6 font-serif text-6xl leading-none text-primary/20"
              style={{ animation: "fadeIn 0.5s ease-out forwards" }}
            >
              {"\u201D"}
            </span>
          )}
        </div>

        {/* Signature */}
        {!isTyping && displayedText.length === MESSAGE.length && (
          <div
            className="text-center mt-6"
            style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
          >
            <p className="font-serif text-2xl text-primary">{"Com todo meu amor"}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
