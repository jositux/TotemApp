"use client"

import { useApp } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const slides = [
  {
    title: "Personaliza tu estilo",
    subtitle: "con fundas únicas",
    description: "Descubre las mejores fundas para tu smartphone con diseños exclusivos y protección premium.",
    image: "/onboarding-1.jpg"
  },
  {
    title: "Miles de diseños",
    subtitle: "para elegir",
    description: "Explora nuestra colección con diseños para todos los gustos. Encuentra el estilo perfecto que refleje tu personalidad.",
    image: "/onboarding-2.jpg"
  },
  {
    title: "Envío rápido",
    subtitle: "a tu puerta",
    description: "Recibe tu pedido en 24-48 horas. Empaque seguro y envío gratis en compras mayores a $500.",
    image: "/onboarding-3.jpg"
  }
]

export function Onboarding() {
  const { onboardingStep, setOnboardingStep, setStep } = useApp()

  const handleNext = () => {
    if (onboardingStep < slides.length - 1) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      setStep("auth")
    }
  }

  const handleSkip = () => {
    setStep("auth")
  }

  const handleCardClick = (index: number) => {
    setOnboardingStep(index)
  }

  const currentSlide = slides[onboardingStep]

  const getCardStyle = (index: number) => {
    const diff = index - onboardingStep
    
    if (diff === 0) {
      return {
        transform: "translateX(0) scale(1) rotateY(0deg)",
        zIndex: 30,
        opacity: 1,
      }
    } else if (diff === 1 || (diff === -2 && onboardingStep === 2)) {
      return {
        transform: "translateX(65%) scale(0.85) rotateY(-15deg)",
        zIndex: 20,
        opacity: 0.7,
      }
    } else if (diff === -1 || (diff === 2 && onboardingStep === 0)) {
      return {
        transform: "translateX(-65%) scale(0.85) rotateY(15deg)",
        zIndex: 20,
        opacity: 0.7,
      }
    } else {
      return {
        transform: "translateX(0) scale(0.7)",
        zIndex: 10,
        opacity: 0,
      }
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-primary via-primary to-accent overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4">
        <span className="text-primary-foreground font-bold text-xl">CaseShop</span>
        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="text-primary-foreground hover:bg-white/10"
        >
          Omitir
        </Button>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Card Deck Carousel */}
        <div className="relative w-full h-[400px] mb-6 flex items-center justify-center" style={{ perspective: "1000px" }}>
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className="absolute w-56 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transition-all duration-500 ease-out cursor-pointer hover:shadow-3xl"
              style={{
                ...getCardStyle(index),
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </button>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-primary-foreground uppercase tracking-wide">
          {currentSlide.title}
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wide">
          {currentSlide.subtitle}
        </h2>
        <p className="text-primary-foreground/70 text-base max-w-xs text-pretty leading-relaxed">
          {currentSlide.description}
        </p>
      </div>

      {/* Navigation */}
      <div className="relative z-10 p-6">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setOnboardingStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === onboardingStep 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/40"
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-full h-14 bg-white text-primary hover:bg-white/90 font-semibold text-lg rounded-xl"
        >
          {onboardingStep === slides.length - 1 ? "Comenzar" : "Siguiente"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
