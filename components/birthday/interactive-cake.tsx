"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface InteractiveCakeProps {
  onAllCandlesBlown: () => void
}

const NUM_CANDLES = 5

export function InteractiveCake({ onAllCandlesBlown }: InteractiveCakeProps) {
  const [litCandles, setLitCandles] = useState<boolean[]>(Array(NUM_CANDLES).fill(true))
  const [showWish, setShowWish] = useState(false)
  const [allBlown, setAllBlown] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(timer)
  }, [])

  const blowCandle = useCallback((index: number) => {
    if (!litCandles[index]) return

    setLitCandles((prev) => {
      const newState = [...prev]
      newState[index] = false
      return newState
    })
    setShowWish(true)
    setTimeout(() => setShowWish(false), 2000)
  }, [litCandles])

  useEffect(() => {
    if (litCandles.every((c) => !c) && !allBlown) {
      setAllBlown(true)
      setTimeout(() => {
        onAllCandlesBlown()
      }, 500)
    }
  }, [litCandles, allBlown, onAllCandlesBlown])

  const candlePositions = [
    { left: "25%", height: 44 },
    { left: "37%", height: 48 },
    { left: "50%", height: 52 },
    { left: "63%", height: 48 },
    { left: "75%", height: 44 },
  ]

  return (
    <section ref={sectionRef} className="py-8 md:py-10 px-4 md:px-6 h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center text-center">
        {/* Title */}
        <h3
          className="font-serif text-3xl md:text-4xl text-primary mb-2"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out",
          }}
        >
          {"Sopre as Velinhas!"}
        </h3>
        <p
          className="text-muted-foreground mb-6 text-sm"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.3s",
          }}
        >
          {"Toque em cada velinha para apagar"}
        </p>

        {/* Cake container */}
        <div
          className="relative mx-auto"
          style={{
            width: "280px",
            height: "280px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease-out 0.4s",
          }}
        >
          {/* Candles */}
          {candlePositions.map((pos, i) => (
            <div
              key={i}
              className="absolute cursor-pointer group"
              style={{
                left: pos.left,
                bottom: "170px",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
              onClick={() => blowCandle(i)}
              role="button"
              aria-label={`Velinha ${i + 1}${litCandles[i] ? " - clique para apagar" : " - apagada"}`}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") blowCandle(i) }}
            >
              {/* Candle body */}
              <div
                className="relative mx-auto rounded-sm transition-transform group-hover:scale-110"
                style={{
                  width: "10px",
                  height: `${pos.height}px`,
                  background: `linear-gradient(180deg, ${i % 2 === 0 ? "#f0a0c0" : "#c8a0d0"}, ${i % 2 === 0 ? "#e080a0" : "#b080c0"})`,
                }}
              >
                {/* Wick */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 rounded-full"
                  style={{ background: "#666" }}
                />

                {/* Flame */}
                {litCandles[i] && (
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2"
                    style={{ animation: "flicker 0.3s ease-in-out infinite alternate" }}
                  >
                    {/* Outer flame */}
                    <div
                      className="rounded-full"
                      style={{
                        width: "12px",
                        height: "18px",
                        background: "radial-gradient(ellipse at bottom, #ffdd44, #ff8800, #ff4400)",
                        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                        filter: "blur(0.5px)",
                      }}
                    />
                    {/* Inner flame */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        width: "6px",
                        height: "10px",
                        background: "radial-gradient(ellipse at bottom, #ffffcc, #ffee88)",
                        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                      }}
                    />
                    {/* Glow */}
                    <div
                      className="absolute -inset-3 rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(255,200,50,0.3), transparent)",
                        filter: "blur(4px)",
                      }}
                    />
                  </div>
                )}

                {/* Smoke when blown */}
                {!litCandles[i] && (
                  <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                    style={{ animation: "smokeRise 1.5s ease-out forwards" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "rgba(180,180,180,0.4)", filter: "blur(2px)" }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Cake - Top layer */}
          <div
            className="absolute rounded-xl"
            style={{
              left: "15%",
              right: "15%",
              bottom: "120px",
              height: "55px",
              background: "linear-gradient(180deg, #f8c8d8, #f0b0c8)",
              borderRadius: "12px 12px 0 0",
              boxShadow: "inset 0 4px 8px rgba(255,255,255,0.3)",
            }}
          >
            {/* Frosting drip */}
            <div className="absolute -top-1 left-0 right-0 h-3 flex justify-around overflow-hidden">
              {[14, 18, 12, 16, 19, 11, 17, 13].map((h, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: "20px",
                    height: `${h}px`,
                    background: "#fff0f5",
                    borderRadius: "0 0 50% 50%",
                  }}
                />
              ))}
            </div>
            {/* Decoration dots */}
            <div className="absolute top-6 left-0 right-0 flex justify-around px-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: i % 2 === 0 ? "#c8a0d0" : "#f0c080" }}
                />
              ))}
            </div>
          </div>

          {/* Cake - Bottom layer */}
          <div
            className="absolute rounded-xl"
            style={{
              left: "8%",
              right: "8%",
              bottom: "60px",
              height: "65px",
              background: "linear-gradient(180deg, #e8a0c0, #d890b0)",
              boxShadow: "inset 0 4px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(200,120,160,0.2)",
            }}
          >
            {/* Frosting drip */}
            <div className="absolute -top-1 left-0 right-0 h-4 flex justify-around overflow-hidden">
              {[16, 22, 14, 20, 18, 23, 15, 21, 17, 19].map((h, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: "22px",
                    height: `${h}px`,
                    background: "#f8d0e0",
                    borderRadius: "0 0 50% 50%",
                  }}
                />
              ))}
            </div>
            {/* Heart decorations */}
            <div className="absolute top-7 left-0 right-0 flex justify-around px-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="text-xs" style={{ color: "#c070a0" }}>
                  {"*"}
                </span>
              ))}
            </div>
          </div>

          {/* Plate */}
          <div
            className="absolute rounded-full"
            style={{
              left: "2%",
              right: "2%",
              bottom: "45px",
              height: "20px",
              background: "linear-gradient(180deg, #faf0f0, #e8e0e0)",
              borderRadius: "50%",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            }}
          />
        </div>

        {/* Wish message */}
        <div
          className="h-12 flex items-center justify-center mt-4"
          style={{
            opacity: showWish && !allBlown ? 1 : 0,
            transform: showWish && !allBlown ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.4s ease-out",
          }}
        >
          <p className="font-serif text-2xl text-primary">
            {"Faca um pedido, Leleh"}
          </p>
        </div>

        {/* All blown message */}
        {allBlown && (
          <div
            className="mt-4"
            style={{ animation: "fadeInUp 0.6s ease-out forwards" }}
          >
            <p className="font-serif text-3xl text-primary mb-2">
              {"Parabens, Leleh!"}
            </p>
            <p className="text-muted-foreground text-base">
              {"Que todos os seus desejos se realizem!"}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes flicker {
          0% { transform: scaleY(1) scaleX(1) translateX(-50%); }
          100% { transform: scaleY(1.1) scaleX(0.9) translateX(-50%); }
        }
        @keyframes smokeRise {
          0% { opacity: 0.6; transform: translateY(0) scale(1) translateX(-50%); }
          100% { opacity: 0; transform: translateY(-20px) scale(2) translateX(-50%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
