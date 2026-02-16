"use client"

import React from "react"
import { useApp } from "@/hooks/use-app"
import { useAtomValue } from "jotai"
import { totalSelectionPriceAtom, selectionAtom } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function UnifiedFooter() {
  const { currentStep, setStep, progress } = useApp()
  const selection = useAtomValue(selectionAtom)
  const totalPrice = useAtomValue(totalSelectionPriceAtom)

  if (currentStep === "onboarding" || currentStep === "final-summary") return null

  const isContactForm = currentStep === "contact-form"
  const isPhoneSelector = currentStep === "phone-selector"
  const isImageSelector = currentStep === "image-selector"
  
  const buttonText = isContactForm ? "Enviar a producción" : "Siguiente"
  
  const hasBrand = !!selection.brand 
  const hasModel = !!selection.model
  const shouldShowPrice = !isPhoneSelector && hasModel

  // VALIDACIÓN DE IMAGEN:
  // Si es el paso de imagen, verificamos que el tipo de fuente (brand/custom) coincida con la URL/ID y el check
  const isImageReady = isImageSelector 
    ? (selection.imageSourceType === 'brand' ? !!selection.imageBrandId : !!selection.imageCustomUrl) 
    : true

  const getDetailString = () => {
    const parts = []
    if (selection.brand) parts.push(selection.brand)
    if (selection.model) parts.push(selection.model)
    
    const comboNames: Record<string, string> = {
      combo1: "Full Protection",
      combo2: "Protection Pack",
      combo3: "Style Pack",
      combo4: "Basic Protection",
      combo5: "Solo Case"
    }

    const isStepAfterCombo = ["mica-selector", "case-selector", "image-selector", "contact-form"].includes(currentStep)
    if (isStepAfterCombo || currentStep === "combo-selector") {
      const comboLabel = comboNames[selection.comboId]
      if (comboLabel) parts.push(comboLabel)
    }

    return parts.join(" • ")
  }

  return (
    <footer className="p-4 shrink-0 bg-[#f8fafc] border-t border-slate-100 z-[70]">
      <AnimatePresence>
        {hasBrand && (
          <motion.div 
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="bg-white border border-slate-200 rounded-[1.2rem] p-3.5 flex justify-between items-center mb-3 shadow-sm overflow-hidden"
          >
            <div className="flex-1 pr-3 min-w-0">
              <h4 className="font-bold text-[#0f172a] text-sm leading-tight mb-0.5">
                Resumen de pedido
              </h4>
              <p className="text-slate-400 text-[11px] font-medium leading-[1.2] line-clamp-2">
                {getDetailString() || "Esperando selección..."}
              </p>
            </div>

            {shouldShowPrice && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-right shrink-0 border-l border-slate-50 pl-3"
              >
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mb-0.5">
                  Subtotal
                </p>
                <p className="text-xl font-semibold text-[#0f172a] tracking-tight">
                  ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        // Habilitado solo si tiene modelo Y (si es paso de imagen, que la imagen esté lista)
        disabled={!hasModel || !isImageReady}
        onClick={() => setStep(progress.next)}
        className="w-full h-14 rounded-[1rem] bg-[#6b21a8] hover:bg-[#581c87] text-white font-bold text-lg shadow-md shadow-purple-50 transition-all active:scale-95 disabled:opacity-30 disabled:bg-slate-300"
      >
        {buttonText}
      </Button>
      
      <div className="h-[env(safe-area-inset-bottom)] w-full" />
    </footer>
  )
}