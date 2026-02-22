"use client"

import { useState, useRef, useEffect } from "react"
import { Heart } from "lucide-react"

export function FinalSurprise() {
  const [revealed, setRevealed] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; size: number; delay: number; duration: number; color: string }>>([])
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(timer)
  }, [])

  const handleReveal = () => {
    setRevealed(true)
    // Generate floating hearts
    const HEART_COLORS = ["#d06090", "#e080a0", "#c070a0", "#b060a0", "#e0a0c0", "#c88090"]
    const newHearts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 20,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      color: HEART_COLORS[i % HEART_COLORS.length],
    }))
    setHearts(newHearts)
  }

  return (
    <section ref={sectionRef} className="py-8 md:py-10 px-4 md:px-6 relative overflow-hidden h-full flex flex-col">
      {/* Floating hearts */}
      {revealed && hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="absolute z-20 fill-current"
          style={{
            left: `${heart.x}%`,
            bottom: "-30px",
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            color: heart.color,
            animation: `heartFloat ${heart.duration}s ease-out ${heart.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}

      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
        {!revealed ? (
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out",
            }}
          >
            <h3 className="font-serif text-3xl md:text-4xl text-primary mb-5">
              {"Tem mais uma coisinha..."}
            </h3>
            <button
              onClick={handleReveal}
              className="relative group cursor-pointer px-8 py-4 rounded-full text-card font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #d06090, #b060a0)",
                boxShadow: "0 8px 25px rgba(200, 80, 140, 0.3)",
              }}
            >
              <span className="flex items-center gap-2">
                {"Clique para uma surpresa"}
                <Heart className="w-5 h-5 fill-card transition-transform group-hover:scale-125" />
              </span>
            </button>
          </div>
        ) : (
          <div style={{ animation: "revealIn 0.8s ease-out forwards" }}>
              <div
                className="bg-card rounded-2xl p-6 md:p-8"
                style={{
                  boxShadow: "0 15px 40px rgba(200, 120, 160, 0.15)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #f0a0c0, #d4a0d0)",
                  animation: "heartPulse 1.5s ease-in-out infinite",
                }}
              >
                <Heart className="w-8 h-8 text-card fill-card" />
              </div>

              <h3 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                {"Voce e meu presente"}
              </h3>

              <p className="text-foreground text-sm md:text-base leading-relaxed mb-4">
                {"Ter voce na minha vida e o maior presente que eu poderia ter. Obrigada por ser quem voce e, por existir e por ser a melhor amiga que alguem poderia sonhar. Nenhuma palavra e suficiente para expressar o quanto voce e importante pra mim."}
              </p>

              <div className="flex items-center justify-center gap-1.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className="text-primary fill-primary"
                    style={{
                      width: `${14 + i * 2}px`,
                      height: `${14 + i * 2}px`,
                      animation: `heartBounce 0.6s ease-out ${i * 0.1}s both`,
                    }}
                  />
                ))}
                {Array.from({ length: 4 }).map((_, i) => (
                  <Heart
                    key={i + 5}
                    className="text-primary fill-primary"
                    style={{
                      width: `${22 - i * 2}px`,
                      height: `${22 - i * 2}px`,
                      animation: `heartBounce 0.6s ease-out ${(5 + i) * 0.1}s both`,
                    }}
                  />
                ))}
              </div>

              <p className="font-serif text-2xl text-primary mt-3">
                {"Feliz Aniversario, Leleh!"}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes heartFloat {
          0% { opacity: 0; transform: translateY(0) scale(0) rotate(0deg); }
          10% { opacity: 1; transform: translateY(-20px) scale(1) rotate(-10deg); }
          90% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-100vh) scale(0.5) rotate(20deg); }
        }
        @keyframes revealIn {
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes heartBounce {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  )
}
