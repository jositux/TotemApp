"use client"

import React, { useState, useRef, useMemo, useEffect } from "react"
import { Check } from "lucide-react"
import { TelcelHeader } from "@/components/shared/telcel-header"
import { StepHeader } from "@/components/shared/step-header" // <--- Importamos el nuevo componente
import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/use-app"

const COMBOS_DATA = [
  { id: "1", name: "Combo Inicial" },
  { id: "2", name: "Combo Pro Plus" },
  { id: "3", name: "Combo Elite" }
]

const MICAS = [
  { 
    id: "m1", 
    name: "Basic protection", 
    price: 0, 
    image: "https://imagedelivery.net/example/mica-basic.png", 
    desc: "Este protector de pantalla, de confianza para muchos, garantiza una protección contra arañazos y manchas.",
    specs: { modelPlus: "Resistente a caídas desde 1,5 metros", model: "MICA UNIVERSAL PRO", brand: "Primo Protect", compat: "Universal", color: "Transparente" }
  },
  { 
    id: "m2", 
    name: "Premium Privacy", 
    price: 150, 
    image: "https://imagedelivery.net/example/mica-privacy.png",
    desc: "Protección total con filtro de privacidad para que solo tú veas tu pantalla y evites miradas indiscretas.",
    specs: { modelPlus: "Antiespía 180°", model: "PRIVACY GLASS PRO", brand: "Primo Protect", compat: "iPhone 17 Pro", color: "Tinte Oscuro" }
  }
]

