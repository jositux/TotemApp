"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/hooks/use-app"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2 } from "lucide-react"

export default function ContactForm() {
  const { selection, progress, isHydrated } = useApp()
  const [loading, setLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  // Estado local para el formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulación de envío a producción
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setIsSent(true)
  }

  if (!isHydrated) return null

  if (isSent) {
    return (
      <div className="flex flex-col h-[100dvh] bg-white items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">¡Recibido!</h2>
        <p className="text-slate-500 mb-8">Tu pedido ha sido enviado a producción. Te contactaremos pronto.</p>
        <Button onClick={() => window.location.reload()} className="w-full h-14 rounded-2xl bg-slate-900">Finalizar</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      <main className="flex-1 overflow-y-auto px-6 pt-8">
        <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-slate-900 ml-1">Nombre completo</Label>
            <Input 
              id="name"
              placeholder="Nombre" 
              required
              className="h-16 rounded-2xl border-slate-200 focus:border-[#6b21a8] focus:ring-[#6b21a8] text-lg px-6"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-slate-900 ml-1">Correo electrónico</Label>
            <Input 
              id="email"
              type="email"
              placeholder="Correo electrónico" 
              required
              className="h-16 rounded-2xl border-slate-200 focus:border-[#6b21a8] focus:ring-[#6b21a8] text-lg px-6"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-bold text-slate-900 ml-1">Número celular</Label>
            <Input 
              id="phone"
              type="tel"
              placeholder="Número celular" 
              required
              className="h-16 rounded-2xl border-slate-200 focus:border-[#6b21a8] focus:ring-[#6b21a8] text-lg px-6"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </form>
      </main>

    </div>
  )
}