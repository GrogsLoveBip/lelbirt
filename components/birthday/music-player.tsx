"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  Music,
  X,
  Link2,
  Play,
  Square,
  SkipForward,
  SkipBack,
  Repeat,
  Plus,
  ChevronUp,
  ChevronDown,
  Trash2,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Track {
  id: string
  url: string
  embedSrc: string
  type: "spotify" | "youtube"
  title: string
  thumbnail: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
async function fetchYouTubeTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    )
    if (res.ok) {
      const data = await res.json()
      if (data.title) return data.title
    }
  } catch {
    // ignore – fall back to generic label
  }
  return "YouTube Video"
}

function parseLink(url: string): (Omit<Track, "id"> & { _ytId?: string }) | null {
  const trimmed = url.trim()

  // Spotify
  const spotifyMatch = trimmed.match(
    /open\.spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/
  )
  if (spotifyMatch) {
    const [, kind, id] = spotifyMatch
    const label =
      kind === "track" ? "Spotify Track" : kind === "playlist" ? "Spotify Playlist" : "Spotify Album"
    return {
      url: trimmed,
      embedSrc: `https://open.spotify.com/embed/${kind}/${id}?utm_source=generator&theme=0`,
      type: "spotify",
      title: `${label}`,
      thumbnail: `https://i.scdn.co/image/ab67616d00001e02fe24e0a8dbaee2e5a0e0e4e4`,
    }
  }

  // YouTube
  const ytLong = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/)
  const ytShort = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/)
  const ytId = ytLong?.[1] ?? ytShort?.[1]
  if (ytId) {
    return {
      url: trimmed,
      embedSrc: `https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}`,
      type: "youtube",
      title: "YouTube Video",
      thumbnail: `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`,
      _ytId: ytId,
    }
  }

  return null
}

let trackCounter = 0

