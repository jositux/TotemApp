"use client"

import { useApp } from "@/lib/store-context"
import { Onboarding } from "./onboarding"
import { Auth } from "./auth"
import { Home } from "./home"
import { ProductDetail } from "./product-detail"
import { Cart } from "./cart"
import { Checkout } from "./checkout"
import { Confirmation } from "./confirmation"

export function AppShell() {
  const { currentStep } = useApp()

  return (
    <div className="min-h-screen bg-muted flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen bg-background relative overflow-hidden">
        {currentStep === "onboarding" && <Onboarding />}
        {currentStep === "auth" && <Auth />}
        {currentStep === "home" && <Home />}
        {currentStep === "product" && <ProductDetail />}
        {currentStep === "cart" && <Cart />}
        {(currentStep === "checkout" || currentStep === "address" || currentStep === "payment") && <Checkout />}
        {currentStep === "confirmation" && <Confirmation />}
      </div>
    </div>
  )
}
