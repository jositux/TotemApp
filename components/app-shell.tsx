"use client"

import { useApp } from "@/hooks/use-app" // <--- Cambiamos la ruta al nuevo hook de Jotai
import { Onboarding } from "./onboarding"
import PhoneSelectorPage from "./phone-selector"
import { ComboSelector } from "./combo-selector"
import { MicaSelector } from "./mica-selector"
import { CaseSelector } from "./case-selector"
import { ImageSelector } from "./image-selector"
// import { FinalSummary } from "./final-summary" // El próximo paso 6/6

export function AppShell() {
  const { currentStep, isHydrated } = useApp()

  // Mientras Jotai lee el localStorage, podemos mostrar un loader o nada
  // Esto evita que el usuario vea el Onboarding un milisegundo si ya estaba en el paso 5
  if (!isHydrated) return null 

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen bg-white relative overflow-hidden shadow-2xl">
        {currentStep === "onboarding" && <Onboarding />}
        {currentStep === "phone-selector" && <PhoneSelectorPage />}
        {currentStep === "combo-selector" && <ComboSelector />}
        {currentStep === "mica-selector" && <MicaSelector />}
        {currentStep === "case-selector" && <CaseSelector />}
        {currentStep === "image-selector" && <ImageSelector />}
        
        {/* Paso 6/6: Descomentar cuando lo creemos */}
        {/* {currentStep === "final-summary" && <FinalSummary />} */}
      </div>
    </div>
  )
}