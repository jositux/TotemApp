"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Check, ShieldCheck, Smartphone, Image as ImageIcon } from "lucide-react"
import { useApp } from "@/hooks/use-app"

const COMBOS = [
  { id: "combo1", name: "Combo 1", price: 899, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbea?q=80&w=400", desc: "Mica + Case + Imagen", includes: ["Mica", "Case", "Imagen"] },
  { id: "combo2", name: "Combo 2", price: 699, image: "https://images.unsplash.com/photo-1556656793-062ff98782ee?q=80&w=400", desc: "Mica + Case", includes: ["Mica", "Case"] },
  { id: "combo3", name: "Combo 3", price: 599, image: "https://images.unsplash.com/photo-1541140532154-b024d715b909?q=80&w=400", desc: "Case + Imagen", includes: ["Case", "Imagen"] },
  { id: "combo4", name: "Combo 4", price: 299, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=400", desc: "Solo Mica", includes: ["Mica"] },
  { id: "combo5", name: "Combo 5", price: 399, image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=400", desc: "Solo Case", includes: ["Case"] }
]

export default function ComboSelector() {
  const { selection, updateSelection, isHydrated } = useApp()
  const [activeIdx, setActiveIdx] = useState(() => {
    const idx = COMBOS.findIndex(c => c.id === selection.comboId)
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

  useEffect(() => {
    if (isHydrated && !isInitialMounted.current) {
      const savedIdx = COMBOS.findIndex(c => c.id === selection.comboId)
      const targetIdx = savedIdx === -1 ? 0 : savedIdx
      centerCard(targetIdx, "instant")
      isInitialMounted.current = true
    }
  }, [isHydrated, centerCard, selection.comboId])

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
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        updateSelection({ comboId: COMBOS[closestIdx].id })
      }, 150)
    }
  }

  if (!isHydrated) return null

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Estilos para ocultar el scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden pt-4">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar items-stretch px-[15%] py-4 scroll-smooth"
        >
          {COMBOS.map((combo, idx) => (
            <div 
              key={combo.id}
              ref={(el) => { cardsRef.current[idx] = el }}
              onClick={() => centerCard(idx)} 
              className="min-w-[85%] flex justify-center px-3 snap-center cursor-pointer touch-pan-x"
            >
              <div className={`relative w-full bg-white rounded-[2.5rem] p-5 shadow-md border-2 transition-all duration-300 flex flex-col h-full
                ${activeIdx === idx ? "border-[#6b21a8] scale-100 z-10 shadow-xl" : "border-transparent scale-90 opacity-40"}`}
              >
                {activeIdx === idx && (
                  <div className="absolute top-4 right-4 z-20 bg-[#6b21a8] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                    <Check className="w-5 h-5" strokeWidth={4} />
                  </div>
                )}
                
                <div className="h-32 bg-slate-50 rounded-3xl mb-4 overflow-hidden border border-slate-100 shrink-0">
                  <img src={combo.image} className="w-full h-full object-cover" alt={combo.name} />
                </div>
                
                <div className="flex justify-between items-start mb-2 shrink-0 px-1">
                  <div>
                    <h3 className="font-black text-xl text-slate-900 leading-tight">{combo.name}</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{combo.desc}</p>
                  </div>
                  <span className="font-black text-xl text-[#6b21a8]">${combo.price}</span>
                </div>

                <div className="mt-4 space-y-2.5 flex-1 overflow-y-auto hide-scrollbar">
                  {combo.includes.map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-8 h-8 rounded-xl bg-white text-[#6b21a8] flex items-center justify-center shadow-sm shrink-0">
                         {item === "Mica" && <ShieldCheck className="w-5 h-5" />}
                         {item === "Case" && <Smartphone className="w-5 h-5" />}
                         {item === "Imagen" && <ImageIcon className="w-5 h-5" />}
                      </div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{item} Incluida</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-2.5 py-6 shrink-0">
          {COMBOS.map((_, i) => (
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