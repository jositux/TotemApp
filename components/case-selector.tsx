"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Check, ZoomIn, X } from "lucide-react"
import { TelcelHeader } from "@/components/shared/telcel-header"
import { StepHeader } from "@/components/shared/step-header"
import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/use-app"

// --- RECUPERAMOS TODA TU INFORMACIÓN ---
const COMBOS_DATA = [
  { id: "1", name: "Combo Inicial" },
  { id: "2", name: "Combo Pro Plus" },
  { id: "3", name: "Combo Elite" }
]

const MICAS_DATA = [
  { id: "m1", name: "Basic protection" },
  { id: "m2", name: "Premium Privacy" }
]

const CASE_DATA = {
  Naranja: {
    hex: "#f87171",
    preview: "https://plus.unsplash.com/premium_photo-1705346737943-34988217b3ad?q=80&w=774&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800",
      "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800",
      "https://images.unsplash.com/photo-1583573636246-18cb2246697f?q=80&w=800",
      "https://images.unsplash.com/photo-1623393835885-560a7c576aa2?q=80&w=774"
    ]
  },
  Verde: {
    hex: "#22c55e",
    preview: "https://images.unsplash.com/photo-1619510077427-fb14470ce48e?q=80&w=774",
    gallery: ["https://images.unsplash.com/photo-1619510077427-fb14470ce48e?q=80&w=774", "https://images.unsplash.com/photo-1583573636246-18cb2246697f?q=80&w=800", "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800"]
  },
  Azul: {
    hex: "#3b82f6",
    preview: "https://images.unsplash.com/photo-1547658718-f4311ad64746?w=800",
    gallery: ["https://images.unsplash.com/photo-1619510077427-fb14470ce48e?q=80&w=774", "https://images.unsplash.com/photo-1583573636246-18cb2246697f?q=80&w=800", "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800"]
  },
  Morado: {
    hex: "#a855f7",
    preview: "https://images.unsplash.com/photo-1619510077760-be2e843e258a?q=80&w=774",
    gallery: ["https://images.unsplash.com/photo-1619510077427-fb14470ce48e?q=80&w=774", "https://images.unsplash.com/photo-1583573636246-18cb2246697f?q=80&w=800", "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800"]
  },
  Amarillo: {
    hex: "#eab308",
    preview: "https://images.unsplash.com/photo-1618177940986-0e9c1745bc0f?q=80&w=2070",
    gallery: ["https://images.unsplash.com/photo-1619510077427-fb14470ce48e?q=80&w=774", "https://images.unsplash.com/photo-1583573636246-18cb2246697f?q=80&w=800", "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800"]
  },
}

const COLORS = [
  { name: "Naranja", hex: "#f87171" },
  { name: "Verde", hex: "#22c55e" },
  { name: "Azul", hex: "#3b82f6" },
  { name: "Morado", hex: "#a855f7" },
  { name: "Amarillo", hex: "#eab308" },
]

