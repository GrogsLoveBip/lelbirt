"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Heart, X, Feather } from "lucide-react"
import Image from "next/image"

/* ------------------------------------------------------------------ */
/*  Poetry cards hidden within the bouquet                              */
/* ------------------------------------------------------------------ */
interface HiddenCard {
  id: number
  /** Position relative to the bouquet container (%) */
  top: string
  left: string
  poem: string[]
  title: string
  delay: number
}

const HIDDEN_CARDS: HiddenCard[] = [
  {
    id: 1,
    top: "18%",
    left: "22%",
    title: "Flor da Alma",
    poem: [
      "Entre petalas de rosa,",
      "Guardo o teu sorriso.",
      "Es a flor mais preciosa",
      "Do meu jardim mais lindo.",
    ],
    delay: 0.6,
  },
  {
    id: 2,
    top: "35%",
    left: "68%",
    title: "Promessa",
    poem: [
      "Cada petala que cai,",
      "Leva um segredo meu.",
      "De que nunca, nunca mais,",
      "Solto a mao que Deus me deu.",
    ],
    delay: 0.9,
  },
  {
    id: 3,
    top: "58%",
    left: "30%",
    title: "Eterna",
    poem: [
      "Se as flores um dia secarem,",
      "Se o sol resolver se esconder,",
      "Meu amor por ti e eterno,",
      "E renasce a cada amanhecer.",
    ],
    delay: 1.2,
  },
  {
    id: 4,
    top: "72%",
    left: "62%",
    title: "Luz",
    poem: [
      "Voce e a luz que me guia,",
      "Mesmo na noite mais fria.",
      "Uma estrela em forma de gente,",
      "Que aquece tudo ao redor.",
    ],
    delay: 1.5,
  },
  {
    id: 5,
    top: "44%",
    left: "46%",
    title: "Coracao",
    poem: [
      "Se eu pudesse te dar o mundo,",
      "Daria sem pestanejar.",
      "Mas te dou meu coracao inteiro,",
      "Que e tudo que sei amar.",
    ],
    delay: 1.8,
  },
]

