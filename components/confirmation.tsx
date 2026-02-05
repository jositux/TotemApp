"use client"

import { useApp } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, MapPin, Clock, Home, Copy } from "lucide-react"
import { useState } from "react"

export function Confirmation() {
  const { orderNumber, setStep, user } = useApp()
  const [copied, setCopied] = useState(false)

  const handleCopyOrder = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground text-center">
        <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Pedido Confirmado</h1>
        <p className="text-primary-foreground/80 mt-1">Gracias por tu compra, {user?.name || "Usuario"}</p>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Order number */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Número de pedido</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-foreground">{orderNumber}</p>
            <button 
              onClick={handleCopyOrder}
              className="flex items-center gap-1 text-primary text-sm"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mb-4 p-4">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${orderNumber || 'ORDER'}`}
              alt="QR Code"
              className="w-full h-full"
              crossOrigin="anonymous"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Muestra este codigo para recoger tu pedido en tienda
          </p>
        </div>

        {/* Order status */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="font-semibold">Estado del pedido</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Pedido confirmado</p>
                <p className="text-sm text-muted-foreground">Tu pedido ha sido recibido</p>
              </div>
              <span className="text-xs text-muted-foreground">Ahora</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-muted-foreground">En preparación</p>
                <p className="text-sm text-muted-foreground">Estamos preparando tu pedido</p>
              </div>
              <span className="text-xs text-muted-foreground">Pendiente</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-muted-foreground">En camino</p>
                <p className="text-sm text-muted-foreground">Tu pedido está en camino</p>
              </div>
              <span className="text-xs text-muted-foreground">Pendiente</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Home className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-muted-foreground">Entregado</p>
                <p className="text-sm text-muted-foreground">Pedido entregado</p>
              </div>
              <span className="text-xs text-muted-foreground">Pendiente</span>
            </div>
          </div>
        </div>

        {/* Estimated delivery */}
        <div className="bg-accent/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="font-semibold">Entrega estimada</p>
            <p className="text-sm text-muted-foreground">
              {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long"
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-border space-y-3">
        <Button 
          variant="outline"
          className="w-full h-12 bg-transparent"
        >
          Ver detalles del pedido
        </Button>
        <Button 
          onClick={() => setStep("home")}
          className="w-full h-12 font-semibold bg-primary hover:bg-primary/90"
        >
          <Home className="mr-2 h-5 w-5" />
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}
