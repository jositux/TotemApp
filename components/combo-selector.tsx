"use client"

import React, { useState, useRef, useEffect } from "react"
import { Check } from "lucide-react"
import { TelcelHeader } from "@/components/shared/telcel-header"
import { StepHeader } from "@/components/shared/step-header"
import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/use-app"

const COMBOS = [
  { id: "1", name: "Combo Inicial", price: 899, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbea?q=80&w=400", desc: "Lo esencial para proteger tu equipo desde el primer día." },
  { id: "2", name: "Combo Pro Plus", price: 1250, image: "https://images.unsplash.com/photo-1556656793-062ff98782ee?q=80&w=400", desc: "Protección total con los mejores accesorios premium." },
  { id: "3", name: "Combo Elite", price: 1599, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=400", desc: "Carga rápida y protección militar en un solo paquete." }
]

export function ComboSelector() {
  const { setStep, selection, updateSelection, isHydrated } = useApp()
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  // 1. Sincronización Inicial: Solo ocurre cuando se monta el componente
  useEffect(() => {
    if (isHydrated) {
      const savedIdx = selection.comboId 
        ? COMBOS.findIndex(c => c.id === selection.comboId) 
        : 0;

      const targetIdx = savedIdx === -1 ? 0 : savedIdx;
      setActiveIdx(targetIdx)
      
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const container = scrollRef.current
          const cardWidth = container.scrollWidth / COMBOS.length
          container.scrollTo({
            left: targetIdx * cardWidth,
            behavior: "instant"
          })
        }
      })
    }
  }, [isHydrated]) // Solo al hidratar

  // 2. FUNCIÓN CLAVE: Actualiza el store mientras el usuario desliza
  const handleActiveChange = (newIdx: number) => {
    if (newIdx !== activeIdx && newIdx >= 0 && newIdx < COMBOS.length) {
      setActiveIdx(newIdx)
      // Guardamos inmediatamente en el store para que no se pierda al ir atrás
      updateSelection({ comboId: COMBOS[newIdx].id })
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrolling.current) return
    const container = e.currentTarget
    const scrollPos = container.scrollLeft
    const cardWidth = container.scrollWidth / COMBOS.length
    const newIdx = Math.round(scrollPos / cardWidth)
    
    handleActiveChange(newIdx)
  }

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      isScrolling.current = true
      handleActiveChange(index)
      const container = scrollRef.current
      const cardWidth = container.scrollWidth / COMBOS.length
      container.scrollTo({ left: index * cardWidth, behavior: "smooth" })
      
      setTimeout(() => { isScrolling.current = false }, 500)
    }
  }

  if (!isHydrated) return null

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <TelcelHeader />

      <StepHeader 
        currentStepNumber={2}
        title="Selecciona tu combo"
        subtitle="Siguiente: Mica"
        backTo="phone-selector"
      />

      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar h-[480px] items-center px-[10%]"
        >
          {COMBOS.map((combo, idx) => (
            <div 
              key={combo.id} 
              onClick={() => scrollToCard(idx)} 
              className="min-w-[80%] flex justify-center px-3 snap-center cursor-pointer h-full items-center"
            >
              <div className={`relative w-full bg-white rounded-[2.5rem] p-5 shadow-xl border-2 transition-all duration-500 ${activeIdx === idx ? "border-[#6b21a8] scale-100 opacity-100" : "border-transparent scale-90 opacity-40 blur-[0.5px]"}`}>
                
                {activeIdx === idx && (
                  <div className="absolute top-8 right-8 z-20 bg-[#6b21a8] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </div>
                )}

                <div className="h-44 bg-slate-100 rounded-3xl mb-4 overflow-hidden">
                  <img src={combo.image} className="w-full h-full object-cover" alt={combo.name} />
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-slate-900">{combo.name}</h3>
                  <span className="font-bold text-xl text-slate-900">${combo.price}</span>
                </div>
                
                <p className="text-[11px] text-slate-400 mb-5 leading-relaxed">{combo.desc}</p>

                <div className="space-y-3">
                  {["Mica", "Case", "Imagen"].map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                         <div className="w-6 h-6 bg-slate-200 rounded-md" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 leading-none">{item}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Incluido en el combo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 mt-4 mb-4">
          {COMBOS.map((_, i) => (
            <button 
              key={i} 
              onClick={() => scrollToCard(i)} 
              className={`h-2.5 rounded-full transition-all duration-500 ${activeIdx === i ? "w-10 bg-[#1e62c1]" : "w-2.5 bg-slate-300"}`} 
            />
          ))}
        </div>
      </main>

      <footer className="p-6 shrink-0 bg-[#f1f5f9] rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center mb-4">
          <div className="flex-1 overflow-hidden pr-2">
            <p className="font-bold text-slate-900 text-sm mb-0.5">Detalles de tu pedido</p>
            <p className="text-slate-500 text-[11px] font-medium italic truncate">
              {selection.brand || "Marca"}, {selection.model || "Modelo"}
            </p>
            <p className="text-[#6b21a8] text-[10px] font-bold uppercase mt-0.5">
              {COMBOS[activeIdx].name}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold uppercase text-slate-400">Subtotal</p>
            <p className="text-2xl font-bold text-slate-900">${COMBOS[activeIdx].price}</p>
          </div>
        </div>

        <Button 
          onClick={() => {
            // Ya se guardó durante el scroll, pero esto asegura la transición de paso
            setStep("mica-selector") 
          }} 
          className="w-full h-16 rounded-[2rem] bg-[#6b21a8] text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
        >
          Siguiente
        </Button>
      </footer>
    </div>
  )
}