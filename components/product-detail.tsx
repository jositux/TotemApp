"use client"

import { useState } from "react"
import { useApp } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Share2, Minus, Plus, ShoppingCart, Star } from "lucide-react"

export function ProductDetail() {
  const { selectedProduct, addToCart, setStep, cartCount } = useApp()
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!selectedProduct) {
    return null
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct, selectedProduct.colors[selectedColor])
    }
    setStep("cart")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setStep("home")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Detalle del producto</h1>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
          onClick={() => setStep("cart")}
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </header>

      {/* Product Image */}
      <div className="relative bg-muted">
        <img
          src={selectedProduct.image || "/placeholder.svg"}
          alt={selectedProduct.name}
          className="w-full aspect-square object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
              isFavorite ? "bg-red-500 text-white" : "bg-white text-muted-foreground"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Share2 className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full ${i === 0 ? "bg-primary" : "bg-white/50"}`} 
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 p-4 space-y-4">
        {/* Rating & Category */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {selectedProduct.category}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} 
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">(128)</span>
          </div>
        </div>

        {/* Name & Price */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{selectedProduct.name}</h2>
          <p className="text-2xl font-bold text-primary mt-2">${selectedProduct.price} MXN</p>
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          {selectedProduct.description}
        </p>

        {/* Colors */}
        <div>
          <h3 className="font-semibold mb-3">Color</h3>
          <div className="flex gap-3">
            {selectedProduct.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(index)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === index 
                    ? "border-primary scale-110" 
                    : "border-border"
                }`}
                style={{ 
                  backgroundColor: color === "transparent" ? "#f0f0f0" : color 
                }}
              >
                {color === "transparent" && (
                  <span className="text-xs text-muted-foreground">T</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <h3 className="font-semibold mb-3">Cantidad</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-muted-foreground">
              Total: <span className="text-foreground font-bold">${selectedProduct.price * quantity} MXN</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 p-4 bg-background border-t border-border">
        <Button 
          onClick={handleAddToCart}
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar al carrito
        </Button>
      </div>
    </div>
  )
}
