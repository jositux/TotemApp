"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useApp } from "@/lib/store-context"
import { Button } from "@/components/ui/button"

const slides = [
  {
    label: "Personaliza",
    title: "Personaliza la\nproteccion de\ntu celular",
    description:
      "Crea una proteccion unica combinando seguridad, diseno y tecnologia en minutos, directamente en tienda.",
    image: "/onboarding-1.jpg",
  },
  {
    label: "Protege",
    title: "Protege tu\ncelular con\nestilo unico",
    description:
      "Elige entre cientos de disenos y materiales premium que se adaptan a tu personalidad y estilo de vida.",
    image: "/onboarding-2.jpg",
  },
  {
    label: "Disfruta",
    title: "Disfruta tu\nnueva funda\nal instante",
    description:
      "Recibe tu funda personalizada en minutos. Sin esperas, sin complicaciones, lista para usar.",
    image: "/onboarding-3.jpg",
  },
]

const COUNT = slides.length
const CARD_W = 240
const CARD_GAP = 16
const STEP = CARD_W + CARD_GAP

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

/** Modulo that always returns a positive value */
function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

/** Shortest signed distance on a ring of `m` items */
function ringDist(a: number, b: number, m: number) {
  const d = mod(a - b, m)
  return d > m / 2 ? d - m : d
}

export function Onboarding() {
  const { onboardingStep, setOnboardingStep, setStep } = useApp()

  // virtualIndex tracks cumulative position (can go negative or > COUNT-1)
  const [virtualIndex, setVirtualIndex] = useState(0)
  const [dragDelta, setDragDelta] = useState(0) // px while dragging
  const [isDragging, setIsDragging] = useState(false)
  const [animating, setAnimating] = useState(false)

  const pointerOrigin = useRef(0)
  const velocityRef = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const virtualAtStart = useRef(0)

  // The real slide index (0..COUNT-1)
  const realIndex = mod(virtualIndex, COUNT)

  // Sync the app-level step with our local real index
  useEffect(() => {
    setOnboardingStep(realIndex)
  }, [realIndex, setOnboardingStep])

  // When dots are clicked, jump to that real index via shortest path
  const goToSlide = useCallback(
    (targetReal: number) => {
      const diff = ringDist(targetReal, realIndex, COUNT)
      setAnimating(true)
      setVirtualIndex((prev) => prev + diff)
    },
    [realIndex],
  )

  // fractional progress used for interpolation: 0 = card centered, drag moves it
  const fractionalOffset = virtualIndex + dragDelta / STEP

  // --- Pointer handlers ---
  const onPointerDown = (e: React.PointerEvent) => {
    if (animating) setAnimating(false)
    setIsDragging(true)
    setDragDelta(0)
    pointerOrigin.current = e.clientX
    virtualAtStart.current = virtualIndex
    velocityRef.current = 0
    lastX.current = e.clientX
    lastTime.current = Date.now()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - pointerOrigin.current
    setDragDelta(-dx) // negative because dragging left = advancing

    const now = Date.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      velocityRef.current = (e.clientX - lastX.current) / dt
    }
    lastX.current = e.clientX
    lastTime.current = now
  }

  const onPointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)

    // Determine how many steps to advance (with velocity bias)
    const rawSteps = dragDelta / STEP
    const velocityBias = clamp(-velocityRef.current * 0.4, -0.5, 0.5)
    const snapped = Math.round(rawSteps + velocityBias)

    setDragDelta(0)
    setAnimating(true)
    setVirtualIndex((prev) => prev + snapped)
  }

  const currentSlide = slides[realIndex]

  const handleNext = () => {
    setAnimating(true)
    setVirtualIndex((prev) => prev + 1)
  }

  const handleStart = () => {
    setStep("auth")
  }

  // Build visible cards: current + neighbours on each side
  const visibleRange = [-2, -1, 0, 1, 2]

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-[#4a1a8a] via-[#5b2d9e] to-[#7b3fb5] overflow-hidden select-none">
      {/* Header / Logo */}
      <header className="relative z-10 flex justify-center pt-10 pb-4">
        <span className="text-white font-bold text-3xl italic tracking-tight">
          telcel
        </span>
      </header>

      {/* Card Carousel */}
      <div
        className="relative z-10 flex-shrink-0 touch-pan-y overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: 380 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {visibleRange.map((offset) => {
            const slideIdx = mod(virtualIndex + offset, COUNT)
            const slide = slides[slideIdx]

            // Position relative to center (fractional, accounts for drag)
            const pos = offset - dragDelta / STEP
            const dist = Math.abs(pos)

            // Same size for all, only opacity changes
            const opacity = dist < 0.1 ? 1 : clamp(1 - dist * 0.5, 0.3, 0.7)
            const translateX = pos * STEP
            const zIndex = 10 - Math.round(dist)

            return (
              <div
                key={`${virtualIndex}-${offset}`}
                className="absolute rounded-3xl overflow-hidden"
                style={{
                  width: CARD_W,
                  height: 360,
                  transform: `translateX(${translateX}px)`,
                  opacity,
                  zIndex,
                  transition:
                    isDragging
                      ? "none"
                      : "transform 0.45s cubic-bezier(.25,.85,.35,1), opacity 0.45s ease",
                }}
              >
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.label}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                <span className="absolute bottom-6 left-6 text-white text-2xl font-bold pointer-events-none">
                  {slide.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 py-5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === realIndex
                ? "w-8 bg-accent"
                : "w-2.5 bg-white/30"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Text content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-8 text-center">
        <h1 className="text-white text-3xl font-bold leading-tight whitespace-pre-line text-balance">
          {currentSlide.title}
        </h1>
        <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-xs text-pretty">
          {currentSlide.description}
        </p>
      </div>

      {/* Buttons */}
      <div className="relative z-10 flex gap-4 px-6 pb-8 pt-4">
        <Button
          onClick={handleNext}
          variant="outline"
          className="flex-1 h-14 rounded-full border-2 border-white/40 bg-transparent text-white text-base font-semibold hover:bg-white/10"
        >
          Siguiente
        </Button>
        <Button
          onClick={handleStart}
          variant="outline"
          className="flex-1 h-14 rounded-full border-2 border-white/40 bg-transparent text-white text-base font-semibold hover:bg-white/10"
        >
          Empezar
        </Button>
      </div>
    </div>
  )
}
