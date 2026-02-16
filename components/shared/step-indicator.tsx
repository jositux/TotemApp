"use client"

import React from "react"
import { ImageIcon, Check, Smartphone, ShieldCheck } from "lucide-react"
import { useApp } from "@/hooks/use-app"

export function StepIndicator() {
  const { currentStep, stepsPath } = useApp()

  const personalizableSteps = [
    { id: "mica-selector", label: "Mica", icon: ShieldCheck },
    { id: "case-selector", label: "Case", icon: Smartphone },
    { id: "image-selector", label: "Imagen", icon: ImageIcon },
  ]

  // Filtramos los pasos que realmente existen en el combo actual
  const visibleSteps = personalizableSteps.filter(step => 
    stepsPath.includes(step.id as any)
  )

  // Si el combo tiene 1 o menos pasos de personalización, no mostrar nada
  if (visibleSteps.length <= 1) return null

  const globalIndex = stepsPath.indexOf(currentStep)

  return (
    <div className="flex justify-around px-12 py-4 bg-white/50 relative shrink-0">
      <div className="absolute top-[1.6rem] left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-slate-100 -z-0" />
      {visibleSteps.map((step) => {
        const stepIndex = stepsPath.indexOf(step.id as any)
        const isActive = currentStep === step.id
        const isCompleted = globalIndex > stepIndex
        const Icon = step.icon

        return (
          <div key={step.id} className="flex flex-col items-center gap-1.5 z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all 
              ${isActive ? "bg-[#6b21a8] border-[#6b21a8] shadow-lg shadow-purple-200" : 
                isCompleted ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"}`}>
              {isCompleted ? <Check className="w-4 h-4 text-white" strokeWidth={3} /> : 
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-300"}`} />}
            </div>
            <span className={`text-[9px] font-black uppercase ${isActive ? "text-[#6b21a8]" : "text-slate-400"}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}