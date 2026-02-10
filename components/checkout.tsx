"use client"

import { useState } from "react"
import { useApp } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Truck,
  Check,
  ChevronRight
} from "lucide-react"

type CheckoutStep = "address" | "shipping" | "payment" | "review"

export function Checkout() {
  const { cart, cartTotal, setStep, completeOrder, user } = useApp()
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("address")
  const [addressData, setAddressData] = useState({
    street: "",
    colony: "",
    city: "",
    state: "",
    zipCode: "",
    reference: ""
  })
  const [shippingMethod, setShippingMethod] = useState("express")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  })

  const shippingCost = cartTotal >= 500 ? 0 : (shippingMethod === "express" ? 149 : 99)
  const total = cartTotal + shippingCost

  const steps = [
    { id: "address", label: "Dirección", icon: MapPin },
    { id: "shipping", label: "Envío", icon: Truck },
    { id: "payment", label: "Pago", icon: CreditCard },
    { id: "review", label: "Confirmar", icon: Check }
  ]

  const currentStepIndex = steps.findIndex(s => s.id === checkoutStep)

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCheckoutStep(steps[nextIndex].id as CheckoutStep)
    }
  }

  const handleBack = () => {
    if (currentStepIndex === 0) {
      setStep("cart")
    } else {
      setCheckoutStep(steps[currentStepIndex - 1].id as CheckoutStep)
    }
  }

  const handlePlaceOrder = () => {
    completeOrder()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-4 p-4 bg-background border-b border-border">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Checkout</h1>
      </header>

      {/* Progress Steps */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? "bg-primary text-primary-foreground" 
                      : isCurrent 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${
                    isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-8 mx-1 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Address Step */}
        {checkoutStep === "address" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Dirección de envío</h2>
            
            <div className="space-y-2">
              <Label htmlFor="street">Calle y número</Label>
              <Input
                id="street"
                placeholder="Av. Principal #123"
                value={addressData.street}
                onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colony">Colonia</Label>
              <Input
                id="colony"
                placeholder="Centro"
                value={addressData.colony}
                onChange={(e) => setAddressData({...addressData, colony: e.target.value})}
                className="h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="Ciudad de México"
                  value={addressData.city}
                  onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="CDMX"
                  value={addressData.state}
                  onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Código postal</Label>
              <Input
                id="zipCode"
                placeholder="06600"
                value={addressData.zipCode}
                onChange={(e) => setAddressData({...addressData, zipCode: e.target.value})}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Referencia (opcional)</Label>
              <Input
                id="reference"
                placeholder="Entre calle A y calle B"
                value={addressData.reference}
                onChange={(e) => setAddressData({...addressData, reference: e.target.value})}
                className="h-12"
              />
            </div>
          </div>
        )}

        {/* Shipping Step */}
        {checkoutStep === "shipping" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Método de envío</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => setShippingMethod("express")}
                className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                  shippingMethod === "express" 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Envío Express</p>
                    <p className="text-sm text-muted-foreground">24-48 horas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {cartTotal >= 500 ? "Gratis" : "$149 MXN"}
                    </p>
                    {cartTotal >= 500 && (
                      <p className="text-xs text-muted-foreground line-through">$149 MXN</p>
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShippingMethod("standard")}
                className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                  shippingMethod === "standard" 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Envío Estándar</p>
                    <p className="text-sm text-muted-foreground">3-5 días hábiles</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {cartTotal >= 500 ? "Gratis" : "$99 MXN"}
                    </p>
                    {cartTotal >= 500 && (
                      <p className="text-xs text-muted-foreground line-through">$99 MXN</p>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {cartTotal < 500 && (
              <div className="p-3 bg-accent/10 rounded-lg">
                <p className="text-sm text-accent">
                  Agrega ${500 - cartTotal} MXN más para obtener envío gratis.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payment Step */}
        {checkoutStep === "payment" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Método de pago</h2>
            
            {/* Payment methods */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 p-3 rounded-lg border-2 ${
                  paymentMethod === "card" 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                }`}
              >
                <CreditCard className="h-6 w-6 mx-auto mb-1" />
                <p className="text-xs">Tarjeta</p>
              </button>
              <button
                onClick={() => setPaymentMethod("oxxo")}
                className={`flex-1 p-3 rounded-lg border-2 ${
                  paymentMethod === "oxxo" 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                }`}
              >
                <span className="text-lg font-bold">OXXO</span>
                <p className="text-xs">Efectivo</p>
              </button>
              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`flex-1 p-3 rounded-lg border-2 ${
                  paymentMethod === "transfer" 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                }`}
              >
                <span className="text-lg">SPEI</span>
                <p className="text-xs">Transferencia</p>
              </button>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de tarjeta</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => setCardData({...cardData, number: e.target.value})}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                  <Input
                    id="cardName"
                    placeholder="NOMBRE APELLIDO"
                    value={cardData.name}
                    onChange={(e) => setCardData({...cardData, name: e.target.value})}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Fecha de expiración</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "oxxo" && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Se generará un código de pago que podrás presentar en cualquier tienda OXXO. 
                  Tu pedido será procesado una vez confirmado el pago.
                </p>
              </div>
            )}

            {paymentMethod === "transfer" && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Se te proporcionarán los datos bancarios para realizar la transferencia SPEI. 
                  Tu pedido será procesado una vez confirmado el pago.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Review Step */}
        {checkoutStep === "review" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Resumen del pedido</h2>
            
            {/* Shipping address */}
            <div className="p-4 bg-muted rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Dirección de envío
                </h3>
                <button 
                  onClick={() => setCheckoutStep("address")}
                  className="text-sm text-primary"
                >
                  Editar
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {addressData.street}, {addressData.colony}<br />
                {addressData.city}, {addressData.state} {addressData.zipCode}
              </p>
            </div>

            {/* Shipping method */}
            <div className="p-4 bg-muted rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Método de envío
                </h3>
                <button 
                  onClick={() => setCheckoutStep("shipping")}
                  className="text-sm text-primary"
                >
                  Editar
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {shippingMethod === "express" ? "Envío Express (24-48 horas)" : "Envío Estándar (3-5 días)"}
              </p>
            </div>

            {/* Payment method */}
            <div className="p-4 bg-muted rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Método de pago
                </h3>
                <button 
                  onClick={() => setCheckoutStep("payment")}
                  className="text-sm text-primary"
                >
                  Editar
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {paymentMethod === "card" && `Tarjeta terminada en ${cardData.number.slice(-4) || "****"}`}
                {paymentMethod === "oxxo" && "Pago en OXXO"}
                {paymentMethod === "transfer" && "Transferencia SPEI"}
              </p>
            </div>

            {/* Order items */}
            <div className="space-y-3">
              <h3 className="font-medium">Productos ({cart.length})</h3>
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedColor}`} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                    <p className="text-sm font-bold text-primary">${item.price * item.quantity} MXN</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-border bg-background space-y-4">
        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${cartTotal} MXN</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span>{shippingCost === 0 ? "Gratis" : `$${shippingCost} MXN`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">${total} MXN</span>
          </div>
        </div>

        <Button 
          onClick={checkoutStep === "review" ? handlePlaceOrder : handleNext}
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
        >
          {checkoutStep === "review" ? "Confirmar pedido" : "Continuar"}
          {checkoutStep !== "review" && <ChevronRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
