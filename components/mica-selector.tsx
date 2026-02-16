"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Check, ShieldCheck } from "lucide-react"
import { useApp } from "@/hooks/use-app"

const MICAS = [
  { 
    id: "m1", 
    name: "Protección Básica", 
    price: 0, 
    image: "https://imagedelivery.net/example/mica-basic.png", 
    desc: "Garantiza una protección total contra arañazos y manchas diarias.",
    specs: { modelPlus: "Caídas 1.5m", model: "MICA UNIVERSAL PRO", brand: "Primo Protect" }
  },
  { 
    id: "m2", 
    name: "Premium Privacy", 
    price: 150, 
    image: "https://imagedelivery.net/example/mica-privacy.png",
    desc: "Filtro de privacidad: solo tú ves la pantalla. Evita miradas indiscretas.",
    specs: { modelPlus: "Antiespía 180°", model: "PRIVACY GLASS PRO", brand: "Primo Protect" }
  },
  { 
    id: "m3", 
    name: "Ultra Armor 360", 
    price: 250, 
    image: "https://imagedelivery.net/example/mica-armor.png",
    desc: "Cristal templado de grado militar con recubrimiento oleofóbico avanzado.",
    specs: { modelPlus: "Caídas 3m", model: "ARMOR GLASS X", brand: "Primo Protect" }
  }
]

export default function MicaSelector() {
  const { selection, updateSelection, isHydrated } = useApp()
  
  // 1. Inicializamos con el valor del Store para evitar que salte a la primera al cargar
  const [activeIdx, setActiveIdx] = useState(() => {
    const idx = MICAS.findIndex(m => m.id === selection.micaId)
    return idx === -1 ? 0 : idx
  })
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const isInitialMounted = useRef(false)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const centerCard = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const container = scrollRef.current
    const card = cardsRef.current[index]
    if (container && card) {
      const targetScroll = card.offsetLeft - (container.offsetWidth / 2) + (card.offsetWidth / 2)
      container.scrollTo({ left: targetScroll, behavior })
    }
  }, [])

  // 2. Posicionamiento inicial al hidratar
  useEffect(() => {
    if (isHydrated && !isInitialMounted.current) {
      const savedIdx = MICAS.findIndex(m => m.id === selection.micaId)
      const targetIdx = savedIdx === -1 ? 0 : savedIdx
      
      // Sin animación para que el usuario no vea el "deslizamiento" al entrar
      centerCard(targetIdx, "instant")
      isInitialMounted.current = true
    }
  }, [isHydrated, centerCard, selection.micaId])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const centerPoint = container.scrollLeft + (container.offsetWidth / 2)
    
    let closestIdx = 0
    let minDistance = Infinity

    cardsRef.current.forEach((card, idx) => {
      if (card) {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2)
        const distance = Math.abs(centerPoint - cardCenter)
        if (distance < minDistance) {
          minDistance = distance
          closestIdx = idx
        }
      }
    })

    if (closestIdx !== activeIdx) {
      setActiveIdx(closestIdx)
      
      // 3. Debounce para actualizar el store y que el footer no parpadee
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        updateSelection({ micaId: MICAS[closestIdx].id })
      }, 150)
    }
  }

  if (!isHydrated) return null

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar items-center px-[12%] py-2 scroll-smooth"
        >
          {MICAS.map((mica, idx) => (
            <div 
              key={mica.id} 
              ref={el => { cardsRef.current[idx] = el }}
              onClick={() => centerCard(idx)} 
              className="min-w-[85%] flex justify-center px-3 snap-center cursor-pointer touch-pan-x"
            >
              <div className={`relative w-full bg-white rounded-[2.5rem] p-6 shadow-md border-2 transition-all duration-300 flex flex-col
                ${activeIdx === idx 
                  ? "border-[#6b21a8] scale-100 z-10 shadow-xl" 
                  : "border-transparent opacity-40 scale-90 z-0"}`}>
                
                {activeIdx === idx && (
                  <div className="absolute top-5 right-5 z-20 bg-[#6b21a8] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                    <Check className="w-5 h-5" strokeWidth={4} />
                  </div>
                )}

                <div className="h-28 flex justify-center items-center mb-6 bg-slate-50 rounded-[2rem] p-4 border border-slate-100 shrink-0 relative overflow-hidden">
                  <ShieldCheck className="w-16 h-16 text-[#6b21a8] opacity-[0.03] absolute" />
                  <img 
                    src={mica.image} 
                    className="h-full object-contain drop-shadow-xl z-10" 
                    alt={mica.name} 
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  {/* Icono de respaldo si no carga la imagen */}
                  <ShieldCheck className="w-10 h-10 text-slate-200" />
                </div>

                <div className="flex justify-between items-start mb-2 shrink-0">
                  <h3 className="font-black text-xl text-slate-900 leading-tight pr-4">{mica.name}</h3>
                  <span className="font-black text-xl text-[#6b21a8] shrink-0">
                    {mica.price === 0 ? "Incluida" : `+$${mica.price}`}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">
                  {mica.desc}
                </p>

                <div className="space-y-3 pt-5 border-t border-slate-100 flex-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black uppercase text-slate-300 tracking-widest">Protección</span>
                    <span className="font-black text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">{mica.specs.modelPlus}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black uppercase text-slate-300 tracking-widest">Marca</span>
                    <span className="font-black text-slate-700">{mica.specs.brand}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2.5 py-6 shrink-0">
          {MICAS.map((_, i) => (
            <button 
              key={i} 
              onClick={() => centerCard(i)}
              className={`h-2 rounded-full transition-all duration-300 ${activeIdx === i ? "w-8 bg-[#6b21a8]" : "w-2 bg-slate-300"}`} 
            />
          ))}
        </div>
      </main>
    </div>
  )
}