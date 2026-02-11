"use client"

import { useState } from "react"
import { ArrowLeft, LogOut, X } from "lucide-react"
import { useApp } from "@/hooks/use-app"
import { StepType } from "@/lib/store"

interface StepHeaderProps {
  currentStepNumber: number
  totalSteps?: number
  title: string
  subtitle: string
  backTo: StepType
}

export function StepHeader({ 
  currentStepNumber, 
  totalSteps = 6, 
  title, 
  subtitle, 
  backTo 
}: StepHeaderProps) {
  const { setStep, resetApp, isHydrated } = useApp()
  const [showExitModal, setShowExitModal] = useState(false)

  // Evitar desajustes de hidratación
  if (!isHydrated) return <div className="h-[88px] bg-white border-b border-blue-50" />;

  const progress = (currentStepNumber / totalSteps) * 100

  return (
    <>
      <header className="bg-white p-4 shadow-sm flex items-center gap-4 shrink-0 border-b border-blue-50 rounded-b-[2rem] z-[50] relative">
        {/* Botón Atrás */}
        <button 
          onClick={() => setStep(backTo)} 
          className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        {/* Progreso Circular */}
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" className="text-slate-100" strokeWidth="3" />
            <path 
              className="text-[#1e62c1] transition-all duration-1000 ease-in-out" 
              strokeWidth="3" 
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round" stroke="currentColor" fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
            {currentStepNumber}/{totalSteps}
          </div>
        </div>
        
        {/* Textos */}
        <div className="flex-1 overflow-hidden">
          <h2 className="text-lg font-bold text-slate-900 leading-tight truncate">{title}</h2>
          <p className="text-[11px] text-slate-500 font-medium italic truncate">{subtitle}</p>
        </div>

        {/* Botón Salir */}
        <button 
          onClick={() => setShowExitModal(true)} 
          className="flex flex-col items-center gap-0.5 text-[#1e62c1] pr-2 active:opacity-70"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Salir</span>
        </button>
      </header>

      {/* MODAL DE CANCELACIÓN */}
      {showExitModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowExitModal(false)}
          />
          
          <div className="relative w-full max-w-[340px] bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowExitModal(false)}
              className="absolute top-6 right-6 text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-6 mt-4">
              <div className="w-20 h-20 rounded-full border-[3px] border-[#f87171] flex items-center justify-center">
                <span className="text-[#f87171] text-4xl font-light">!</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-[22px] font-bold text-[#0f172a] mb-3">¿Deseas cancelar tu pedido?</h3>
              <p className="text-[#64748b] text-base leading-snug">
                Recuerda que esta acción es irreversible y perderás todo el proceso.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { resetApp(); setShowExitModal(false); }}
                className="w-full h-[60px] rounded-[1.5rem] border-[1.5px] border-black text-black font-bold text-lg active:bg-slate-50 transition-colors"
              >
                Si, cancelar pedido
              </button>
              
              <button 
                onClick={() => setShowExitModal(false)}
                className="w-full h-[60px] rounded-[1.5rem] bg-[#6b21a8] text-white font-bold text-lg shadow-md active:opacity-90 transition-opacity"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}