export function MicaSelector() {
  const { setStep, selection, updateSelection, isHydrated } = useApp()
  
  // Inicializamos el índice basándonos en lo que ya está guardado en Jotai
  const [activeIdx, setActiveIdx] = useState(() => {
    if (selection.micaId) {
      const saved = MICAS.findIndex(m => m.id === selection.micaId)
      return saved !== -1 ? saved : 0
    }
    return 0
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  // Sincronizar el scroll físico al montar si ya hay una selección
  useEffect(() => {
    if (isHydrated && selection.micaId && scrollRef.current) {
      const savedIdx = MICAS.findIndex(m => m.id === selection.micaId)
      if (savedIdx !== -1) {
        const container = scrollRef.current
        const itemWidth = container.offsetWidth * 0.8
        container.scrollTo({ left: savedIdx * itemWidth, behavior: "instant" })
      }
    }
  }, [isHydrated])

  const selectedComboName = useMemo(() => {
    const found = COMBOS_DATA.find(c => c.id === selection.comboId)
    return found ? found.name : "Combo seleccionado"
  }, [selection.comboId])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrolling.current) return
    const container = e.currentTarget
    const itemWidth = container.offsetWidth * 0.8
    const newIdx = Math.round(container.scrollLeft / itemWidth)
    if (newIdx !== activeIdx && newIdx < MICAS.length) {
      setActiveIdx(newIdx)
    }
  }

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      isScrolling.current = true
      setActiveIdx(index)
      const container = scrollRef.current
      const itemWidth = container.offsetWidth * 0.8
      container.scrollTo({ left: index * itemWidth, behavior: "smooth" })
      setTimeout(() => { isScrolling.current = false }, 500)
    }
  }

  if (!isHydrated) return null

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <TelcelHeader />

      {/* REEMPLAZO DEL HEADER MANUAL POR EL COMPONENTE REUTILIZABLE */}
      <StepHeader 
        currentStepNumber={3}
        totalSteps={6}
        title="Selecciona tu Mica"
        subtitle="Siguiente: Selecciona tu Case"
        backTo="combo-selector"
      />

      {/* Stepper Superior Visual (Sub-pasos) */}
      <div className="flex justify-around px-10 py-5 bg-white/30 relative">
         <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3/4 h-[1.5px] bg-slate-200 -z-10" />
         {[ {n: "Mica", active: true}, {n: "Case", active: false}, {n: "Imagen", active: false} ].map((step, i) => (
           <div key={i} className="flex flex-col items-center gap-2">
             <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${step.active ? "bg-white border-slate-900 shadow-sm" : "bg-white border-slate-200"}`}>
               {step.active ? <Check className="w-4 h-4 text-slate-900" strokeWidth={3} /> : null}
             </div>
             <span className={`text-[11px] font-bold ${step.active ? "text-slate-900" : "text-slate-300"}`}>{step.n}</span>
           </div>
         ))}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar h-[440px] items-center px-[10%]"
        >
          {MICAS.map((mica, idx) => (
            <div key={mica.id} onClick={() => scrollToCard(idx)} className="min-w-[80%] flex justify-center px-3 snap-center cursor-pointer">
              <div className={`relative w-full bg-white rounded-[2.5rem] p-6 shadow-xl border-2 transition-all duration-500 ${activeIdx === idx ? "border-[#6b21a8] scale-100 opacity-100" : "border-transparent opacity-40 scale-90 blur-[0.5px]"}`}>
                
                <div className={`absolute top-6 right-6 z-20 rounded-full w-8 h-8 flex items-center justify-center border transition-colors ${activeIdx === idx ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-slate-100"}`}>
                  <Check className={`w-5 h-5 ${activeIdx === idx ? "text-[#6b21a8]" : "text-slate-200"}`} strokeWidth={3} />
                </div>

                <div className="h-44 flex justify-center items-center mb-4">
                  <img src={mica.image} className="h-full object-contain" alt={mica.name} />
                </div>

                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-xl text-slate-900">{mica.name}</h3>
                  <span className="font-bold text-xl text-slate-900">+{mica.price === 0 ? "$0" : `$${mica.price}`}</span>
                </div>
                
                <p className="text-[11px] text-slate-500 mb-4 leading-relaxed line-clamp-2">{mica.desc}</p>

                <div className="space-y-1 text-[10px]">
                  <p><span className="font-bold text-slate-700">Modelo PLUS:</span> <span className="text-slate-400 font-medium">{mica.specs.modelPlus}</span></p>
                  <p><span className="font-bold uppercase text-slate-700">Modelo:</span> <span className="text-slate-400 font-medium">{mica.specs.model}</span></p>
                  <p><span className="font-bold uppercase text-slate-700">Marca:</span> <span className="text-slate-400 font-medium">{mica.specs.brand}</span></p>
                  <p><span className="font-bold uppercase text-slate-700">Compatibilidad:</span> <span className="text-slate-400 font-medium">{mica.specs.compat}</span></p>
                  <p><span className="font-bold uppercase text-slate-700">Color:</span> <span className="text-slate-400 font-medium">{mica.specs.color}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-2 mb-4">
          {MICAS.map((_, i) => (
            <button key={i} onClick={() => scrollToCard(i)} className={`h-2 rounded-full transition-all duration-300 ${activeIdx === i ? "w-8 bg-[#1e62c1]" : "w-2 bg-slate-300"}`} />
          ))}
        </div>
      </main>

      <footer className="p-6 bg-[#f1f5f9] rounded-t-[3rem] shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center mb-4">
          <div className="flex-1 overflow-hidden pr-2">
            <p className="font-bold text-slate-900 text-sm mb-0.5">Detalles de tu pedido</p>
            <p className="text-slate-500 text-[11px] font-medium italic truncate">
              {selection.brand}, {selection.model}, {selectedComboName}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Desde</p>
            <p className="text-2xl font-bold text-slate-900">$699</p> 
          </div>
        </div>
        <Button 
          onClick={() => {
            updateSelection({ micaId: MICAS[activeIdx].id })
            setStep("case-selector") 
          }}
          className="w-full h-16 rounded-[2rem] bg-[#6b21a8] text-white font-bold text-xl shadow-lg active:scale-95 transition-all"
        >
          Siguiente
        </Button>
      </footer>
    </div>
  )
}