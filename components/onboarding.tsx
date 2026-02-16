"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { useApp } from "@/hooks/use-app" 
import { Button } from "@/components/ui/button"

const slides = [
  {
    label: "Personaliza",
    title: "Personaliza la\nprotección de\ntu celular",
    description: "Crea una protección única combinando seguridad, diseño y tecnología en minutos, directamente en tienda.",
    image: "/onboarding-1.webp",
  },
  {
    label: "Protege",
    title: "Protege tu\ncelular con\nestilo único",
    description: "Elige entre cientos de diseños y materiales premium que se adaptan a tu personalidad y estilo de vida.",
    image: "/onboarding-2.webp",
  },
  {
    label: "Disfruta",
    title: "Disfruta tu\nnueva funda\nal instante",
    description: "Recibe tu funda personalizada en minutos. Sin esperas, sin complicaciones, lista para usar.",
    image: "/onboarding-3.webp",
  },
]

const COUNT = slides.length
const CARD_W = 240
const CARD_GAP = 16
const STEP = CARD_W + CARD_GAP

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

function ringDist(a: number, b: number, m: number) {
  const d = mod(a - b, m)
  return d > m / 2 ? d - m : d
}

export function Onboarding() {
  const { setStep, isHydrated } = useApp()

  const [virtualIndex, setVirtualIndex] = useState(0)
  const [dragDelta, setDragDelta] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [animating, setAnimating] = useState(false)

  const pointerOrigin = useRef(0)
  const velocityRef = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const hasMoved = useRef(false)

  const realIndex = mod(virtualIndex, COUNT)

  const moveBySteps = useCallback((steps: number) => {
    if (steps === 0) return
    setAnimating(true)
    setVirtualIndex((prev) => prev + steps)
    setTimeout(() => setAnimating(false), 450)
  }, [])

  const goToSlide = (targetReal: number) => {
    const diff = ringDist(targetReal, realIndex, COUNT)
    moveBySteps(diff)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    // Si estamos en medio de una animación, no permitimos nuevo drag inmediato
    if (animating) return 
    
    setIsDragging(true)
    setDragDelta(0)
    hasMoved.current = false
    pointerOrigin.current = e.clientX
    lastX.current = e.clientX
    lastTime.current = Date.now()
    
    // Evitamos capturar el puntero aquí para que el onClick del hijo pueda dispararse
    // si el movimiento es mínimo.
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - pointerOrigin.current
    
    // Solo consideramos que "se ha movido" si pasa de 5px (umbral de click)
    if (Math.abs(dx) > 5) {
      hasMoved.current = true
      // Capturamos el puntero solo cuando confirmamos que es un drag
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    
    setDragDelta(-dx)

    const now = Date.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      velocityRef.current = (e.clientX - lastX.current) / dt
    }
    lastX.current = e.clientX
    lastTime.current = now
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    // Si no se movió lo suficiente, dejamos que el onClick del hijo maneje la lógica
    if (!hasMoved.current) {
      setDragDelta(0)
      return
    }

    const rawSteps = dragDelta / STEP
    const velocityBias = clamp(-velocityRef.current * 0.4, -0.5, 0.5)
    const snapped = Math.round(rawSteps + velocityBias)

    setDragDelta(0)
    moveBySteps(snapped)
  }

  const handleStart = () => {
    setStep("phone-selector")
  }

  if (!isHydrated) return <div className="h-screen bg-[#4a1a8a]" />

  const currentSlide = slides[realIndex]

  return (
    <div className="relative flex flex-col h-screen max-h-screen bg-gradient-to-b from-[#4a1a8a] via-[#5b2d9e] to-[#7b3fb5] overflow-hidden select-none">
      <header className="relative z-10 flex justify-center pt-10 pb-4 shrink-0">
        <span className="text-white font-bold text-3xl italic tracking-tight">telcel</span>
      </header>

      {/* Contenedor del Carrusel */}
      <div
        className="relative z-10 shrink-0 touch-none overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: 380 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const slideIdx = mod(virtualIndex + offset, COUNT)
            const slide = slides[slideIdx]
            const pos = offset - dragDelta / STEP
            const dist = Math.abs(pos)

            const opacity = dist < 0.1 ? 1 : clamp(1 - dist * 0.5, 0.3, 0.7)
            const translateX = pos * STEP
            const zIndex = 10 - Math.round(dist)

            return (
              <div
                key={`slide-${virtualIndex + offset}`}
                // El truco está aquí: onClick con stopPropagation
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasMoved.current) {
                    moveBySteps(offset);
                  }
                }}
                className="absolute rounded-3xl overflow-hidden cursor-pointer pointer-events-auto"
                style={{
                  width: CARD_W,
                  height: 360,
                  transform: `translateX(${translateX}px) scale(${1 - dist * 0.05})`,
                  opacity,
                  zIndex,
                  transition: !isDragging 
                    ? "transform 0.45s cubic-bezier(.25,.85,.35,1), opacity 0.45s ease" 
                    : "none",
                }}
              >
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.label}
                  fill
                  sizes={`${CARD_W}px`}
                  priority={offset === 0}
                  className="object-cover pointer-events-none"
                  draggable={false}
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

      {/* Indicadores */}
      <div className="flex justify-center gap-2 py-5 shrink-0">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === realIndex ? "w-8 bg-white" : "w-2.5 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Textos Informativos */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-8 text-center min-h-0">
        <h1 className="text-white text-3xl font-bold leading-tight whitespace-pre-line text-balance">
          {currentSlide.title}
        </h1>
        <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-xs text-pretty">
          {currentSlide.description}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="relative z-10 flex gap-4 px-6 pb-[20px] pt-4 shrink-0">
        <Button
          onClick={() => moveBySteps(1)}
          variant="outline"
          className="flex-1 h-14 rounded-full border-2 border-white/40 bg-transparent text-white text-base font-semibold hover:bg-white/10"
        >
          Siguiente
        </Button>
        <Button
          onClick={handleStart}
          className="flex-1 h-14 rounded-full bg-white text-[#4a1a8a] text-base font-bold hover:bg-white/90 border-none shadow-lg"
        >
          Empezar
        </Button>
      </div>
    </div>
  )
}