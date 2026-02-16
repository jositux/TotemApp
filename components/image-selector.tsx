"use client"

import React, { useState, useRef, useEffect } from "react"
import { 
  ArrowLeft, ChevronRight, RotateCw, 
  Maximize, Minimize2, Square, ImagePlus, Pencil, Check
} from "lucide-react"
import { ColorSelector } from "@/components/shared/color-selector"
import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/use-app"
import { motion, AnimatePresence } from "framer-motion"

// --- DATOS MOCK ---
const LICENSES = [
  { id: "disney", name: "Disney", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney_logo.svg" },
  { id: "fifa", name: "FIFA", logo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/FIFA_logo_white.svg" },
]

const IMAGES_BY_LICENSE: Record<string, {id: string, url: string}[]> = {
  disney: [
    { id: "d1", url: "https://images.unsplash.com/photo-1592150621344-22d55e09042b?w=600" },
    { id: "d2", url: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=600" },
    { id: "d3", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600" },
  ],
  fifa: [{ id: "f1", url: "https://images.unsplash.com/photo-1614632537190-23e414dcd23d?w=600" }]
}

export default function ImageSelector() {
  // Cambiamos setCurrentStep por setStep según la estructura de tu hook
  const { selection, updateSelection, isHydrated, setStep } = useApp()
  
  const [activeTab, setActiveTab] = useState<"Licencias" | "Imagen personal">("Licencias")
  const [brandSelector, setBrandSelector] = useState<any>(null) 
  const [tempSelectedImg, setTempSelectedImg] = useState<string | null>(null)
  const [accepted, setAccepted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editingImage, setEditingImage] = useState<{url: string, type: 'brand' | 'custom'} | null>(null)
  const [config, setConfig] = useState({ rotation: 0, size: "Grande" as "Pequeña" | "Mediana" | "Grande" })

  // Lógica de validación
  const isReady = activeTab === "Licencias" 
    ? (!!selection.imageBrandId && accepted)
    : (!!selection.imageCustomUrl && accepted)

  useEffect(() => {
    if (isHydrated && selection.imageSourceType) {
      setActiveTab(selection.imageSourceType === "brand" ? "Licencias" : "Imagen personal")
    }
  }, [isHydrated, selection.imageSourceType])

  if (!isHydrated) return null

  const getImageStyle = (type: 'brand' | 'custom', isPreview: boolean = false) => {
    const savedConfig = type === 'brand' ? selection.imageBrandConfig : selection.imageCustomConfig
    const currentConfig = isPreview ? savedConfig : config
    const rotation = currentConfig?.rotation || 0
    let baseScale = currentConfig?.size === "Mediana" ? 0.75 : currentConfig?.size === "Pequeña" ? 0.5 : 1
    const isSideways = Math.abs(rotation % 180) === 90
    const finalScale = isSideways ? baseScale * 0.7 : baseScale

    return {
      transform: `rotate(${rotation}deg) scale(${finalScale})`,
      transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      objectFit: "cover" as const
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setEditingImage({ url: reader.result as string, type: 'custom' })
        setConfig({ rotation: 0, size: "Grande" })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirmEditor = () => {
    if (!editingImage) return
    const normalizedRotation = config.rotation % 360
    updateSelection({
      imageSourceType: editingImage.type,
      ...(editingImage.type === 'brand' 
        ? { imageBrandId: editingImage.url, imageBrandConfig: { rotation: normalizedRotation, size: config.size }, selectedBrandTag: brandSelector?.name || selection.selectedBrandTag }
        : { imageCustomUrl: editingImage.url, imageCustomConfig: { rotation: normalizedRotation, size: config.size } }
      )
    })
    setEditingImage(null)
  }

  const renderSummary = (url: string, type: 'brand' | 'custom', title: string, currentConfig: any) => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex gap-6">
        <div className="relative w-[45%] shrink-0">
          <div className="aspect-[3/4.2] rounded-[2.5rem] bg-slate-900 p-2 shadow-2xl border-[4px] border-slate-800 overflow-hidden relative">
            <img src={url} style={getImageStyle(type, true)} className="w-full h-full rounded-[1.8rem]" />
            <button onClick={() => { setEditingImage({url, type}); setConfig(currentConfig as any); }} className="absolute bottom-4 right-4 w-10 h-10 bg-white text-[#6b21a8] rounded-full flex items-center justify-center shadow-xl border border-slate-100 active:scale-90 transition-transform">
              <Pencil size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <div className="flex-1 pt-2">
          <span className="text-[9px] font-black text-[#6b21a8] uppercase tracking-widest bg-purple-50 px-2 py-1 rounded">{type === 'brand' ? 'Oficial' : 'Mío'}</span>
          <h3 className="text-2xl font-black text-slate-900 leading-tight mt-2 uppercase tracking-tighter">{title}</h3>
          <button onClick={() => { updateSelection(type === 'brand' ? { imageBrandId: null, imageSourceType: null } : { imageCustomUrl: null, imageSourceType: null }); setAccepted(false); }} className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-tight text-red-500 bg-red-50 py-3 px-4 rounded-xl w-full justify-center active:scale-95 transition-transform">
            <RotateCw size={14} /> Cambiar imagen
          </button>
          <label className="flex items-start gap-2 mt-6 cursor-pointer group">
            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${accepted ? 'bg-[#6b21a8] border-[#6b21a8]' : 'bg-white border-slate-200'}`}>
              <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)} className="hidden" /> 
              {accepted && <Check size={12} className="text-white" strokeWidth={4} />}
            </div>
            <span className="text-[10px] text-slate-500 font-bold">Confirmar diseño</span>
          </label>
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Color del case</h4>
        <ColorSelector layout="grid" />
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden">
      <div className="shrink-0 border-b border-slate-100">
        <div className="flex">
          {["Licencias", "Imagen personal"].map((t) => (
            <button key={t} onClick={() => { setActiveTab(t as any); setAccepted(false); }} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest relative ${activeTab === t ? "text-[#6b21a8]" : "text-slate-400"}`}>
              {t} {activeTab === t && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6b21a8] rounded-t-full mx-6" />}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        <div className="p-6">
          <div className={activeTab === "Licencias" ? "block" : "hidden"}>
            {selection.imageBrandId ? renderSummary(selection.imageBrandId, 'brand', selection.selectedBrandTag || "Licencia", selection.imageBrandConfig) : (
              <div className="space-y-3">
                {LICENSES.map(b => (
                  <button key={b.id} onClick={() => setBrandSelector(b)} className="w-full bg-white p-6 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
                    <img src={b.logo} className="h-6 object-contain grayscale opacity-60" />
                    <ChevronRight className="text-slate-300" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={activeTab === "Imagen personal" ? "block" : "hidden"}>
            {selection.imageCustomUrl ? renderSummary(selection.imageCustomUrl, 'custom', "Tu Foto", selection.imageCustomConfig) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex gap-6">
                  <div className="relative w-[45%] shrink-0">
                    <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-[3/4.2] rounded-[2.5rem] bg-slate-50 border-[3px] border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 overflow-hidden hover:border-purple-300 active:scale-95 transition-all">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300"><ImagePlus size={24} /></div>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </div>
                  <div className="flex-1 pt-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">Personalizar</span>
                    <h3 className="text-2xl font-black text-slate-200 leading-tight mt-2 uppercase italic tracking-tighter">Tu Foto Aquí</h3>
                    <Button onClick={() => fileInputRef.current?.click()} className="mt-6 w-full h-12 bg-white border-2 border-slate-100 rounded-xl text-slate-400 font-black text-[10px] uppercase shadow-sm">Subir Archivo</Button>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <ColorSelector layout="grid" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER NAV CON VALIDACIÓN */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <Button 
            disabled={!isReady}
            onClick={() => setStep("contact-form")}
            className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-lg transition-all duration-300 shadow-2xl ${isReady ? 'bg-[#6b21a8] text-white shadow-purple-200 active:scale-95' : 'bg-slate-100 text-slate-300'}`}
          >
            {isReady ? 'Continuar' : 'Completa tu diseño'}
          </Button>
        </div>
      </div>

      {/* MODALES DE CATÁLOGO Y EDITOR */}
      <AnimatePresence>
        {brandSelector && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 z-[110] bg-white flex flex-col">
            <div className="p-5 border-b flex items-center gap-4"><button onClick={() => setBrandSelector(null)} className="p-1"><ArrowLeft /></button><h3 className="font-bold text-lg uppercase tracking-tight">Elegir imagen</h3></div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-3 no-scrollbar">
              {IMAGES_BY_LICENSE[brandSelector.id]?.map(img => (
                <button key={img.id} onClick={() => setTempSelectedImg(img.url)} className={`aspect-square rounded-2xl relative border-2 transition-all ${tempSelectedImg === img.url ? "border-[#6b21a8] p-1" : "border-transparent"}`}><img src={img.url} className="w-full h-full object-cover rounded-xl" />{tempSelectedImg === img.url && <div className="absolute top-1 right-1 bg-[#6b21a8] rounded-full p-1 shadow-md"><Check size={12} className="text-white" strokeWidth={4} /></div>}</button>
              ))}
            </div>
            <div className="p-6 border-t bg-white">
              <Button disabled={!tempSelectedImg} onClick={() => { setEditingImage({url: tempSelectedImg!, type: 'brand'}); setBrandSelector(null); setTempSelectedImg(null); setConfig({rotation:0, size:'Grande'}); }} className="w-full h-14 bg-[#6b21a8] rounded-2xl text-white font-bold">Continuar</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingImage && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 z-[120] bg-white flex flex-col">
            <div className="p-4 border-b flex items-center gap-4 bg-white"><button onClick={() => setEditingImage(null)} className="p-1 text-slate-400"><ArrowLeft /></button><span className="font-black text-xs uppercase tracking-widest text-slate-900">Ajustar Diseño</span></div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/50">
              <div className="relative w-48 aspect-[3/4.2] bg-white rounded-[3rem] shadow-2xl border-[8px] border-slate-900 overflow-hidden mb-12 flex items-center justify-center"><img src={editingImage.url} style={getImageStyle(editingImage.type, false)} className="w-full h-full" /></div>
              <div className="w-full max-w-xs space-y-6">
                <div className="flex justify-center"><button onClick={() => setConfig({...config, rotation: config.rotation + 90})} className="flex flex-col items-center gap-2 group active:scale-90 transition-transform"><div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-[#6b21a8] border group-active:rotate-90 transition-transform"><RotateCw size={24} /></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Girar</span></button></div>
                <div className="flex gap-2">
                  {[{id:"Pequeña", icon:<Minimize2 size={16}/>}, {id:"Mediana", icon:<Square size={16}/>}, {id:"Grande", icon:<Maximize size={16}/>}].map(s => (
                    <button key={s.id} onClick={() => setConfig({...config, size: s.id as any})} className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 transition-all ${config.size === s.id ? "bg-[#6b21a8] border-[#6b21a8] text-white shadow-lg -translate-y-1" : "bg-white text-slate-400 border-slate-100"}`}>{s.icon} <span className="text-[9px] font-black mt-2 uppercase">{s.id}</span></button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-white border-t"><Button onClick={handleConfirmEditor} className="w-full h-14 bg-[#6b21a8] text-white rounded-2xl font-black uppercase tracking-tight">Confirmar diseño</Button></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}