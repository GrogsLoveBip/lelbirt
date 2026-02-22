"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Heart, Trophy, RotateCcw, Gamepad2 } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */
const GRAVITY = 0.35
const BALL_RADIUS = 14
const PADDLE_W = 80
const PADDLE_H = 14
const PADDLE_Y_OFFSET = 40
const NET_WIDTH = 4
const BOUNCE_DAMPENING = 0.75
const HIT_POWER = -8.5
const MAX_SCORE = 5
const AI_SPEED = 3.2
const AI_REACTION_DELAY = 0.35

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
export function VolleyballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<"intro" | "playing" | "won" | "lost">("intro")
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [canvasSize, setCanvasSize] = useState({ w: 320, h: 400 })

  const gameRef = useRef({
    ball: { x: 160, y: 100, vx: 2, vy: 0 } as Ball,
    playerX: 160,
    aiX: 160,
    playerScore: 0,
    aiScore: 0,
    running: false,
    pointerX: -1,
    lastServe: "player" as "player" | "ai",
    aiTargetX: 160,
    aiReactionTimer: 0,
    netH: 100,
  })

  /* ---------- Resize ---------- */
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const w = Math.floor(rect.width)
      const h = Math.floor(Math.min(rect.height, 520))
      setCanvasSize({ w, h })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  /* ---------- Reset ball ---------- */
  const resetBall = useCallback(
    (serveFrom: "player" | "ai") => {
      const g = gameRef.current
      const { w, h } = canvasSize
      if (serveFrom === "player") {
        g.ball = { x: w * 0.25, y: h * 0.5, vx: 2.5, vy: -4 }
      } else {
        g.ball = { x: w * 0.75, y: h * 0.5, vx: -2.5, vy: -4 }
      }
    },
    [canvasSize],
  )

  /* ---------- Start game ---------- */
  const startGame = useCallback(() => {
    const g = gameRef.current
    g.playerScore = 0
    g.aiScore = 0
    g.running = true
    g.lastServe = "player"
    setPlayerScore(0)
    setAiScore(0)
    setGameState("playing")
    resetBall("player")
  }, [resetBall])

  /* ---------- Main game loop ---------- */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf: number

    const loop = () => {
      const g = gameRef.current
      const { w, h } = canvasSize
      canvas.width = w
      canvas.height = h

      const netX = w / 2
      const netTop = h - g.netH
      const paddleY = h - PADDLE_Y_OFFSET

      if (g.running) {
        /* --- Physics --- */
        g.ball.vy += GRAVITY
        g.ball.x += g.ball.vx
        g.ball.y += g.ball.vy

        /* Ceiling */
        if (g.ball.y - BALL_RADIUS < 0) {
          g.ball.y = BALL_RADIUS
          g.ball.vy = Math.abs(g.ball.vy) * BOUNCE_DAMPENING
        }

        /* Side walls */
        if (g.ball.x - BALL_RADIUS < 0) {
          g.ball.x = BALL_RADIUS
          g.ball.vx = Math.abs(g.ball.vx)
        }
        if (g.ball.x + BALL_RADIUS > w) {
          g.ball.x = w - BALL_RADIUS
          g.ball.vx = -Math.abs(g.ball.vx)
        }

        /* Net collision */
        if (
          g.ball.y + BALL_RADIUS > netTop &&
          g.ball.y - BALL_RADIUS < h
        ) {
          // Coming from left
          if (g.ball.vx > 0 && g.ball.x + BALL_RADIUS > netX - NET_WIDTH / 2 && g.ball.x < netX) {
            g.ball.x = netX - NET_WIDTH / 2 - BALL_RADIUS
            g.ball.vx = -Math.abs(g.ball.vx) * BOUNCE_DAMPENING
          }
          // Coming from right
          if (g.ball.vx < 0 && g.ball.x - BALL_RADIUS < netX + NET_WIDTH / 2 && g.ball.x > netX) {
            g.ball.x = netX + NET_WIDTH / 2 + BALL_RADIUS
            g.ball.vx = Math.abs(g.ball.vx) * BOUNCE_DAMPENING
          }
        }

        // Net top bounce
        if (
          Math.abs(g.ball.x - netX) < BALL_RADIUS + NET_WIDTH / 2 &&
          g.ball.y + BALL_RADIUS > netTop &&
          g.ball.y + BALL_RADIUS < netTop + 10 &&
          g.ball.vy > 0
        ) {
          g.ball.vy = -Math.abs(g.ball.vy) * BOUNCE_DAMPENING
          g.ball.y = netTop - BALL_RADIUS
        }

        /* Player paddle collision */
        if (g.pointerX >= 0) {
          g.playerX += (Math.min(Math.max(g.pointerX, PADDLE_W / 2), netX - NET_WIDTH / 2 - PADDLE_W / 2) - g.playerX) * 0.3
        }
        if (
          g.ball.vy > 0 &&
          g.ball.y + BALL_RADIUS >= paddleY &&
          g.ball.y + BALL_RADIUS <= paddleY + PADDLE_H + 4 &&
          g.ball.x > g.playerX - PADDLE_W / 2 - BALL_RADIUS &&
          g.ball.x < g.playerX + PADDLE_W / 2 + BALL_RADIUS
        ) {
          g.ball.vy = HIT_POWER
          const offset = (g.ball.x - g.playerX) / (PADDLE_W / 2)
          g.ball.vx = offset * 5
          g.ball.y = paddleY - BALL_RADIUS
        }

        /* AI paddle */
        g.aiReactionTimer += 1 / 60
        if (g.aiReactionTimer > AI_REACTION_DELAY) {
          g.aiTargetX = g.ball.x + g.ball.vx * 8
          g.aiReactionTimer = 0
        }
        const aiTarget = Math.min(Math.max(g.aiTargetX, netX + NET_WIDTH / 2 + PADDLE_W / 2), w - PADDLE_W / 2)
        const diff = aiTarget - g.aiX
        g.aiX += Math.sign(diff) * Math.min(Math.abs(diff), AI_SPEED)

        if (
          g.ball.vy > 0 &&
          g.ball.y + BALL_RADIUS >= paddleY &&
          g.ball.y + BALL_RADIUS <= paddleY + PADDLE_H + 4 &&
          g.ball.x > g.aiX - PADDLE_W / 2 - BALL_RADIUS &&
          g.ball.x < g.aiX + PADDLE_W / 2 + BALL_RADIUS
        ) {
          g.ball.vy = HIT_POWER
          const offset = (g.ball.x - g.aiX) / (PADDLE_W / 2)
          g.ball.vx = offset * 5
          g.ball.y = paddleY - BALL_RADIUS
        }

        /* Floor – scoring */
        if (g.ball.y + BALL_RADIUS > h) {
          if (g.ball.x < netX) {
            // AI scores
            g.aiScore++
            setAiScore(g.aiScore)
            g.lastServe = "ai"
          } else {
            // Player scores
            g.playerScore++
            setPlayerScore(g.playerScore)
            g.lastServe = "player"
          }

          if (g.playerScore >= MAX_SCORE) {
            g.running = false
            setGameState("won")
          } else if (g.aiScore >= MAX_SCORE) {
            g.running = false
            setGameState("lost")
          } else {
            resetBall(g.lastServe)
          }
        }
      }

      /* ---------- Draw ---------- */
      ctx.clearRect(0, 0, w, h)

      // Sky gradient (sandy court vibe but pink-tinted)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
      skyGrad.addColorStop(0, "#fff0f5")
      skyGrad.addColorStop(0.6, "#ffe8ef")
      skyGrad.addColorStop(1, "#f5d5c8")
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h)

      // Sand floor
      const sandGrad = ctx.createLinearGradient(0, h - 30, 0, h)
      sandGrad.addColorStop(0, "#f0d8c8")
      sandGrad.addColorStop(1, "#e8c8b0")
      ctx.fillStyle = sandGrad
      ctx.fillRect(0, h - 30, w, 30)

      // Court line
      ctx.strokeStyle = "rgba(200,140,160,0.3)"
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(10, h - 30)
      ctx.lineTo(w - 10, h - 30)
      ctx.stroke()
      ctx.setLineDash([])

      // Net
      ctx.fillStyle = "rgba(180,100,140,0.5)"
      ctx.fillRect(netX - NET_WIDTH / 2, netTop, NET_WIDTH, g.netH)
      // Net horizontal lines
      ctx.strokeStyle = "rgba(180,100,140,0.2)"
      ctx.lineWidth = 1
      for (let ny = netTop + 12; ny < h; ny += 12) {
        ctx.beginPath()
        ctx.moveTo(netX - 8, ny)
        ctx.lineTo(netX + 8, ny)
        ctx.stroke()
      }
      // Net pole top
      ctx.fillStyle = "#c87090"
      ctx.beginPath()
      ctx.arc(netX, netTop, 5, 0, Math.PI * 2)
      ctx.fill()

      // Paddles
      const drawPaddle = (x: number, color1: string, color2: string) => {
        const grad = ctx.createLinearGradient(x - PADDLE_W / 2, paddleY, x + PADDLE_W / 2, paddleY + PADDLE_H)
        grad.addColorStop(0, color1)
        grad.addColorStop(1, color2)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x - PADDLE_W / 2, paddleY, PADDLE_W, PADDLE_H, 7)
        ctx.fill()
        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.3)"
        ctx.beginPath()
        ctx.roundRect(x - PADDLE_W / 2 + 4, paddleY + 2, PADDLE_W - 8, 4, 3)
        ctx.fill()
      }

      drawPaddle(g.playerX, "#d06090", "#b05080")
      drawPaddle(g.aiX, "#a060b0", "#8050a0")

      // Player label
      ctx.fillStyle = "rgba(180,100,140,0.5)"
      ctx.font = "bold 9px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("LELEH", g.playerX, paddleY + PADDLE_H + 12)
      ctx.fillText("CPU", g.aiX, paddleY + PADDLE_H + 12)

      // Ball (heart-shaped volleyball!)
      const bx = g.ball.x
      const by = g.ball.y
      const r = BALL_RADIUS

      // Ball shadow
      ctx.fillStyle = "rgba(180,100,140,0.12)"
      ctx.beginPath()
      ctx.ellipse(bx, h - 26, r * 0.8, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Draw a heart as the ball
      ctx.save()
      ctx.translate(bx, by)
      const rotation = Math.atan2(g.ball.vy, g.ball.vx) * 0.3
      ctx.rotate(rotation)

      const heartSize = r * 1.2
      ctx.beginPath()
      ctx.moveTo(0, heartSize * 0.3)
      ctx.bezierCurveTo(
        -heartSize * 0.5, -heartSize * 0.3,
        -heartSize, heartSize * 0.1,
        0, heartSize * 0.8
      )
      ctx.bezierCurveTo(
        heartSize, heartSize * 0.1,
        heartSize * 0.5, -heartSize * 0.3,
        0, heartSize * 0.3
      )
      ctx.closePath()

      const heartGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, heartSize)
      heartGrad.addColorStop(0, "#f080a0")
      heartGrad.addColorStop(0.7, "#d06090")
      heartGrad.addColorStop(1, "#b05080")
      ctx.fillStyle = heartGrad
      ctx.fill()

      // Heart shine
      ctx.fillStyle = "rgba(255,255,255,0.35)"
      ctx.beginPath()
      ctx.ellipse(-heartSize * 0.25, -heartSize * 0.05, heartSize * 0.18, heartSize * 0.12, -0.4, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      // Decorative small hearts in the air
      if (g.running || gameState === "intro") {
        const time = Date.now() / 1000
        for (let i = 0; i < 3; i++) {
          const hx = (w * (0.15 + i * 0.35)) + Math.sin(time + i * 2) * 15
          const hy = 20 + Math.cos(time * 0.7 + i * 1.5) * 10
          const hs = 4 + i
          ctx.fillStyle = `rgba(208,96,144,${0.12 + i * 0.03})`
          ctx.beginPath()
          ctx.moveTo(hx, hy + hs * 0.3)
          ctx.bezierCurveTo(hx - hs * 0.5, hy - hs * 0.3, hx - hs, hy + hs * 0.1, hx, hy + hs * 0.8)
          ctx.bezierCurveTo(hx + hs, hy + hs * 0.1, hx + hs * 0.5, hy - hs * 0.3, hx, hy + hs * 0.3)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [canvasSize, gameState, resetBall])

  /* ---------- Pointer controls ---------- */
  const handlePointer = useCallback(
    (e: React.PointerEvent | React.TouchEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX
      gameRef.current.pointerX = clientX - rect.left
    },
    [],
  )

  const handlePointerLeave = useCallback(() => {
    gameRef.current.pointerX = -1
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden px-3 py-4"
      style={{ minHeight: 380 }}
    >
      {/* Intro overlay */}
      {gameState === "intro" && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6"
          style={{
            background: "rgba(255,248,252,0.92)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #f0a0c0, #d4a0d0)",
              animation: "introIconPulse 2s ease-in-out infinite",
            }}
          >
            <Gamepad2 className="w-7 h-7" style={{ color: "#fff" }} />
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-primary mb-2 text-center text-balance">
            {"Volei da Leleh!"}
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm text-center mb-5 max-w-[240px] leading-relaxed">
            {"Um mini jogo especial pra voce que ama volei! Mova o bastao rosa para rebater o coracao."}
          </p>
          <button
            onClick={startGame}
            className="relative cursor-pointer px-7 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #d06090, #b060a0)",
              color: "#fff",
              boxShadow: "0 6px 20px rgba(200,80,140,0.3)",
            }}
          >
            <span className="flex items-center gap-2">
              {"Jogar"}
              <Heart className="w-4 h-4 fill-current" />
            </span>
          </button>
          <p className="text-muted-foreground text-[10px] mt-3 text-center">
            {"Primeiro a marcar 5 pontos vence!"}
          </p>
        </div>
      )}

      {/* Win overlay */}
      {gameState === "won" && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6"
          style={{
            background: "rgba(255,248,252,0.94)",
            backdropFilter: "blur(4px)",
            animation: "overlayIn 0.5s ease-out",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #f0a0c0, #e0c080)",
              animation: "introIconPulse 1.5s ease-in-out infinite",
            }}
          >
            <Trophy className="w-8 h-8" style={{ color: "#fff" }} />
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-primary mb-2 text-center">
            {"Leleh Venceu!"}
          </h3>
          <p className="text-muted-foreground text-xs text-center mb-1">
            {`${playerScore} x ${aiScore}`}
          </p>
          <p className="text-foreground text-sm text-center mb-5 max-w-[220px] leading-relaxed">
            {"Voce e craque no volei e em tudo que faz!"}
          </p>
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                className="fill-current text-primary"
                style={{
                  width: 14 + i * 2,
                  height: 14 + i * 2,
                  animation: `heartPopIn 0.4s ease-out ${i * 0.1}s both`,
                }}
              />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <Heart
                key={i + 5}
                className="fill-current text-primary"
                style={{
                  width: 22 - i * 2,
                  height: 22 - i * 2,
                  animation: `heartPopIn 0.4s ease-out ${(5 + i) * 0.1}s both`,
                }}
              />
            ))}
          </div>
          <button
            onClick={startGame}
            className="cursor-pointer px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #d06090, #b060a0)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(200,80,140,0.25)",
            }}
          >
            <RotateCcw className="w-4 h-4" />
            {"Jogar de novo"}
          </button>
        </div>
      )}

      {/* Lose overlay */}
      {gameState === "lost" && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6"
          style={{
            background: "rgba(255,248,252,0.94)",
            backdropFilter: "blur(4px)",
            animation: "overlayIn 0.5s ease-out",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #d0a0c0, #b0a0d0)" }}
          >
            <Heart className="w-7 h-7 fill-current" style={{ color: "#fff" }} />
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-primary mb-2 text-center">
            {"Quase la!"}
          </h3>
          <p className="text-muted-foreground text-xs text-center mb-1">
            {`${playerScore} x ${aiScore}`}
          </p>
          <p className="text-foreground text-sm text-center mb-5 max-w-[220px] leading-relaxed">
            {"Voce e incrivel de qualquer forma, tenta de novo!"}
          </p>
          <button
            onClick={startGame}
            className="cursor-pointer px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #d06090, #b060a0)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(200,80,140,0.25)",
            }}
          >
            <RotateCcw className="w-4 h-4" />
            {"Tentar de novo"}
          </button>
        </div>
      )}

      {/* Score display */}
      {gameState === "playing" && (
        <div
          className="absolute top-3 left-0 right-0 z-20 flex items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.8)" }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#d06090" }}>
              {"Leleh"}
            </span>
            <span className="font-bold text-sm" style={{ color: "#d06090" }}>
              {playerScore}
            </span>
          </div>
          <span className="text-muted-foreground text-xs font-medium">{"x"}</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.8)" }}>
            <span className="font-bold text-sm" style={{ color: "#a060b0" }}>
              {aiScore}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#a060b0" }}>
              {"CPU"}
            </span>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        className="rounded-xl w-full touch-none"
        style={{ maxHeight: 520 }}
        onPointerMove={handlePointer}
        onPointerLeave={handlePointerLeave}
        onTouchMove={(e) => {
          e.preventDefault()
          handlePointer(e)
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          handlePointer(e)
        }}
      />

      {/* Instructions while playing */}
      {gameState === "playing" && (
        <p className="text-muted-foreground text-[10px] mt-2 text-center">
          {"Mova o mouse ou deslize o dedo para controlar"}
        </p>
      )}

      <style jsx>{`
        @keyframes introIconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes overlayIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes heartPopIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  )
}
