"use client"

import { useState, useRef, useEffect } from "react"
import { useApp } from "@/lib/store-context"
import { Button } from "@/components/ui/button"

const slides = [
  {
    label: "Personaliza",
    title: "Personaliza la\nprotección de\ntu celular",
    description:
      "Crea una protección única combinando seguridad, diseño y tecnología en minutos, directamente en tienda.",
    image: "/onboarding-1.jpg",
  },
  {
    label: "Protege",
    title: "Protege tu\ncelular con\nestilo único",
    description:
      "Elige entre cientos de diseños y materiales premium que se adaptan a tu personalidad y estilo de vida.",
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

export function Onboarding() {
  const { onboardingStep, setOnboardingStep, setStep } = useApp()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

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

  // Scroll to the active card when step changes
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const cardWidth = 260
    const gap = 16
    const containerWidth = container.offsetWidth
    const scrollTo =
      onboardingStep * (cardWidth + gap) - (containerWidth - cardWidth) / 2
    container.scrollTo({ left: Math.max(0, scrollTo), behavior: "smooth" })
  }, [onboardingStep])

  // Detect which card is most visible after scroll ends
  const handleScrollEnd = () => {
    const container = scrollRef.current
    if (!container || isDragging) return
    const cardWidth = 260
    const gap = 16
    const scrollPos = container.scrollLeft
    const containerWidth = container.offsetWidth
    const centerPos = scrollPos + containerWidth / 2
    const index = Math.round((centerPos - cardWidth / 2) / (cardWidth + gap))
    const clamped = Math.max(0, Math.min(slides.length - 1, index))
    if (clamped !== onboardingStep) {
      setOnboardingStep(clamped)
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-[#4a1a8a] via-[#5b2d9e] to-[#7b3fb5] overflow-hidden">
      {/* Header / Logo */}
      <header className="relative z-10 flex justify-center pt-10 pb-4">
        <span className="text-white font-bold text-3xl italic tracking-tight">
          telcel
        </span>
      </header>

      {/* Card Carousel */}
      <div className="relative z-10 flex-shrink-0">
        <div
          ref={scrollRef}
          onScroll={handleScrollEnd}
          className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Left spacer so first card can center */}
          <div className="flex-shrink-0 w-[calc((100%-260px)/2-8px)]" />
          {slides.map((slide, index) => {
            const isActive = index === onboardingStep
            return (
              <button
                key={index}
                type="button"
                onClick={() => setOnboardingStep(index)}
                className={`relative flex-shrink-0 w-[260px] h-[360px] rounded-3xl overflow-hidden snap-center transition-all duration-500 ease-out ${
                  isActive
                    ? "scale-100 opacity-100 shadow-2xl"
                    : "scale-90 opacity-60 shadow-lg"
                }`}
              >
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.label}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Label on card */}
                <span className="absolute bottom-6 left-6 text-white text-2xl font-bold">
                  {slide.label}
                </span>
              </button>
            )
          })}
          {/* Right spacer so last card can center */}
          <div className="flex-shrink-0 w-[calc((100%-260px)/2-8px)]" />
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
