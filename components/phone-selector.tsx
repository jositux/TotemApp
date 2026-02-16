"use client"

import React, { useState, useMemo } from "react"
import { Search, ChevronRight, Smartphone, Trash2, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/use-app"

const PHONE_DATA = {
  "Samsung": ["Galaxy S24 Ultra", "Galaxy A54", "Galaxy S23"],
  "Apple - iPhone": ["17 Pro", "16 Plus", "iPhone 15 Pro Max"],
  "Motorola": ["Moto G84", "Edge 40 Neo"],
  "Xiaomi": ["Redmi Note 13 Pro", "Xiaomi 14"]
}

export default function PhoneSelectorPage() {
  // Extraemos progress para el contador dinámico
  const { setStep, selection, updateSelection, isHydrated, progress } = useApp()
  
  const [activePanel, setActivePanel] = useState<"none" | "brand" | "model">("none")
  const [search, setSearch] = useState("")

  const brandSelected = selection.brand
  const modelSelected = selection.model

  const filteredItems = useMemo(() => {
    if (activePanel === "brand") {
      return Object.keys(PHONE_DATA).filter(b => b.toLowerCase().includes(search.toLowerCase()))
    }
    if (activePanel === "model" && brandSelected) {
      return (PHONE_DATA[brandSelected as keyof typeof PHONE_DATA] || []).filter(m => 
        m.toLowerCase().includes(search.toLowerCase())
      )
    }
    return []
  }, [activePanel, search, brandSelected])

  if (!isHydrated) return null

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      <main className="flex-1 p-5 space-y-4 overflow-y-auto">
        {/* Selector de Marca */}
        <div 
          onClick={() => setActivePanel("brand")} 
          className={`bg-white p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-2 
            ${brandSelected ? "border-[#1e62c1] ring-1 ring-[#1e62c1]/20 shadow-md" : "border-slate-100 shadow-sm"}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${brandSelected ? "bg-blue-50 text-[#1e62c1]" : "bg-slate-50 text-slate-400"}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 flex-1 text-sm uppercase tracking-wide">Marca</span>
            <ChevronRight className="text-[#1e62c1] w-5 h-5" />
          </div>
          {brandSelected && (
            <div className="bg-blue-50 text-[#1e62c1] px-4 py-2 rounded-2xl text-sm font-bold w-fit border border-blue-100 flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
              {brandSelected} 
              <button onClick={(e) => { e.stopPropagation(); updateSelection({ brand: null, model: null }); }}>
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600 transition-colors" />
              </button>
            </div>
          )}
        </div>

        {/* Selector de Modelo */}
        <div 
          onClick={() => brandSelected && setActivePanel("model")} 
          className={`bg-white p-5 rounded-3xl border-2 transition-all flex flex-col gap-2 
            ${modelSelected ? "border-[#1e62c1] ring-1 ring-[#1e62c1]/20 shadow-md" : "border-slate-100 shadow-sm"} 
            ${!brandSelected && "opacity-40 cursor-not-allowed"}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${modelSelected ? "bg-blue-50 text-[#1e62c1]" : "bg-slate-50 text-slate-400"}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 flex-1 text-sm uppercase tracking-wide">Modelo</span>
            <ChevronRight className="text-[#1e62c1] w-5 h-5" />
          </div>
          {modelSelected && (
            <div className="bg-blue-50 text-[#1e62c1] px-4 py-2 rounded-2xl text-sm font-bold w-fit border border-blue-100 flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
              {modelSelected} 
              <button onClick={(e) => { e.stopPropagation(); updateSelection({ model: null }); }}>
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600 transition-colors" />
              </button>
            </div>
          )}
        </div>
      </main>


      {/* Panel Lateral Animado */}
      <AnimatePresence>
        {activePanel !== "none" && (
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }} 
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="p-4 flex items-center gap-4 border-b pt-10">
              <button onClick={() => { setActivePanel("none"); setSearch(""); }} className="p-2 bg-slate-50 rounded-full">
                 <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <h3 className="text-xl font-black flex-1 text-center pr-10 text-slate-900">
                {activePanel === "brand" ? "Marcas" : "Modelos"}
              </h3>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  autoFocus 
                  placeholder={`Buscar ${activePanel === "brand" ? "marca" : "modelo"}...`}
                  className="w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1e62c1]/20 transition-all border border-slate-100" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
              
              <div className="grid gap-3">
                {filteredItems.map(item => (
                  <button 
                    key={item} 
                    onClick={() => { 
                      if(activePanel === "brand") updateSelection({ brand: item, model: null }); 
                      else updateSelection({ model: item }); 
                      setActivePanel("none"); 
                      setSearch(""); 
                    }} 
                    className="w-full text-left p-5 rounded-2xl bg-white border border-slate-100 font-bold text-slate-800 flex justify-between items-center group"
                  >
                    {item} 
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-[#1e62c1] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}