"use client"

import React from "react"
import { ArrowLeft, LogOut } from "lucide-react"
import { useApp } from "@/hooks/use-app"
import { StepType } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

interface StepHeaderProps {
  currentStepNumber: number
  totalSteps: number
  title: string
  subtitle: string
  backTo: StepType
  onExitClick: () => void // La prop que conecta con el AppShell
}

export function StepHeader({ 
  currentStepNumber, 
  totalSteps, 
  title, 
  subtitle, 
  backTo,
  onExitClick 
}: StepHeaderProps) {
  const { setStep, isHydrated } = useApp()

  if (!isHydrated) return <div className="h-[88px] bg-white border-b border-slate-50" />;

  // Porcentaje para el círculo de progreso
  const percentage = Math.min(Math.max((currentStepNumber / totalSteps) * 100, 0), 100)

  return (
    <header className="bg-white p-4 shadow-sm flex items-center gap-4 shrink-0 border-b border-slate-50 rounded-b-[2rem] z-[50] relative">
      
      {/* Botón Atrás */}
      <button 
        onClick={() => setStep(backTo)} 
        className="w-9 h-9 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-all hover:bg-slate-50"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      {/* Progreso Circular */}
      <div className="relative w-12 h-12 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" className="text-slate-100" strokeWidth="3" />
          <motion.circle 
            cx="18" cy="18" r="16"
            fill="none"
            initial={{ strokeDasharray: "0 100" }}
            animate={{ strokeDasharray: `${percentage} 100` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            strokeWidth="3" 
            strokeLinecap="round" 
            stroke="#1e62c1"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-slate-800">
          {currentStepNumber}/{totalSteps}
        </div>
      </div>
      
      {/* Títulos con Animación de cambio de paso */}
      <div className="flex-1 overflow-hidden relative h-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            <h2 className="text-base font-bold text-slate-900 leading-tight truncate">
              {title}
            </h2>
            <p className="text-[10px] text-[#1e62c1] font-black uppercase tracking-wider truncate">
              {subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Botón Salir (Llama a la función del AppShell) */}
      <button 
        onClick={onExitClick} 
        className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-[#f87171] transition-colors active:scale-95"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-[9px] font-black uppercase tracking-tighter">Salir</span>
      </button>
    </header>
  )
}