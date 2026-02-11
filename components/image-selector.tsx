"use client"

import React, { useState, useMemo } from "react"
import { ArrowLeft, LogOut, Check, ChevronRight, Image as ImageIcon, Search, ZoomIn } from "lucide-react"
import { TelcelHeader } from "@/components/shared/telcel-header"
import { StepHeader } from "@/components/shared/step-header" // <--- Importado
import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/use-app" // Ajustado a tu hook estándar

// --- TUS DATOS (SIN CAMBIOS) ---
const LICENSES = [
  { id: "disney", name: "Disney", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney_logo.svg" },
  { id: "fifa", name: "FIFA", logo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/FIFA_logo_white.svg" },
  { id: "ea", name: "EA Sports", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/EA_Sports_logo.svg" },
]

const IMAGES_BY_LICENSE: Record<string, {id: string, url: string}[]> = {
  disney: [
    { id: "d1", url: "https://images.unsplash.com/photo-1592150621344-22d55e09042b?w=400" },
    { id: "d2", url: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400" },
    { id: "d3", url: "https://images.unsplash.com/photo-1608889476561-6242caac1944?w=400" },
  ]
}

export function ImageSelector() {
  const { setStep, selection, updateSelection, resetImage, isHydrated } = useApp()
  const [activeTab, setActiveTab] = useState("Licencias")
  
  // Estados del Popup
  const [showPopup, setShowPopup] = useState(false)
  const [popupStep, setPopupStep] = useState<"gallery" | "adjust">("gallery")
  
  // Selección temporal dentro del popup
  const [tempBrand, setTempBrand] = useState<any>(null)
  const [tempImage, setTempImage] = useState<any>(null)
  
  // Ajustes de imagen
  const [orientation, setOrientation] = useState<"Vertical" | "Horizontal">("Vertical")
  const [size, setSize] = useState<"Grande" | "Mediana" | "Pequeña">("Grande")
  const [acceptedLicense, setAcceptedLicense] = useState(false)

  // Abrir popup al elegir marca
  const handleBrandClick = (brand: any) => {
    setTempBrand(brand)
    setPopupStep("gallery")
    setShowPopup(true)
  }

  // Confirmar desde el popup y guardar
  const handleConfirmAdjustment = () => {
    updateSelection({
      imageSourceType: "brand",
      imageBrandId: tempImage.id,
      selectedBrandTag: tempBrand.name,
      imageConfig: { orientation, size }
    })
    setShowPopup(false)
  }

  const isBrandSelected = selection.imageSourceType === "brand"

  if (!isHydrated) return null

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <TelcelHeader />

      {/* HEADER REUTILIZABLE 5/6 */}
      <StepHeader 
        currentStep={5}
        title="Selecciona tu imagen"
        subtitle="Próximo paso: Enviar a producción"
        backTo="case-selector"
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-100 shrink-0 bg-white">
        {["Licencias", "Imagen personal", "Diseñadores"].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex-1 py-4 text-sm font-bold relative transition-colors ${activeTab === tab ? "text-slate-900" : "text-slate-400"}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6b21a8] rounded-t-full mx-4" />}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto bg-slate-50/30">
        {activeTab === "Licencias" && (
          <div className="p-6">
            {!isBrandSelected ? (
              /* LISTADO DE MARCAS */
              <div className="space-y-3">
                {LICENSES.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandClick(brand)}
                    className="w-full bg-white border-2 border-transparent rounded-2xl p-5 flex items-center justify-between shadow-sm active:border-[#1e62c1] transition-all"
                  >
                    <div className="h-8 w-24 flex items-center">
                      <img src={brand.logo} alt={brand.name} className="max-h-full object-contain grayscale opacity-70" />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* RESUMEN DE MARCA CARGADA */
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex gap-6 items-start">
                  <div className="relative w-[45%]">
                    <div className="aspect-[3/4] rounded-[2.5rem] bg-slate-800 p-2 shadow-xl border-[4px] border-slate-700 overflow-hidden">
                      <div className="w-full h-full bg-white rounded-[1.8rem] relative overflow-hidden">
                        <img src={tempImage?.url || selection.imageBrandId} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                           <button onClick={resetImage} className="w-10 h-10 bg-[#1e62c1] rounded-full flex items-center justify-center text-white shadow-lg">
                             <Search className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">Imagen {selection.selectedBrandTag}</h3>
                    <p className="text-[11px] text-green-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" strokeWidth={4} /> Compatible con tu modelo.
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic">
                      Uso bajo licencia de {selection.selectedBrandTag}.
                    </p>
                    
                    <label className="flex items-start gap-3 pt-2 cursor-pointer">
                      <div 
                        onClick={() => setAcceptedLicense(!acceptedLicense)}
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center ${acceptedLicense ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"}`}
                      >
                        {acceptedLicense && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                      </div>
                      <span className="text-[11px] text-slate-600 font-medium">
                        Acepto la <span className="font-bold text-slate-900">licencia limitada de uso.</span>
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                   <p className="text-sm font-bold text-slate-900 mb-3">Color del case: <span className="text-slate-400 font-medium">{selection.caseColor || 'No seleccionado'}</span></p>
                   <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-full border-2 border-[#1e62c1]" style={{ backgroundColor: "#64748b" }} />
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Fijo */}
      <footer className="p-6 bg-white border-t border-slate-50">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center mb-4">
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-slate-900 text-sm">Detalles de tu pedido</p>
            <p className="text-slate-500 text-[11px] italic truncate">
              {selection.brand}, {selection.model}, {selection.caseType}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Subtotal</p>
            <p className="text-2xl font-bold text-slate-900">$699</p> 
          </div>
        </div>
        <Button 
          disabled={!isBrandSelected || !acceptedLicense}
          onClick={() => setStep("final-summary")}
          className="w-full h-16 rounded-[2rem] bg-[#6b21a8] text-white font-bold text-xl shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
        >
          Siguiente
        </Button>
      </footer>

      {/* POPUP LATERAL (Mantenemos tu lógica de navegación interna) */}
      <div className={`absolute inset-0 z-50 transition-transform duration-500 bg-white flex flex-col ${showPopup ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 flex items-center border-b shrink-0">
          <button onClick={() => popupStep === "adjust" ? setPopupStep("gallery") : setShowPopup(false)} className="w-10 h-10 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h3 className="flex-1 text-center font-bold text-lg pr-10">
            {popupStep === "gallery" ? `${tempBrand?.name} - Seleccionar` : "Ajustar imagen"}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {popupStep === "gallery" ? (
            <div className="p-4 grid grid-cols-3 gap-3">
              {(IMAGES_BY_LICENSE[tempBrand?.id] || []).map((img) => (
                <button
                  key={img.id}
                  onClick={() => setTempImage(img)}
                  className={`aspect-square relative rounded-2xl overflow-hidden border-4 transition-all ${tempImage?.id === img.id ? "border-[#1e62c1]" : "border-transparent"}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt="Gallery Option" />
                  <div className={`absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center border ${tempImage?.id === img.id ? "bg-[#6b21a8] text-white border-transparent" : "bg-white/80 border-slate-200"}`}>
                    {tempImage?.id === img.id && <Check className="w-3 h-3" strokeWidth={4} />}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center">
              <div className="flex gap-4 w-full mb-8">
                {["Vertical", "Horizontal"].map((opt) => (
                  <button key={opt} onClick={() => setOrientation(opt as any)} className={`flex-1 h-14 rounded-2xl border-2 flex items-center justify-between px-6 font-bold ${orientation === opt ? "border-black" : "border-slate-100 text-slate-400"}`}>
                    {opt}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${orientation === opt ? "border-black" : "border-slate-300"}`}>
                      {orientation === opt && <div className="w-3 h-3 bg-black rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="w-full mb-8">
                <p className="text-sm font-bold mb-4">Tamaño de la imagen</p>
                <div className="flex justify-around items-end h-16">
                  {["Grande", "Mediana", "Pequeña"].map((s) => (
                    <button key={s} onClick={() => setSize(s as any)} className="flex flex-col items-center gap-1">
                      <ImageIcon className={`${s === "Grande" ? "w-10 h-10" : s === "Mediana" ? "w-7 h-7" : "w-5 h-5"} ${size === s ? "text-[#6b21a8]" : "text-slate-300"}`} />
                      <span className={`text-[10px] font-bold ${size === s ? "text-slate-900" : "text-slate-400"}`}>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-48 aspect-[1/2] bg-slate-800 rounded-[2.5rem] p-3 border-[6px] border-slate-700 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[1.8rem] overflow-hidden relative">
                  <img src={tempImage?.url} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover transition-all duration-300 ${size === "Grande" ? "w-full h-full" : size === "Mediana" ? "w-[80%]" : "w-[60%]"} ${orientation === "Horizontal" ? "rotate-90" : ""}`} alt="Adjust Preview" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <Button 
            disabled={!tempImage}
            onClick={() => popupStep === "gallery" ? setPopupStep("adjust") : handleConfirmAdjustment()}
            className="w-full h-16 rounded-[2rem] bg-[#6b21a8] text-white font-bold text-xl active:scale-95 transition-transform"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}