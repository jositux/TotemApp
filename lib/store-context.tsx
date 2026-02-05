"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  colors: string[]
}

export interface CartItem extends Product {
  quantity: number
  selectedColor: string
}

export interface User {
  name: string
  email: string
  phone?: string
}

interface AppState {
  currentStep: 
    | "onboarding"
    | "auth"
    | "home"
    | "product"
    | "cart"
    | "checkout"
    | "address"
    | "payment"
    | "confirmation"
  onboardingStep: number
  authMode: "login" | "register"
  user: User | null
  cart: CartItem[]
  selectedProduct: Product | null
  selectedCategory: string
  orderNumber: string | null
}

interface AppContextType extends AppState {
  setStep: (step: AppState["currentStep"]) => void
  setOnboardingStep: (step: number) => void
  setAuthMode: (mode: "login" | "register") => void
  login: (user: User) => void
  logout: () => void
  addToCart: (product: Product, color: string) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  selectProduct: (product: Product | null) => void
  setCategory: (category: string) => void
  completeOrder: () => void
  cartTotal: number
  cartCount: number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentStep: "onboarding",
    onboardingStep: 0,
    authMode: "login",
    user: null,
    cart: [],
    selectedProduct: null,
    selectedCategory: "Todos",
    orderNumber: null,
  })

  const setStep = (step: AppState["currentStep"]) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }

  const setOnboardingStep = (step: number) => {
    setState((prev) => ({ ...prev, onboardingStep: step }))
  }

  const setAuthMode = (mode: "login" | "register") => {
    setState((prev) => ({ ...prev, authMode: mode }))
  }

  const login = (user: User) => {
    setState((prev) => ({ ...prev, user, currentStep: "home" }))
  }

  const logout = () => {
    setState((prev) => ({ ...prev, user: null, currentStep: "auth" }))
  }

  const addToCart = (product: Product, color: string) => {
    setState((prev) => {
      const existingItem = prev.cart.find(
        (item) => item.id === product.id && item.selectedColor === color
      )
      if (existingItem) {
        return {
          ...prev,
          cart: prev.cart.map((item) =>
            item.id === product.id && item.selectedColor === color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...prev,
        cart: [...prev.cart, { ...product, quantity: 1, selectedColor: color }],
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== productId),
    }))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter((item) => item.quantity > 0),
    }))
  }

  const clearCart = () => {
    setState((prev) => ({ ...prev, cart: [] }))
  }

  const selectProduct = (product: Product | null) => {
    setState((prev) => ({ ...prev, selectedProduct: product }))
  }

  const setCategory = (category: string) => {
    setState((prev) => ({ ...prev, selectedCategory: category }))
  }

  const completeOrder = () => {
    const orderNum = `ORD-${Date.now().toString(36).toUpperCase()}`
    setState((prev) => ({
      ...prev,
      orderNumber: orderNum,
      cart: [],
      currentStep: "confirmation",
    }))
  }

  const cartTotal = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const cartCount = state.cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <AppContext.Provider
      value={{
        ...state,
        setStep,
        setOnboardingStep,
        setAuthMode,
        login,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        selectProduct,
        setCategory,
        completeOrder,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
