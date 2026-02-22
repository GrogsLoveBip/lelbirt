"use client"

import { useState, useCallback } from "react"
import { CardCover } from "@/components/birthday/card-cover"
import { PhotoGallery } from "@/components/birthday/photo-gallery"
import { InteractiveCake } from "@/components/birthday/interactive-cake"
import { TypewriterText } from "@/components/birthday/typewriter-text"
import { VolleyballGame } from "@/components/birthday/volleyball-game"
import { Confetti } from "@/components/birthday/confetti"
import { MusicPlayer } from "@/components/birthday/music-player"
import { BookLayout, type BookSpread } from "@/components/birthday/book-layout"
import { DedicationPage } from "@/components/birthday/dedication-page"
import { PoemPage } from "@/components/birthday/poem-page"
import { QuotePage } from "@/components/birthday/quote-page"
import { MemoriesGallery } from "@/components/birthday/memories-gallery"
import { PhotoFeature } from "@/components/birthday/photo-feature"
import { WishPage } from "@/components/birthday/wish-page"
import { BouquetPage } from "@/components/birthday/bouquet-page"
import { GardenPage } from "@/components/birthday/garden-page"
import { Heart } from "lucide-react"

export default function BirthdayCard() {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleOpen = () => setIsOpen(true)

  const handleAllCandlesBlown = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 6000)
  }, [])

  /* ---------------------------------------------------------------- */
  /*  Book spreads (expanded to 6 double-page spreads)                  */
  /* ---------------------------------------------------------------- */
  const bookSpreads: BookSpread[] = [
    // Spread 1: Dedication + First Poem
    {
      leftLabel: "Dedicatoria",
      rightLabel: "Poesia",
      left: <DedicationPage />,
      right: (
        <PoemPage
          title="Voce E Poesia"
          stanzas={[
            [
              "Se eu pudesse guardar um sorriso,",
              "Guardaria o teu, sem pensar.",
              "E faria dele meu abrigo,",
              "Meu refugio, meu lugar.",
            ],
            [
              "Seus olhos sao como estrelas,",
              "Que iluminam minha escuridao.",
              "E cada palavra tua e um verso",
              "Que mora no meu coracao.",
            ],
          ]}
          author="Para Leleh, com amor"
          accentColor="#d06090"
        />
      ),
    },
    // Spread 2: Photo Gallery + Inspirational Quote
    {
      leftLabel: "Fotos",
      rightLabel: "Reflexao",
      left: <PhotoGallery />,
      right: (
        <QuotePage
          quote="A amizade e o amor sem asas"
          author="Lord Byron"
          reflection="E exatamente isso que sinto por voce, Leleh. Um amor que nao precisa de nada alem da sua presenca para voar. Voce e a pessoa que me faz acreditar que os lacos verdadeiros duram para sempre."
        />
      ),
    },
    // Spread 3: Featured Photo + Second Poem
    {
      leftLabel: "Momento",
      rightLabel: "Poesia",
      left: (
        <PhotoFeature
          src="/images/photo-5.jpg"
          alt="Maos que se encontram em um gesto de carinho"
          caption="Nos"
          message="Ha momentos que nenhuma foto consegue capturar por completo, porque a felicidade de estar ao seu lado transborda qualquer moldura."
        />
      ),
      right: (
        <PoemPage
          title="Minha Melhor Amiga"
          stanzas={[
            [
              "Nas tardes de sol ou chuva,",
              "No riso ou no chorar,",
              "Voce e a mao que me encontra",
              "E nunca vai me soltar.",
            ],
            [
              "Amiga de alma e de vida,",
              "De historias sem ter fim.",
              "O mundo ficou mais bonito",
              "Desde que voce esta em mim.",
            ],
            [
              "Obrigada por existir,",
              "Por ser luz no meu caminhar.",
              "Feliz aniversario, Leleh,",
              "Eu nunca vou te deixar.",
            ],
          ]}
          author="Escrito de coracao"
          accentColor="#b060a0"
        />
      ),
    },
    // Spread 4: Cake + Wishes
    {
      leftLabel: "Bolo",
      rightLabel: "Desejos",
      left: <InteractiveCake onAllCandlesBlown={handleAllCandlesBlown} />,
      right: (
        <WishPage
          title="Meus Desejos Para Voce"
          wishes={[
            {
              text: "Que voce tenha dias cheios de sol e noites cheias de estrelas.",
              icon: "star",
            },
            {
              text: "Que cada sorriso seu dure um pouquinho mais do que o anterior.",
              icon: "heart",
            },
            {
              text: "Que voce encontre beleza ate nos dias mais simples.",
              icon: "star",
            },
            {
              text: "Que o amor te abrace forte em todos os momentos.",
              icon: "heart",
            },
            {
              text: "Que voce nunca perca a magia de ser quem voce e.",
              icon: "star",
            },
            {
              text: "Que a nossa amizade seja eterna como as estrelas no ceu.",
              icon: "heart",
            },
          ]}
        />
      ),
    },
    // Spread 5: Bouquet with hidden poems + Romantic Garden illustration
    {
      leftLabel: "Buque",
      rightLabel: "Jardim",
      left: <BouquetPage />,
      right: <GardenPage />,
    },
    // Spread 6: More Memories + Quote (was 5)
    {
      leftLabel: "Memorias",
      rightLabel: "Inspiracao",
      left: (
        <MemoriesGallery
          title="Nossos Tesouros"
          subtitle="Guardados com carinho"
          photos={[
            {
              src: "/images/photo-6.jpg",
              alt: "Por do sol sobre um lago pacifico",
              caption: "Paz",
              rotation: -3,
              accent: "#c88090",
            },
            {
              src: "/images/photo-7.jpg",
              alt: "Buque de flores delicadas",
              caption: "Beleza",
              rotation: 2,
              accent: "#d06090",
            },
            {
              src: "/images/photo-8.jpg",
              alt: "Ceu estrelado magico",
              caption: "Magia",
              rotation: -2,
              accent: "#b060a0",
            },
            {
              src: "/images/photo-5.jpg",
              alt: "Maos dadas com carinho",
              caption: "Uniao",
              rotation: 3,
              accent: "#c88060",
            },
          ]}
        />
      ),
      right: (
        <QuotePage
          quote="As pessoas mais bonitas sao aquelas que mesmo sem saber, iluminam a vida de quem esta ao redor"
          author="Desconhecido"
          reflection="Isso e voce, Leleh. Voce ilumina cada canto por onde passa e nem percebe o efeito magico que tem sobre as pessoas. O mundo precisa de mais gente como voce."
        />
      ),
    },
    // Spread 7: Letter + Volleyball Mini-Game
    {
      leftLabel: "Carta",
      rightLabel: "Volei",
      left: <TypewriterText />,
      right: <VolleyballGame />,
    },
  ]

  return (
    <main
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background:
          "linear-gradient(180deg, #fef0f5 0%, #f8e8f0 25%, #faf0f5 50%, #f5e5ef 75%, #fef0f5 100%)",
      }}
    >
      {/* Confetti overlay */}
      <Confetti active={showConfetti} />

      {/* Music player - always visible */}
      <MusicPlayer />

      {/* =================== COVER =================== */}
      {!isOpen && <CardCover onOpen={handleOpen} />}

      {/* =================== BOOK =================== */}
      {isOpen && (
        <div
          className="flex flex-col min-h-screen"
          style={{ animation: "bookEnter 0.8s ease-out forwards" }}
        >
          {/* Header */}
          <header className="pt-10 pb-4 px-4 text-center shrink-0">
            <div
              className="flex items-center justify-center gap-3 mb-3"
              style={{ animation: "fadeInDown 0.7s ease-out 0.3s both" }}
            >
              <div
                className="w-10 h-0.5 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent, #e0a0c0)",
                }}
              />
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <div
                className="w-10 h-0.5 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #e0a0c0, transparent)",
                }}
              />
            </div>

            <h1
              className="font-serif text-4xl md:text-6xl text-primary mb-1"
              style={{
                animation: "fadeInDown 0.7s ease-out 0.4s both",
                textShadow: "0 2px 10px rgba(200,120,160,0.15)",
              }}
            >
              {"Feliz Aniversario"}
            </h1>
            <h2
              className="font-serif text-5xl md:text-7xl mb-3"
              style={{
                background: "linear-gradient(135deg, #d06090, #b060a0, #c88060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "fadeInDown 0.7s ease-out 0.55s both",
              }}
            >
              {"Leleh"}
            </h2>
            <p
              className="text-muted-foreground text-sm md:text-base"
              style={{ animation: "fadeInUp 0.7s ease-out 0.7s both" }}
            >
              {"Navegue pelas paginas deste livro feito com amor"}
            </p>
          </header>

          {/* Book */}
          <div
            className="flex-1 px-4 pb-8"
            style={{ animation: "fadeInUp 0.8s ease-out 0.9s both" }}
          >
            <BookLayout spreads={bookSpreads} />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bookEnter {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}
