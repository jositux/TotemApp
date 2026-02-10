"use client"

import { useApp } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

export function Cart() {
  const { 
    cart, 
    cartTotal, 
    cartCount,
    updateQuantity, 
    removeFromCart, 
    setStep 
  } = useApp()

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <header className="flex items-center gap-4 p-4 border-b border-border">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setStep("home")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mi Carrito</h1>
        </header>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">
            Explora nuestros productos y encuentra la funda perfecta para ti.
          </p>
          <Button 
            onClick={() => setStep("home")}
            className="bg-primary hover:bg-primary/90"
          >
            Explorar productos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-border">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setStep("home")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Mi Carrito ({cartCount})</h1>
      </header>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-4">
        {cart.map((item) => (
          <div 
            key={`${item.id}-${item.selectedColor}`}
            className="flex gap-4 bg-card p-3 rounded-xl border border-border"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-foreground line-clamp-2">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">Color:</span>
                  <div 
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: item.selectedColor }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="font-bold text-primary">${item.price} MXN</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 border-t border-border bg-background space-y-4">
        {/* Promo code */}
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Código de descuento"
            className="flex-1 h-12 px-4 rounded-lg border border-border bg-background text-foreground"
          />
          <Button variant="outline" className="h-12 px-6 bg-transparent">
            Aplicar
          </Button>
        </div>

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>${cartTotal} MXN</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Envío</span>
            <span>{cartTotal >= 500 ? "Gratis" : "$99 MXN"}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">${cartTotal + (cartTotal >= 500 ? 0 : 99)} MXN</span>
          </div>
        </div>

        <Button 
          onClick={() => setStep("checkout")}
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
        >
          Continuar al pago
        </Button>
      </div>
    </div>
  )
}