/* ------------------------------------------------------------------ */
/*  Default track                                                      */
/* ------------------------------------------------------------------ */
const DEFAULT_YT_ID = "dA4tEwDi7g8"
const DEFAULT_TRACK: Track = {
  id: `track-${trackCounter++}`,
  url: `https://youtu.be/${DEFAULT_YT_ID}`,
  embedSrc: `https://www.youtube.com/embed/${DEFAULT_YT_ID}?autoplay=1&loop=1&playlist=${DEFAULT_YT_ID}`,
  type: "youtube",
  title: "Carregando...",
  thumbnail: `https://img.youtube.com/vi/${DEFAULT_YT_ID}/mqdefault.jpg`,
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function MusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>([DEFAULT_TRACK])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [repeat, setRepeat] = useState(true)
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [link, setLink] = useState("")
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const currentTrack = tracks.length > 0 ? tracks[currentIndex] : null

  // Fetch real title for the default YouTube track on mount
  useEffect(() => {
    fetchYouTubeTitle(DEFAULT_YT_ID).then((realTitle) => {
      setTracks((prev) =>
        prev.map((t) =>
          t.url.includes(DEFAULT_YT_ID) && t.title === "Carregando..."
            ? { ...t, title: realTitle }
            : t
        )
      )
    })
  }, [])

  useEffect(() => {
    if (showAddModal && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showAddModal])

  /* -- Track management -- */
  const addTrack = useCallback(async () => {
    const parsed = parseLink(link)
    if (!parsed) {
      setError("Link invalido. Cole um link do Spotify ou YouTube.")
      return
    }
    const ytId = (parsed as { _ytId?: string })._ytId
    let title = parsed.title
    if (ytId) {
      title = await fetchYouTubeTitle(ytId)
    }
    const { _ytId: _, ...rest } = parsed as Omit<Track, "id"> & { _ytId?: string }
    const newTrack: Track = { ...rest, title, id: `track-${trackCounter++}` }
    setTracks((prev) => {
      const next = [...prev, newTrack]
      // If this is the first track, auto-play it
      if (prev.length === 0) {
        setIsPlaying(true)
        setCurrentIndex(0)
      }
      return next
    })
    setLink("")
    setError("")
    setShowAddModal(false)
    setFlyoutOpen(true)
  }, [link])

  const removeTrack = useCallback(
    (index: number) => {
      setTracks((prev) => {
        const next = prev.filter((_, i) => i !== index)
        if (next.length === 0) {
          setIsPlaying(false)
          setCurrentIndex(0)
        } else if (index <= currentIndex) {
          setCurrentIndex((ci) => Math.max(0, ci - (index < ci ? 1 : 0)))
        }
        return next
      })
    },
    [currentIndex]
  )

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return
    setCurrentIndex((prev) => {
      if (prev >= tracks.length - 1) return repeat ? 0 : prev
      return prev + 1
    })
  }, [tracks.length, repeat])

  const handlePrev = useCallback(() => {
    if (tracks.length === 0) return
    setCurrentIndex((prev) => {
      if (prev <= 0) return repeat ? tracks.length - 1 : prev
      return prev - 1
    })
  }, [tracks.length, repeat])

  const handleStop = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const handlePlay = useCallback(() => {
    if (tracks.length > 0) setIsPlaying(true)
  }, [tracks.length])

  return (
    <>
      {/* Hidden iframe for audio */}
      {isPlaying && currentTrack && (
        <iframe
          key={currentTrack.id + currentIndex}
          src={currentTrack.embedSrc}
          className="fixed -left-[9999px] -top-[9999px]"
          width="0"
          height="0"
          allow="autoplay; encrypted-media"
          title="Background music"
          style={{ border: "none", pointerEvents: "none" }}
        />
      )}

      {/* ============ FLYOUT (bottom-left) ============ */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
        {/* Expanded Flyout Panel */}
        {flyoutOpen && (
          <div
            className="rounded-2xl overflow-hidden w-72 sm:w-80"
            style={{
              background: "linear-gradient(180deg, #fff8fa, #fef0f5)",
              boxShadow: "0 8px 40px rgba(180, 100, 140, 0.2)",
              border: "1px solid rgba(220, 160, 190, 0.3)",
              animation: "flyoutIn 0.3s ease-out both",
            }}
          >
            {/* Current Track Display */}
            {currentTrack ? (
              <div className="flex items-center gap-3 p-3">
                {/* Thumbnail */}
                <div
                  className="relative w-14 h-14 rounded-xl shrink-0 overflow-hidden"
                  style={{
                    boxShadow: "0 2px 10px rgba(180, 100, 140, 0.15)",
                  }}
                >
                  {currentTrack.type === "youtube" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentTrack.thumbnail}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #1DB954, #1ed760)" }}
                    >
                      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#fff">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.8 15.54 6.12 20.04 8.4c.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </div>
                  )}
                  {/* Playing indicator */}
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-end justify-center pb-1 gap-0.5"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full"
                          style={{
                            background: "#fff",
                            height: "8px",
                            animation: `eqBar 0.5s ease-in-out ${i * 0.15}s infinite alternate`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentTrack.type === "spotify" ? "Spotify" : "YouTube"}{" "}
                    &middot; Faixa {currentIndex + 1}/{tracks.length}
                  </p>
                </div>

                {/* Collapse button */}
                <button
                  onClick={() => setFlyoutOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors shrink-0"
                  aria-label="Minimizar player"
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3">
                <p className="text-sm text-muted-foreground">Nenhuma musica adicionada</p>
                <button
                  onClick={() => setFlyoutOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors shrink-0"
                  aria-label="Minimizar player"
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}

            {/* Controls bar */}
            <div
              className="flex items-center justify-center gap-1 px-3 py-2"
              style={{ borderTop: "1px solid rgba(220, 160, 190, 0.2)" }}
            >
              {/* Repeat */}
              <button
                onClick={() => setRepeat((r) => !r)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-primary/10"
                aria-label={repeat ? "Desativar repetir" : "Ativar repetir"}
                style={{ opacity: repeat ? 1 : 0.4 }}
              >
                <Repeat className="w-4 h-4 text-primary" />
              </button>

              {/* Previous */}
              <button
                onClick={handlePrev}
                disabled={tracks.length === 0}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-primary/10 disabled:opacity-30"
                aria-label="Faixa anterior"
              >
                <SkipBack className="w-4 h-4 text-foreground" />
              </button>

              {/* Play / Stop */}
              {isPlaying ? (
                <button
                  onClick={handleStop}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #d06090, #b060a0)",
                    boxShadow: "0 3px 12px rgba(200, 80, 140, 0.35)",
                  }}
                  aria-label="Parar"
                >
                  <Square className="w-4 h-4 text-card fill-card" />
                </button>
              ) : (
                <button
                  onClick={handlePlay}
                  disabled={tracks.length === 0}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #d06090, #b060a0)",
                    boxShadow: "0 3px 12px rgba(200, 80, 140, 0.35)",
                  }}
                  aria-label="Tocar"
                >
                  <Play className="w-4 h-4 text-card fill-card ml-0.5" />
                </button>
              )}

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={tracks.length === 0}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-primary/10 disabled:opacity-30"
                aria-label="Proxima faixa"
              >
                <SkipForward className="w-4 h-4 text-foreground" />
              </button>

              {/* Add track */}
              <button
                onClick={() => setShowAddModal(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-primary/10"
                aria-label="Adicionar musica"
              >
                <Plus className="w-4 h-4 text-primary" />
              </button>
            </div>

            {/* Track list */}
            {tracks.length > 1 && (
              <div
                className="px-3 pb-3 flex flex-col gap-1 max-h-36 overflow-y-auto"
                style={{ borderTop: "1px solid rgba(220, 160, 190, 0.15)" }}
              >
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 pt-2 pb-1">
                  Fila
                </p>
                {tracks.map((t, i) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors cursor-pointer"
                    style={{
                      background: i === currentIndex ? "rgba(208, 96, 144, 0.1)" : "transparent",
                    }}
                    onClick={() => {
                      setCurrentIndex(i)
                      setIsPlaying(true)
                    }}
                  >
                    {/* Track number / playing indicator */}
                    <span className="text-[10px] font-semibold text-muted-foreground w-4 text-center shrink-0">
                      {i === currentIndex && isPlaying ? (
                        <span className="flex items-end justify-center gap-px h-3">
                          {[0, 1, 2].map((b) => (
                            <span
                              key={b}
                              className="w-0.5 rounded-full"
                              style={{
                                background: "#d06090",
                                height: "6px",
                                animation: `eqBar 0.5s ease-in-out ${b * 0.15}s infinite alternate`,
                              }}
                            />
                          ))}
                        </span>
                      ) : (
                        i + 1
                      )}
                    </span>

                    {/* Mini thumbnail */}
                    <div className="w-7 h-7 rounded-md overflow-hidden shrink-0">
                      {t.type === "youtube" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #1DB954, #1ed760)" }}
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#fff">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.8 15.54 6.12 20.04 8.4c.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <span
                      className="flex-1 text-xs truncate"
                      style={{
                        color: i === currentIndex ? "#d06090" : undefined,
                        fontWeight: i === currentIndex ? 600 : 400,
                      }}
                    >
                      {t.title}
                    </span>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTrack(i)
                      }}
                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors shrink-0"
                      aria-label="Remover faixa"
                    >
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collapsed FAB - bottom-left */}
        {!flyoutOpen && (
          <button
            onClick={() => setFlyoutOpen(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative"
            style={{
              background: isPlaying
                ? "linear-gradient(135deg, #d06090, #b060a0)"
                : "linear-gradient(135deg, #f0a0c0, #d4a0d0)",
              boxShadow: isPlaying
                ? "0 4px 20px rgba(200, 80, 140, 0.4)"
                : "0 4px 15px rgba(200, 120, 160, 0.3)",
            }}
            aria-label="Abrir player de musica"
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full"
                    style={{
                      background: "#fff",
                      height: "10px",
                      animation: `eqBar 0.45s ease-in-out ${i * 0.12}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Music className="w-5 h-5 text-card" />
            )}

            {/* Badge with track count */}
            {tracks.length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: "#b060a0",
                  color: "#fff",
                  boxShadow: "0 2px 6px rgba(176, 96, 160, 0.4)",
                }}
              >
                {tracks.length}
              </span>
            )}

            {/* Expand hint */}
            <ChevronUp
              className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-3 text-primary/40"
              style={{ animation: "hintBounce 1.5s ease-in-out infinite" }}
            />
          </button>
        )}
      </div>

      {/* ============ ADD TRACK MODAL ============ */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 relative"
            style={{
              background: "linear-gradient(180deg, #fff8fa, #fef0f5)",
              boxShadow: "0 20px 60px rgba(180, 100, 140, 0.2)",
              border: "1px solid rgba(220, 160, 190, 0.3)",
              animation: "modalIn 0.3s ease-out both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-primary/10"
              aria-label="Fechar"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex justify-center mb-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #f0a0c0, #d4a0d0)",
                  boxShadow: "0 4px 15px rgba(200, 120, 160, 0.25)",
                }}
              >
                <Music className="w-6 h-6 text-card" />
              </div>
            </div>

            <h3 className="font-serif text-2xl text-center text-primary mb-1">
              Adicionar Musica
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-5 leading-relaxed">
              Cole um link do Spotify ou YouTube
            </p>

            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3"
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(220, 160, 190, 0.3)",
              }}
            >
              <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="url"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value)
                  setError("")
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTrack()
                }}
                placeholder="https://open.spotify.com/track/..."
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            {error && (
              <p className="text-sm text-center mb-3" style={{ color: "#d06060" }}>
                {error}
              </p>
            )}

            <div className="flex items-center justify-center gap-4 mb-5">
              <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.8 15.54 6.12 20.04 8.4c.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Spotify
              </span>
              <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                YouTube
              </span>
            </div>

            <button
              onClick={addTrack}
              className="w-full py-3 rounded-xl text-card font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #d06090, #b060a0)",
                boxShadow: "0 4px 15px rgba(200, 80, 140, 0.3)",
              }}
            >
              Adicionar Faixa
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes eqBar {
          from { height: 3px; }
          to { height: 12px; }
        }
        @keyframes flyoutIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes hintBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.3; }
          50% { transform: translateX(-50%) translateY(-4px); opacity: 0.7; }
        }
      `}</style>
    </>
  )
}
