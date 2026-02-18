"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { Search, ChevronRight, Smartphone, Trash2, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "@/hooks/use-app"
import { useAtom } from "jotai"
import { missingBrandsAtom, missingModelsAtom } from "@/lib/store"

const PHONE_DATA = {
  "Samsung": ["Galaxy S24 Ultra", "Galaxy A54", "Galaxy S23"],
  "Apple - iPhone": ["17 Pro", "16 Plus", "iPhone 15 Pro Max"],
  "Motorola": ["Moto G84", "Edge 40 Neo"],
  "Xiaomi": ["Redmi Note 13 Pro", "Xiaomi 14"]
}

export default function PhoneSelectorPage() {
  const { selection, updateSelection, isHydrated } = useApp()
  const [activePanel, setActivePanel] = useState<"none" | "brand" | "model">("none")
  const [search, setSearch] = useState("")
  
  const [, setMissingBrands] = useAtom(missingBrandsAtom)
  const [, setMissingModels] = useAtom(missingModelsAtom)

  // Referencia para no repetir el último término guardado en esta sesión
  const lastLoggedTerm = useRef("")

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

  // Lógica inteligente de registro
  const logMissingSearch = (termToLog: string) => {
    const term = termToLog.trim();
    
    // Validaciones: 
    // 1. Al menos 3 caracteres
    // 2. Que no haya resultados reales
    // 3. Que no sea lo mismo que acabamos de guardar
    if (term.length < 3 || filteredItems.length > 0 || term === lastLoggedTerm.current) return;

    if (activePanel === "brand") {
      setMissingBrands(prev => prev.includes(term) ? prev : [...prev, term]);
      lastLoggedTerm.current = term;
    } else if (activePanel === "model" && brandSelected) {
      const entry = `${brandSelected}: ${term}`;
      setMissingModels(prev => prev.includes(entry) ? prev : [...prev, entry]);
      lastLoggedTerm.current = term; // Evitamos duplicar en el próximo borrado
    }
  };

  // EFECTO INTELIGENTE: Debounce
  // Si el usuario deja de escribir por 1.5 segundos y no hay resultados, guardamos.
  useEffect(() => {
    if (search.length >= 3 && filteredItems.length === 0) {
      const timer = setTimeout(() => {
        logMissingSearch(search);
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [search, filteredItems.length]);

  if (!isHydrated) return null

  const handleClose = () => {
    if (search) logMissingSearch(search);
    setActivePanel("none");
    setSearch("");
    lastLoggedTerm.current = ""; // Reset al cerrar
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      <main className="flex-1 p-5 space-y-4 overflow-y-auto">
        {/* Selector de Marca */}
        <div 
          onClick={() => { setActivePanel("brand"); lastLoggedTerm.current = ""; }} 
          className={`bg-white p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-2 
            ${brandSelected ? "border-[#6b21a8] ring-1 ring-[#6b21a8]/20 shadow-md" : "border-slate-100 shadow-sm"}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${brandSelected ? "bg-purple-50 text-[#6b21a8]" : "bg-slate-50 text-slate-400"}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 flex-1 text-sm uppercase tracking-wide">Marca</span>
            <ChevronRight className="text-[#6b21a8] w-5 h-5" />
          </div>
          {brandSelected && (
            <div className="bg-purple-50 text-[#6b21a8] px-4 py-2 rounded-2xl text-sm font-bold w-fit border border-purple-100 flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
              {brandSelected} 
              <button onClick={(e) => { 
                e.stopPropagation(); 
                updateSelection({ brand: null, model: null }); 
              }}>
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Selector de Modelo */}
        <div 
          onClick={() => { if(brandSelected) { setActivePanel("model"); lastLoggedTerm.current = ""; } }} 
          className={`bg-white p-5 rounded-3xl border-2 transition-all flex flex-col gap-2 
            ${modelSelected ? "border-[#6b21a8] ring-1 ring-[#6b21a8]/20 shadow-md" : "border-slate-100 shadow-sm"} 
            ${!brandSelected && "opacity-40 cursor-not-allowed"}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${modelSelected ? "bg-purple-50 text-[#6b21a8]" : "bg-slate-50 text-slate-400"}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 flex-1 text-sm uppercase tracking-wide">Modelo</span>
            <ChevronRight className="text-[#6b21a8] w-5 h-5" />
          </div>
          {modelSelected && (
            <div className="bg-purple-50 text-[#6b21a8] px-4 py-2 rounded-2xl text-sm font-bold w-fit border border-purple-100 flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
              {modelSelected} 
              <button onClick={(e) => { 
                e.stopPropagation(); 
                updateSelection({ model: null }); 
              }}>
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
              </button>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {activePanel !== "none" && (
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }} 
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="p-4 flex items-center gap-4 border-b pt-10">
              <button onClick={handleClose} className="p-2 bg-slate-50 rounded-full">
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
                  className="w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 outline-none border border-slate-100 focus:ring-2 focus:ring-purple-200" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
              
              <div className="grid gap-3">
                {filteredItems.map(item => (
                  <button 
                    key={item} 
                    onClick={() => { 
                      if(activePanel === "brand") {
                        updateSelection({ brand: item, model: null });
                      } else {
                        updateSelection({ model: item });
                      }
                      setActivePanel("none"); 
                      setSearch(""); 
                    }} 
                    className="w-full text-left p-5 rounded-2xl bg-white border border-slate-100 font-bold text-slate-800 flex justify-between items-center group"
                  >
                    {item} 
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-[#6b21a8] transition-colors" />
                  </button>
                ))}

                {search.length >= 3 && filteredItems.length === 0 && (
                   <div className="p-10 text-center animate-in fade-in zoom-in duration-300">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-200" />
                     </div>
                     <p className="text-slate-400 font-bold text-sm">No encontramos "{search}"</p>
                     <p className="text-slate-300 text-[10px] uppercase mt-1 tracking-widest">Lo anotaremos para conseguirlo</p>
                   </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}