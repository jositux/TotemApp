"use client"

import { useState } from "react"
import { useApp } from "@/hooks/use-app"
import { AnimatePresence, motion } from "framer-motion"
import { TelcelHeader } from "@/components/shared/telcel-header"
import { StepHeader } from "@/components/shared/step-header"
import { UnifiedFooter } from "@/components/shared/unified-footer"
import { ExitModal } from "@/components/shared/exit-modal"
import { StepIndicator } from "@/components/shared/step-indicator"
import { StepType } from "@/lib/store"

import { Onboarding } from "./onboarding"
import PhoneSelectorPage from "./phone-selector"
import ComboSelector from "./combo-selector"
import MicaSelector from "./mica-selector"
import CaseSelector from "./case-selector"
import ImageSelector from "./image-selector"
import ContactForm from "./contact-form"

export function AppShell() {
  const { currentStep, isHydrated, progress, resetApp } = useApp()
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)

  if (!isHydrated) return null 

  const isOnboarding = currentStep === "onboarding"
  
  // Tu lógica: Mostrar solo en pasos de personalización
  const showSubSteps = ["mica-selector", "case-selector", "image-selector"].includes(currentStep)

  const stepNames: Record<StepType, string> = {
    "onboarding": "Inicio",
    "phone-selector": "Tu celular",
    "combo-selector": "Tu combo",
    "mica-selector": "Protector",
    "case-selector": "Tu funda",
    "image-selector": "Diseño",
    "contact-form": "Contacto",
    "final-summary": "Resumen"
  }

  const stepConfig: Record<string, { title: string }> = {
    "phone-selector": { title: "Selecciona tu celular" },
    "combo-selector": { title: "Elige tu combo" },
    "mica-selector": { title: "Protector de pantalla" },
    "case-selector": { title: "Funda de celular" },
    "image-selector": { title: "Personaliza tu diseño" },
    "contact-form": { title: "Datos de contacto" },
  }

  const currentConfig = stepConfig[currentStep] || { title: "" }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center overflow-hidden">
      <div className="w-full max-w-[480px] h-[100dvh] bg-white relative overflow-hidden shadow-2xl flex flex-col">
        
        {/* HEADER AREA */}
        <AnimatePresence>
          {!isOnboarding && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="shrink-0 z-[60] bg-white"
            >
              <TelcelHeader />
              <StepHeader 
                currentStepNumber={progress.current}
                totalSteps={progress.total}
                title={currentConfig.title}
                subtitle={`Siguiente: ${stepNames[progress.next]}`}
                backTo={progress.previous}
                onExitClick={() => setIsExitModalOpen(true)}
              />

              {/* Tu StepIndicator con animación de altura */}
              <AnimatePresence>
                {showSubSteps && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-b border-slate-50"
                  >
                    <StepIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENT AREA */}
        <div className="flex-1 relative overflow-hidden bg-[#f8fafc]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute inset-0 w-full h-full flex flex-col"
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                {currentStep === "onboarding" && <Onboarding />}
                {currentStep === "phone-selector" && <PhoneSelectorPage />}
                {currentStep === "combo-selector" && <ComboSelector />}
                {currentStep === "mica-selector" && <MicaSelector />}
                {currentStep === "case-selector" && <CaseSelector />}
                {currentStep === "image-selector" && <ImageSelector />}
                {currentStep === "contact-form" && <ContactForm />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER AREA */}
        <UnifiedFooter />

        {/* MODAL GLOBAL */}
        <ExitModal 
          isOpen={isExitModalOpen} 
          onClose={() => setIsExitModalOpen(false)} 
          onConfirm={() => {
            setIsExitModalOpen(false)
            resetApp()
          }}
        />
      </div>
    </div>
  )
}