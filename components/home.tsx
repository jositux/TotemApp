"use client"

import React from "react"

import { useApp } from "@/lib/store-context"
import { products, categories } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  ShoppingCart, 
  User, 
  Home as HomeIcon, 
  Heart, 
  Bell,
  Menu,
  Sparkles,
  Palette,
  Gamepad2,
  Leaf,
  Star
} from "lucide-react"

const categoryIcons: Record<string, React.ReactNode> = {
  "Todos": <Sparkles className="h-5 w-5" />,
  "Arte": <Palette className="h-5 w-5" />,
  "Clásico": <Star className="h-5 w-5" />,
  "Gaming": <Gamepad2 className="h-5 w-5" />,
  "Naturaleza": <Leaf className="h-5 w-5" />,
}

export function Home() {
  const { 
    selectedCategory, 
    setCategory, 
    selectProduct, 
    setStep, 
    cartCount,
    user 
  } = useApp()

  const filteredProducts = selectedCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const handleProductClick = (product: typeof products[0]) => {
    selectProduct(product)
    setStep("product")
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-primary via-primary to-accent p-4 text-primary-foreground rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div>
              <p className="text-xs opacity-80">Bienvenido</p>
              <h1 className="text-lg font-bold">{user?.name || "Usuario"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-white/10 relative"
              onClick={() => setStep("cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-primary text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar fundas, modelos..." 
            className="pl-12 h-12 bg-white text-foreground rounded-full border-0 shadow-lg"
          />
        </div>
      </header>

      {/* Banner */}
      <div className="p-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
          <div className="relative z-10">
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
              OFERTA ESPECIAL
            </span>
            <h2 className="text-2xl font-bold mt-2">30% de descuento</h2>
            <p className="text-sm opacity-80 mt-1">En fundas seleccionadas</p>
            <Button className="mt-4 bg-white text-primary hover:bg-white/90 font-semibold">
              Ver ofertas
            </Button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
            <div className="w-full h-full bg-white rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="px-4 mb-2">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide bg-muted/50 p-1 rounded-full">
          {["Todos", "Nuevos", "Populares", "Ofertas"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCategory(tab === "Todos" ? "Todos" : tab)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                (tab === "Todos" && selectedCategory === "Todos") || selectedCategory === tab
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.slice(1).map((category) => (
            <button
              key={category}
              onClick={() => setCategory(category)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedCategory === category 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-background border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Productos populares</h3>
          <button className="text-sm text-primary font-medium">Ver todos</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-card rounded-xl overflow-hidden border border-border text-left hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  crossOrigin="anonymous"
                />
                <button 
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm text-foreground line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-primary font-bold">${product.price}</p>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md font-medium">
                    Agregar
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-3">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Inicio</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <Search className="h-6 w-6" />
            <span className="text-xs">Buscar</span>
          </button>
          <button 
            onClick={() => setStep("cart")}
            className="flex flex-col items-center gap-1 text-muted-foreground relative"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xs">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <Heart className="h-6 w-6" />
            <span className="text-xs">Favoritos</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <User className="h-6 w-6" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