/* ------------------------------------------------------------------ */
/*  Single Card Button                                                  */
/* ------------------------------------------------------------------ */
function CardSpot({
  card,
  visible,
  onOpen,
}: {
  card: HiddenCard
  visible: boolean
  onOpen: (card: HiddenCard) => void
}) {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={() => onOpen(card)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="absolute z-20 flex items-center justify-center cursor-pointer"
      style={{
        top: card.top,
        left: card.left,
        width: "40px",
        height: "40px",
        transform: `translate(-50%, -50%) scale(${hover ? 1.25 : 1})`,
        opacity: visible ? 1 : 0,
        transition: `all 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${card.delay}s`,
      }}
      aria-label={`Abrir poesia: ${card.title}`}
    >
      {/* Pulsing glow ring */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(220,100,160,0.35) 0%, transparent 70%)",
          animation: `cardPulse 2.5s ease-in-out infinite ${card.delay}s`,
        }}
      />
      {/* Inner dot */}
      <span
        className="relative w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,240,245,0.95))",
          boxShadow: "0 2px 10px rgba(200,80,140,0.3), 0 0 20px rgba(220,100,160,0.15)",
          border: "1.5px solid rgba(220,140,180,0.4)",
        }}
      >
        <Heart className="w-2.5 h-2.5 fill-current" style={{ color: "#d06090" }} />
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Modal for reading a poem                                            */
/* ------------------------------------------------------------------ */
function PoemModal({
  card,
  onClose,
}: {
  card: HiddenCard | null
  onClose: () => void
}) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (card) {
      requestAnimationFrame(() => setShow(true))
    } else {
      setShow(false)
    }
  }, [card])

  const handleClose = useCallback(() => {
    setShow(false)
    setTimeout(onClose, 350)
  }, [onClose])

  if (!card) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: show ? "rgba(60,30,50,0.55)" : "rgba(60,30,50,0)",
        backdropFilter: show ? "blur(6px)" : "blur(0px)",
        transition: "all 0.35s ease-out",
      }}
      onClick={handleClose}
    >
      <div
        ref={ref}
        className="relative w-full max-w-xs rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #fffbfc 0%, #fef5f8 50%, #fdf0f5 100%)",
          boxShadow: "0 20px 60px rgba(180,80,130,0.2), 0 8px 24px rgba(180,80,130,0.1)",
          border: "1px solid rgba(220,160,190,0.2)",
          transform: show ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
          opacity: show ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.8)",
            boxShadow: "0 2px 8px rgba(180,100,140,0.1)",
            border: "1px solid rgba(220,160,190,0.15)",
          }}
          aria-label="Fechar"
        >
          <X className="w-3.5 h-3.5" style={{ color: "#d06090" }} />
        </button>

        <div className="px-6 pt-7 pb-6 text-center">
          {/* Ornamental icon */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-6 h-px rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, #e0a0c0)" }}
            />
            <Feather className="w-4 h-4" style={{ color: "#d06090" }} />
            <div
              className="w-6 h-px rounded-full"
              style={{ background: "linear-gradient(90deg, #e0a0c0, transparent)" }}
            />
          </div>

          {/* Title */}
          <h4
            className="font-serif text-2xl text-primary mb-4"
            style={{ textShadow: "0 1px 8px rgba(200,120,160,0.12)" }}
          >
            {card.title}
          </h4>

          {/* Divider */}
          <div
            className="w-10 h-0.5 mx-auto rounded-full mb-4"
            style={{
              background: "linear-gradient(90deg, transparent, #d06090, transparent)",
            }}
          />

          {/* Poem lines */}
          <div className="flex flex-col gap-0.5">
            {card.poem.map((line, i) => (
              <p
                key={i}
                className="font-serif text-foreground text-sm md:text-base"
                style={{
                  lineHeight: "1.9",
                  opacity: show ? 1 : 0,
                  transform: show ? "translateY(0)" : "translateY(8px)",
                  transition: `all 0.5s ease-out ${0.15 + i * 0.1}s`,
                }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <div
              className="w-8 h-px rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, #d0a0b080)" }}
            />
            <Heart
              className="w-3 h-3 fill-current"
              style={{ color: "#d06090", opacity: 0.5 }}
            />
            <div
              className="w-8 h-px rounded-full"
              style={{ background: "linear-gradient(90deg, #d0a0b080, transparent)" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Bouquet Page                                                   */
/* ------------------------------------------------------------------ */
export function BouquetPage() {
  const [visible, setVisible] = useState(false)
  const [activeCard, setActiveCard] = useState<HiddenCard | null>(null)
  const [discovered, setDiscovered] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const handleOpen = useCallback((card: HiddenCard) => {
    setActiveCard(card)
    setDiscovered((prev) => new Set(prev).add(card.id))
  }, [])

  const handleClose = useCallback(() => {
    setActiveCard(null)
  }, [])

  return (
    <section className="py-6 md:py-8 px-4 md:px-6 h-full flex flex-col items-center justify-center relative">
      {/* Title */}
      <div
        className="text-center mb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-12px)",
          transition: "all 0.8s ease-out",
        }}
      >
        <h3
          className="font-serif text-2xl md:text-3xl text-primary mb-1"
          style={{ textShadow: "0 2px 10px rgba(200,120,160,0.12)" }}
        >
          {"Um Buque Para Voce"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {"Toque nos coracoes escondidos entre as flores"}
        </p>
      </div>

      {/* Bouquet container */}
      <div
        className="relative w-full max-w-[280px] md:max-w-[320px] mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.9)",
          transition: "all 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.2s",
        }}
      >
        {/* Photo wrapper */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 12px 40px rgba(180,100,140,0.15), 0 4px 16px rgba(180,100,140,0.08)",
            border: "1px solid rgba(220,160,190,0.15)",
          }}
        >
          <div className="relative aspect-[3/4]">
            <Image
              src="/images/bouquet-leleh.jpg"
              alt="Buque de flores rosas para Leleh"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 320px"
              priority
            />

            {/* Soft overlay for better card visibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 30%, rgba(255,245,250,0.15) 100%)",
              }}
            />

            {/* Hidden poetry cards */}
            {HIDDEN_CARDS.map((card) => (
              <CardSpot
                key={card.id}
                card={card}
                visible={visible}
                onOpen={handleOpen}
              />
            ))}
          </div>

          {/* Pink ribbon with "Leleh" text */}
          <div
            className="absolute bottom-0 left-0 right-0 z-30"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(200,60,120,0.05) 30%, rgba(200,60,120,0.85) 70%, rgba(180,50,100,0.95) 100%)",
              padding: "28px 0 14px 0",
            }}
          >
            <div className="flex flex-col items-center">
              {/* Ribbon shape */}
              <div
                className="relative px-8 py-2 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #c94080, #b03070, #a02868)",
                  boxShadow: "0 4px 16px rgba(160,40,100,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                {/* Ribbon left tail */}
                <div
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-6"
                  style={{
                    background: "linear-gradient(135deg, #b03070, #a02060)",
                    clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)",
                  }}
                />
                {/* Ribbon right tail */}
                <div
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-6"
                  style={{
                    background: "linear-gradient(225deg, #b03070, #a02060)",
                    clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)",
                  }}
                />
                <span
                  className="font-serif text-2xl md:text-3xl tracking-wide"
                  style={{
                    color: "#fff",
                    textShadow: "0 2px 6px rgba(100,20,60,0.4)",
                  }}
                >
                  {"Leleh"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery progress */}
      <div
        className="mt-4 flex items-center gap-1.5"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease-out 2s",
        }}
      >
        {HIDDEN_CARDS.map((card) => (
          <div
            key={card.id}
            className="w-2 h-2 rounded-full transition-all duration-500"
            style={{
              background: discovered.has(card.id)
                ? "linear-gradient(135deg, #d06090, #b060a0)"
                : "rgba(208,96,144,0.2)",
              boxShadow: discovered.has(card.id)
                ? "0 1px 6px rgba(200,80,140,0.3)"
                : "none",
            }}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1.5">
          {`${discovered.size}/${HIDDEN_CARDS.length}`}
        </span>
      </div>

      {/* Poem modal */}
      <PoemModal card={activeCard} onClose={handleClose} />

      <style jsx>{`
        @keyframes cardPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
