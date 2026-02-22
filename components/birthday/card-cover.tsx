"use client"

import { useState, useEffect } from "react"
import { Heart, BookOpen, Sparkles } from "lucide-react"
import Image from "next/image"

interface CardCoverProps {
  onOpen: () => void
}

export function CardCover({ onOpen }: CardCoverProps) {
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: number; y: number; delay: number; size: number }>
  >([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const newSparkles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      size: 2 + Math.random() * 3,
    }))
    setSparkles(newSparkles)
    const t = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-8">
      {/* Background sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: "rgba(220,160,190,0.6)",
            animation: `sparkle 3.5s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "8%", w: 16, dur: 7.2 },
          { left: "18%", w: 22, dur: 8.5 },
          { left: "30%", w: 18, dur: 6.8 },
          { left: "42%", w: 26, dur: 9.1 },
          { left: "54%", w: 15, dur: 7.6 },
          { left: "66%", w: 20, dur: 8.0 },
          { left: "78%", w: 24, dur: 6.4 },
          { left: "90%", w: 17, dur: 9.5 },
          { left: "14%", w: 13, dur: 10.2 },
          { left: "74%", w: 14, dur: 8.8 },
        ].map((heart, i) => (
          <Heart
            key={i}
            className="absolute text-primary/15 fill-primary/10"
            style={{
              left: heart.left,
              bottom: "-20px",
              width: `${heart.w}px`,
              height: `${heart.w}px`,
              animation: `floatUp ${heart.dur}s ease-in-out ${i * 0.6}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Main cover card */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
          transition: "all 1s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            boxShadow:
              "0 30px 80px rgba(200, 120, 160, 0.2), 0 10px 30px rgba(200, 120, 160, 0.12), 0 0 0 1px rgba(220,160,190,0.1)",
          }}
        >
          {/* Floral background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/cover-floral.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 450px"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,252,253,0.88) 0%, rgba(255,248,250,0.92) 40%, rgba(255,252,253,0.88) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 p-8 md:p-12 text-center">
            {/* Decorative top icon */}
            <div
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #f0a0c0, #d4a0d0, #c8a890)",
                boxShadow: "0 6px 20px rgba(200,120,160,0.25)",
                animation: "coverPulse 3s ease-in-out infinite",
              }}
            >
              <Heart className="w-8 h-8 text-card fill-card" />
            </div>

            {/* Ornamental line */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <div
                className="w-12 h-px rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, #d4a0c0)" }}
              />
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#d0a080" }} />
              <div
                className="w-12 h-px rounded-full"
                style={{ background: "linear-gradient(90deg, #d4a0c0, transparent)" }}
              />
            </div>

            {/* Heading */}
            <h1
              className="font-serif text-5xl md:text-6xl text-primary mb-3 leading-tight text-balance"
              style={{
                textShadow: "0 2px 12px rgba(200, 120, 160, 0.15)",
                animation: "fadeInDown 1s ease-out 0.2s both",
              }}
            >
              {"Feliz Aniversario,"}
            </h1>
            <h2
              className="font-serif text-6xl md:text-7xl mb-4"
              style={{
                background:
                  "linear-gradient(135deg, #d06090, #b060a0, #c88060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "fadeInDown 1s ease-out 0.4s both",
              }}
            >
              {"Leleh"}
            </h2>

            {/* Animated heart beat */}
            <div
              className="flex justify-center mb-4"
              style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}
            >
              <div className="flex items-center gap-1">
                {[12, 16, 20, 16, 12].map((size, i) => (
                  <Heart
                    key={i}
                    className="text-primary fill-primary"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      opacity: 0.3 + (i === 2 ? 0.7 : i === 1 || i === 3 ? 0.4 : 0),
                      animation: `coverHeartBounce 2s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Subtitle */}
            <p
              className="text-muted-foreground text-base md:text-lg mb-3 leading-relaxed"
              style={{ animation: "fadeInUp 0.8s ease-out 0.7s both" }}
            >
              {"Preparei algo muito especial para voce..."}
            </p>

            {/* Small poetic line */}
            <p
              className="font-serif text-sm md:text-base mb-8"
              style={{
                color: "rgba(180,120,150,0.7)",
                animation: "fadeInUp 0.8s ease-out 0.85s both",
              }}
            >
              {"Um livro feito de amor, memorias e poesia"}
            </p>

            {/* Open button */}
            <button
              onClick={onOpen}
              className="relative group cursor-pointer px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #d06090, #b060a0)",
                color: "#fff",
                boxShadow:
                  "0 8px 30px rgba(200, 80, 140, 0.35), 0 2px 8px rgba(200, 80, 140, 0.2)",
                animation: "fadeInUp 0.8s ease-out 1s both",
              }}
            >
              <span className="relative z-10 flex items-center gap-2.5 justify-center">
                <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
                {"Abrir o Livro"}
              </span>
            </button>

            {/* Bottom ornament */}
            <div
              className="mt-8 flex items-center justify-center gap-2"
              style={{ animation: "fadeInUp 0.8s ease-out 1.1s both" }}
            >
              <div
                className="w-16 h-px rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, #e0a0c0)" }}
              />
              <Heart
                className="w-3 h-3 text-primary fill-primary"
                style={{ opacity: 0.4 }}
              />
              <div
                className="w-16 h-px rounded-full"
                style={{ background: "linear-gradient(90deg, #e0a0c0, transparent)" }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.7; transform: scale(1); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes coverPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 6px 20px rgba(200,120,160,0.25); }
          50% { transform: scale(1.08); box-shadow: 0 8px 30px rgba(200,120,160,0.35); }
        }
        @keyframes coverHeartBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  )
}