export function CaseSelector() {
  const { setStep, selection, updateSelection, isHydrated } = useApp()
  
  const [selectedType, setSelectedType] = useState("Flexi")
  const [selectedColorName, setSelectedColorName] = useState("Naranja")
  const [showGallery, setShowGallery] = useState(false)
  const [galleryIdx, setGalleryIdx] = useState(0)

  // Sincronización inicial al montar para que refleje lo guardado
  useEffect(() => {
    if (isHydrated) {
      if (selection.caseType) setSelectedType(selection.caseType)
      if (selection.caseColor) setSelectedColorName(selection.caseColor)
    }
  }, [isHydrated])

  // Funciones de cambio con persistencia inmediata
  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    updateSelection({ caseType: type })
  }

  const handleColorChange = (colorName: string) => {
    setSelectedColorName(colorName)
    updateSelection({ caseColor: colorName })
  }

  const currentColorData = CASE_DATA[selectedColorName as keyof typeof CASE_DATA] || CASE_DATA.Naranja

  const summaryDetails = useMemo(() => {
    if (!isHydrated) return "Cargando..."
    const parts = []
    if (selection.brand) parts.push(selection.brand)
    if (selection.model) parts.push(selection.model)
    if (selection.comboId) {
      const combo = COMBOS_DATA.find(c => c.id === selection.comboId)
      if (combo) parts.push(combo.name)
    }
    if (selection.micaId) {
      const mica = MICAS_DATA.find(m => m.id === selection.micaId)
      if (mica) parts.push(mica.name)
    }
    return parts.join(", ")
  }, [selection, isHydrated])

  if (!isHydrated) return null

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <TelcelHeader />

      <StepHeader 
        currentStepNumber={4}
        totalSteps={6}
        title="Selecciona tu Case"
        subtitle="Próximo paso: Selecciona tu imagen"
        backTo="mica-selector"
      />

      <main className="flex-1 overflow-y-auto px-6">
        <div className="flex gap-6 items-start mb-6 pt-4">
          <div className="relative w-[45%]">
            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 transition-all duration-500">
               <img src={currentColorData.preview} className="w-full h-full object-cover" alt="Case Preview" />
            </div>
            <button onClick={() => { setGalleryIdx(0); setShowGallery(true); }} className="absolute bottom-4 left-4 w-10 h-10 bg-[#1e62c1] rounded-full flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform">
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-3xl font-bold text-slate-900">{selectedType}</h3>
            <p className="text-2xl font-bold text-slate-900 leading-none">$699</p>
            <div className="space-y-1 text-[10px] pt-2">
              <p className="text-slate-400 font-bold uppercase tracking-tighter">Modelo Plus: <span className="text-slate-600 font-medium normal-case">resistente a caídas</span></p>
              <p className="text-slate-400 font-bold uppercase tracking-tighter">Modelo: <span className="text-slate-600 font-medium">CASE PROTECT PRO</span></p>
              <p className="text-slate-400 font-bold uppercase tracking-tighter">Marca: <span className="text-slate-600 font-medium">Primo Protect</span></p>
            </div>
          </div>
        </div>

        <div className="flex p-1 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
          {["Flexi", "Bumper", "Cut Out"].map((type) => (
            <button 
              key={type} 
              onClick={() => handleTypeChange(type)} 
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${selectedType === type ? "bg-[#6b21a8] text-white shadow-md" : "text-slate-400"}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mb-10">
  {/* Texto a la izquierda */}
  <div>
    <p className="text-sm font-bold text-slate-900 leading-none">Color de Case</p>
    <p className="text-[12px] text-slate-400 font-medium mt-1">{selectedColorName}</p>
  </div>

  {/* Colores en 2 columnas a la derecha */}
  <div className="flex gap-3">
    {COLORS.map((color) => (
      <button
        key={color.name}
        onClick={() => handleColorChange(color.name)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          selectedColorName === color.name 
            ? "ring-2 ring-offset-2 ring-red-400 scale-110 shadow-lg" 
            : "scale-100"
        }`}
        style={{ backgroundColor: color.hex }}
      >
        {selectedColorName === color.name && (
          <Check className="w-5 h-5 text-white" strokeWidth={4} />
        )}
      </button>
    ))}
  </div>
</div>
      </main>

      <footer className="p-6 bg-white border-t border-slate-50">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center mb-4">
          <div className="flex-1 overflow-hidden pr-2">
            <p className="font-bold text-slate-900 text-sm mb-0.5">Detalles de tu pedido</p>
            <p className="text-slate-500 text-[11px] font-medium italic truncate">
              {summaryDetails}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold uppercase text-slate-400">Subtotal</p>
            <p className="text-2xl font-bold text-slate-900">$699</p> 
          </div>
        </div>
        <Button 
          onClick={() => setStep("image-selector")}
          className="w-full h-16 rounded-[2rem] bg-[#6b21a8] text-white font-bold text-xl active:scale-95 transition-transform"
        >
          Siguiente
        </Button>
      </footer>

      {showGallery && (
        <div className="absolute inset-0 z-[100] flex items-end">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in" onClick={() => setShowGallery(false)} />
          <div className="relative w-full bg-white rounded-t-[3rem] p-6 shadow-2xl animate-in slide-in-from-bottom">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            <button onClick={() => setShowGallery(false)} className="absolute top-8 right-8 text-slate-400"><X /></button>
            <div className="aspect-square w-full rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100 border">
              <img src={currentColorData.gallery[galleryIdx]} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex justify-between gap-4 mb-8">
              {currentColorData.gallery.map((img, i) => (
                <button key={i} onClick={() => setGalleryIdx(i)} className={`relative flex-1 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${galleryIdx === i ? "border-[#6b21a8] scale-105" : "border-transparent opacity-60"}`}>
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
            <Button onClick={() => setShowGallery(false)} className="w-full h-14 rounded-2xl border-2 border-slate-900 bg-white text-slate-900 font-bold text-lg">Cerrar</Button>
          </div>
        </div>
      )}
    </div>
  )
}