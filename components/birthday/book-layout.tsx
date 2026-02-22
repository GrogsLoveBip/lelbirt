"use client"

import { useState, useCallback, useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
export interface BookSpread {
  leftLabel: string
  rightLabel: string
  left: ReactNode
  right: ReactNode
}

interface BookLayoutProps {
  spreads: BookSpread[]
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
export function BookLayout({ spreads }: BookLayoutProps) {
  const total = spreads.length
  const [current, setCurrent] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next")

  const go = useCallback(
    (dir: "next" | "prev") => {
      if (flipping) return
      const target = dir === "next" ? current + 1 : current - 1
      if (target < 0 || target >= total) return

      setFlipDir(dir)
      setFlipping(true)

      setTimeout(() => {
        setCurrent(target)
        setFlipping(false)
      }, 600)
    },
    [current, flipping, total],
  )

  const goNext = useCallback(() => go("next"), [go])
  const goPrev = useCallback(() => go("prev"), [go])

  const goTo = useCallback(
    (i: number) => {
      if (flipping || i === current) return
      setFlipDir(i > current ? "next" : "prev")
      setFlipping(true)
      setTimeout(() => {
        setCurrent(i)
        setFlipping(false)
      }, 600)
    },
    [current, flipping],
  )

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      else if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [goNext, goPrev])

  const spread = spreads[current]

  return (
    <div className="flex flex-col items-center w-full">
      {/* =================== Open Book =================== */}
      <div
        className="relative w-full max-w-5xl mx-auto"
        style={{ perspective: "2200px" }}
      >
        {/* Book body */}
        <div
          className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl"
          style={{
            background: "#fffbfc",
            boxShadow:
              "0 30px 70px rgba(180,100,140,0.14), 0 10px 30px rgba(180,100,140,0.08), 0 2px 8px rgba(180,100,140,0.06)",
            minHeight: "min(72vh, 620px)",
          }}
        >
          {/* ---- Book spine (center divider) ---- */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 z-30 pointer-events-none hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(160,100,130,0.06) 0%, rgba(160,100,130,0.12) 30%, rgba(120,80,100,0.18) 50%, rgba(160,100,130,0.12) 70%, rgba(160,100,130,0.06) 100%)",
            }}
          />
          {/* Spine stitch line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px z-30 pointer-events-none hidden md:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(160,100,130,0.25) 0px, rgba(160,100,130,0.25) 8px, transparent 8px, transparent 16px)",
            }}
          />

          {/* ---- Left edge shadow ---- */}
          <div
            className="absolute left-0 top-0 bottom-0 w-4 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(160,100,130,0.1) 0%, transparent 100%)",
            }}
          />
          {/* ---- Right edge shadow ---- */}
          <div
            className="absolute right-0 top-0 bottom-0 w-4 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(270deg, rgba(160,100,130,0.1) 0%, transparent 100%)",
            }}
          />

          {/* ---- Stacked page edges (bottom, subtle) ---- */}
          {total > 1 && (
            <>
              <div
                className="absolute left-3 right-3 -bottom-1 h-2 rounded-b-2xl z-0 hidden md:block"
                style={{ background: "rgba(220,180,195,0.12)" }}
              />
              <div
                className="absolute left-5 right-5 -bottom-2 h-2 rounded-b-2xl z-0 hidden md:block"
                style={{ background: "rgba(220,180,195,0.07)" }}
              />
              <div
                className="absolute left-7 right-7 -bottom-3 h-2 rounded-b-2xl z-0 hidden md:block"
                style={{ background: "rgba(220,180,195,0.04)" }}
              />
            </>
          )}

          {/* ---- Two-page spread ---- */}
          <div className="relative z-10 flex flex-col md:flex-row min-h-[min(72vh,620px)]">
            {/* LEFT PAGE */}
            <div
              className="flex-1 relative overflow-hidden md:border-r-0"
              style={{
                background:
                  "linear-gradient(135deg, #fffcfd 0%, #fef8fa 100%)",
              }}
            >
              {/* Page curl effect (top-left) */}
              <div
                className="absolute top-0 left-0 w-8 h-8 z-20 pointer-events-none hidden md:block"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(220,180,195,0.12) 0%, transparent 60%)",
                  borderRadius: "0 0 100% 0",
                }}
              />
              {/* Content */}
              <div className="h-full overflow-y-auto">{spread?.left}</div>
              {/* Left page number */}
              <div className="absolute bottom-3 left-4 z-20 flex items-center gap-1.5">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "rgba(180,120,150,0.4)" }}
                >
                  {spread?.leftLabel}
                </span>
                <span
                  className="text-[9px] font-medium"
                  style={{ color: "rgba(180,120,150,0.3)" }}
                >
                  {`${current * 2 + 1}`}
                </span>
              </div>
            </div>

            {/* Mobile divider */}
            <div
              className="md:hidden h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 10%, rgba(160,100,130,0.15) 50%, transparent 90%)",
              }}
            />

            {/* RIGHT PAGE */}
            <div
              className="flex-1 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(225deg, #fffcfd 0%, #fef8fa 100%)",
              }}
            >
              {/* Page curl effect (top-right) */}
              <div
                className="absolute top-0 right-0 w-8 h-8 z-20 pointer-events-none hidden md:block"
                style={{
                  background:
                    "linear-gradient(225deg, rgba(220,180,195,0.12) 0%, transparent 60%)",
                  borderRadius: "0 0 0 100%",
                }}
              />
              {/* Content */}
              <div className="h-full overflow-y-auto">{spread?.right}</div>
              {/* Right page number */}
              <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
                <span
                  className="text-[9px] font-medium"
                  style={{ color: "rgba(180,120,150,0.3)" }}
                >
                  {`${current * 2 + 2}`}
                </span>
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "rgba(180,120,150,0.4)" }}
                >
                  {spread?.rightLabel}
                </span>
              </div>
            </div>
          </div>

          {/* ---- Flip animation overlay ---- */}
          {flipping && (
            <div
              className="absolute inset-0 z-40 pointer-events-none"
              style={{
                animation:
                  flipDir === "next"
                    ? "spreadFlipNext 0.6s ease-out forwards"
                    : "spreadFlipPrev 0.6s ease-out forwards",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "rgba(255,251,252,0.85)",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* =================== Navigation =================== */}
      <div className="flex items-center justify-center gap-4 mt-5 px-4 w-full max-w-5xl">
        {/* Previous */}
        <button
          onClick={goPrev}
          disabled={current === 0 || flipping}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 12px rgba(180,100,140,0.1)",
            border: "1px solid rgba(220,160,190,0.2)",
          }}
          aria-label="Pagina anterior"
        >
          <ChevronLeft className="w-4.5 h-4.5 text-primary" />
        </button>

        {/* Spread dots */}
        <div className="flex items-center gap-1.5">
          {spreads.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 cursor-pointer rounded-full"
              aria-label={`Ir para paginas ${i * 2 + 1}-${i * 2 + 2}`}
              style={{
                width: i === current ? "20px" : "7px",
                height: "7px",
                background:
                  i === current
                    ? "linear-gradient(135deg, #d06090, #b060a0)"
                    : "rgba(208,96,144,0.2)",
                boxShadow:
                  i === current
                    ? "0 2px 8px rgba(200,80,140,0.3)"
                    : "none",
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={goNext}
          disabled={current === total - 1 || flipping}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
          style={{
            background:
              current === total - 1
                ? "rgba(255,255,255,0.9)"
                : "linear-gradient(135deg, #d06090, #b060a0)",
            boxShadow:
              current === total - 1
                ? "0 2px 12px rgba(180,100,140,0.1)"
                : "0 3px 14px rgba(200,80,140,0.3)",
            border: "1px solid rgba(220,160,190,0.2)",
          }}
          aria-label="Proxima pagina"
        >
          <ChevronRight
            className="w-4.5 h-4.5"
            style={{
              color: current === total - 1 ? "#d06090" : "#fff",
            }}
          />
        </button>
      </div>

      {/* Spread info */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-center text-xs text-muted-foreground">
          {`Paginas ${current * 2 + 1}-${current * 2 + 2} de ${total * 2}`}
        </p>
      </div>

      {/* =================== Keyframes =================== */}
      <style jsx>{`
        @keyframes spreadFlipNext {
          0% {
            opacity: 0;
            transform: translateX(40px) scaleX(0.95);
          }
          40% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateX(0) scaleX(1);
          }
        }
        @keyframes spreadFlipPrev {
          0% {
            opacity: 0;
            transform: translateX(-40px) scaleX(0.95);
          }
          40% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateX(0) scaleX(1);
          }
        }
      `}</style>
    </div>
  )
}
