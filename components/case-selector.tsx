"use client"

import React, { useState, useEffect, useRef } from "react"
import { ShieldCheck } from "lucide-react"
import { ColorSelector } from "@/components/shared/color-selector"
import { useApp } from "@/hooks/use-app"
import { motion, AnimatePresence } from "framer-motion"

const CASE_DATA = {
  Naranja: { gallery: ["https://plus.unsplash.com/premium_photo-1705346737943-34988217b3ad?q=80&w=774", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800", "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800"] },
  Verde: { gallery: ["https://images.unsplash.com/photo-1619510077427-fb14470ce48e?q=80&w=774", "https://images.unsplash.com/photo-1583573636246-18cb2246697f?q=80&w=800", "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800"] },
  Azul: { gallery: ["https://images.unsplash.com/photo-1547658718-f4311ad64746?w=800", "https://images.unsplash.com/photo-1619510077427-fb14470ce48e?q=80&w=774", "https://images.unsplash.com/photo-1583573636246-18cb2246697f?q=80&w=800"] },
  Morado: { gallery: ["https://images.unsplash.com/photo-1619510077760-be2e843e258a?q=80&w=774", "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800"] },
  Amarillo: { gallery: ["https://images.unsplash.com/photo-1618177940986-0e9c1745bc0f?q=80&w=2070", "https://images.unsplash.com/photo-1619510077427-fb14470ce48e?q=80&w=774", "https://images.unsplash.com/photo-1583573636246-18cb2246697f?q=80&w=800"] },
}

export default function CaseSelector() {
  const { selection, updateSelection, isHydrated } = useApp()
  const [selectedType, setSelectedType] = useState("Flexi")
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    if (isHydrated && selection.caseType) setSelectedType(selection.caseType)
  }, [isHydrated, selection.caseType])

  // Resetear índice al cambiar de color
  useEffect(() => { setImgIdx(0) }, [selection.caseColor])

  const activeColor = (selection.caseColor as keyof typeof CASE_DATA) || "Naranja"
  const images = CASE_DATA[activeColor]?.gallery || CASE_DATA.Naranja.gallery

  if (!isHydrated) return null

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipeThreshold = 50
    if (offset.x < -swipeThreshold && imgIdx < images.length - 1) setImgIdx(imgIdx + 1)
    else if (offset.x > swipeThreshold && imgIdx > 0) setImgIdx(imgIdx - 1)
  }

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      <main className="flex-1 overflow-y-auto px-5 no-scrollbar pb-10">
        
        {/* HEADER AREA CON CARRUSEL */}
        <div className="flex gap-5 items-center mb-6 pt-6">
          <div className="relative w-[48%] shrink-0">
            {/* Contenedor Carrusel */}
            <div className="aspect-[1/1] rounded-[2.2rem] overflow-hidden bg-white border border-slate-100 shadow-xl relative touch-none">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${activeColor}-${imgIdx}`}
                  src={images[imgIdx]}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                />
              </AnimatePresence>

              {/* Dots / Puntos indicadores */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                {images.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${imgIdx === i ? "w-4 bg-white" : "w-1 bg-white/40"}`} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6b21a8]" />
              <span className="text-[10px] font-black text-[#6b21a8] uppercase tracking-wider">Certificado</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">{selectedType}</h3>
            <p className="text-xs font-bold text-slate-400">Silicona Liquida Premium</p>
          </div>
        </div>

        {/* Selector de tipo (Tabs) */}
        <div className="flex p-1.5 bg-slate-200/50 rounded-2xl mb-8 border border-slate-200">
          {["Flexi", "Bumper", "Cut Out"].map((type) => (
            <button 
              key={type} 
              onClick={() => { setSelectedType(type); updateSelection({ caseType: type }); }} 
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all 
                ${selectedType === type ? "bg-white text-[#6b21a8] shadow-sm scale-[1.02]" : "text-slate-500"}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Selector de Color */}
        <div className="border-slate-100">
          <div className="flex justify-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <ColorSelector layout="flex" />
          </div>
        </div>

        {/* Texto descriptivo extra para llenar espacio si es necesario */}
        <p className="mt-6 text-[11px] text-center text-slate-400 leading-relaxed px-4">
          Nuestras fundas están diseñadas para absorber impactos y proteger la cámara de tu {selection.model || "celular"}.
        </p>

      </main>
    </div>
  )
}