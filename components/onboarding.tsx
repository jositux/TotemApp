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

const CARD_W = 260
const CARD_GAP = 16

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function Onboarding() {
  const { onboardingStep, setOnboardingStep, setStep } = useApp()
  const trackRef = useRef<HTMLDivElement>(null)

  // dragOffset is in px: 0 = card 0 centered, negative = dragged left
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [animating, setAnimating] = useState(false)

  const pointerOrigin = useRef(0)
  const offsetOrigin = useRef(0)
  const velocityRef = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)

  // Convert step index to an offset in px (0-based, negative for right slides)
  const stepToOffset = (step: number) => -step * (CARD_W + CARD_GAP)

  // Snap the offset to the nearest valid step
  const snapToNearest = useCallback(
    (offset: number, velocity: number) => {
      const raw = -offset / (CARD_W + CARD_GAP)
      // Apply velocity bias: if flicking fast, round in flick direction
      const biased = velocity !== 0 ? raw + clamp(velocity * -0.3, -0.4, 0.4) : raw
      const idx = clamp(Math.round(biased), 0, slides.length - 1)
      setOnboardingStep(idx)
      setAnimating(true)
      setDragOffset(stepToOffset(idx))
    },
    [setOnboardingStep],
  )

  // Keep offset in sync when step is changed externally (dots, buttons)
  useEffect(() => {
    if (!isDragging) {
      setAnimating(true)
      setDragOffset(stepToOffset(onboardingStep))
    }
  }, [onboardingStep, isDragging])

  // --- Pointer handlers ---
  const onPointerDown = (e: React.PointerEvent) => {
    if (animating) setAnimating(false)
    setIsDragging(true)
    pointerOrigin.current = e.clientX
    offsetOrigin.current = dragOffset
    velocityRef.current = 0
    lastX.current = e.clientX
    lastTime.current = Date.now()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - pointerOrigin.current
    const maxOffset = 0
    const minOffset = -(slides.length - 1) * (CARD_W + CARD_GAP)
    // Add rubber-band feel at edges
    let next = offsetOrigin.current + dx
    if (next > maxOffset) next = maxOffset + (next - maxOffset) * 0.3
    if (next < minOffset) next = minOffset + (next - minOffset) * 0.3
    setDragOffset(next)

    // Track velocity
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
    snapToNearest(dragOffset, velocityRef.current)
  }

  const currentSlide = slides[onboardingStep]

  const handleNext = () => {
    if (onboardingStep < slides.length - 1) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      setStep("auth")
    }
  }

  const handleStart = () => {
    setStep("auth")
  }

  // Continuous progress value (0..slides.length-1) for smooth interpolation
  const progress = -dragOffset / (CARD_W + CARD_GAP)

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-[#4a1a8a] via-[#5b2d9e] to-[#7b3fb5] overflow-hidden select-none">
      {/* Header / Logo */}
      <header className="relative z-10 flex justify-center pt-10 pb-4">
        <span className="text-white font-bold text-3xl italic tracking-tight">
          telcel
        </span>
      </header>

      {/* Card Carousel – drag-based */}
      <div
        ref={trackRef}
        className="relative z-10 flex-shrink-0 touch-pan-y overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex items-center justify-center"
          style={{
            transform: `translateX(${dragOffset}px)`,
            transition: animating && !isDragging ? "transform 0.45s cubic-bezier(.25,.85,.35,1)" : "none",
            gap: `${CARD_GAP}px`,
          }}
          onTransitionEnd={() => setAnimating(false)}
        >
          {slides.map((slide, index) => {
            // How far this card is from center (fractional)
            const dist = Math.abs(index - progress)
            const scale = lerp(1, 0.85, clamp(dist, 0, 1))
            const opacity = lerp(1, 0.5, clamp(dist, 0, 1))

            return (
              <div
                key={index}
                className="relative flex-shrink-0 rounded-3xl overflow-hidden"
                style={{
                  width: CARD_W,
                  height: 360,
                  transform: `scale(${scale})`,
                  opacity,
                  transition: isDragging ? "none" : "transform 0.45s cubic-bezier(.25,.85,.35,1), opacity 0.45s ease",
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
            onClick={() => setOnboardingStep(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === onboardingStep
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
