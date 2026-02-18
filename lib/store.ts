"use client"

import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

// 1. Tipos de Pasos (Integrando el estado PROMPT solicitado)
export type StepType = 
  | "onboarding" 
  | "phone-selector" 
  | "combo-selector" 
  | "mica-selector" 
  | "case-selector" 
  | "image-selector" 
  | "contact-form" 
  | "final-summary"

export type ImageSourceType = 'brand' | 'custom' | null;

// 2. Interfaz del Estado de Selección
export interface SelectionState {
  brand: string | null;
  model: string | null;
  comboId: string;
  micaId: string | null;
  caseId: string | null;
  caseColor: string;
  caseType: string;
  imageSourceType: ImageSourceType;
  imageBrandId: string | null;
  imageBrandConfig: any | null;
  selectedBrandTag: string | null;
  imageCustomUrl: string | null;
  imageCustomConfig: any | null;
  promptText: string; // Para el estado PROMPT
  image: {
    url: string | null;
    x: number;
    y: number;
    scale: number;
    rotate: number;
  };
  contact: { name: string; email: string; phone: string };
}

// 3. Configuración de Rutas (PROMPT incluido en combos con personalización de imagen)
export const COMBO_STEPS: Record<string, StepType[]> = {
  "combo1": ["onboarding", "phone-selector", "combo-selector", "mica-selector", "case-selector", "image-selector", "contact-form", "final-summary"],
  "combo2": ["onboarding", "phone-selector", "combo-selector", "mica-selector", "case-selector", "contact-form", "final-summary"],
  "combo3": ["onboarding", "phone-selector", "combo-selector", "case-selector", "image-selector", "contact-form", "final-summary"],
  "combo4": ["onboarding", "phone-selector", "combo-selector", "mica-selector", "contact-form", "final-summary"],
  "combo5": ["onboarding", "phone-selector", "combo-selector", "case-selector", "contact-form", "final-summary"],
}

const storage = createJSONStorage<any>(() => (typeof window !== 'undefined' ? localStorage : ({} as Storage)))

// 4. Estado Inicial
export const initialSelection: SelectionState = {
  brand: null,
  model: null,
  comboId: "combo1",
  micaId: null,
  caseId: null,
  caseColor: "Naranja",
  caseType: "Flexi",
  imageSourceType: null,
  imageBrandId: null,
  imageBrandConfig: null,
  selectedBrandTag: null,
  imageCustomUrl: null,
  imageCustomConfig: null,
  promptText: "",
  image: { url: null, x: 0, y: 0, scale: 1, rotate: 0 },
  contact: { name: "", email: "", phone: "" }
}

// 5. Átomos Principales
export const selectionAtom = atomWithStorage<SelectionState>('telcel_selection', initialSelection, storage)
export const currentStepAtom = atomWithStorage<StepType>('telcel_step', 'onboarding', storage)

// 6. REGISTRO DE DEMANDA (Format: "Marca: Busqueda")
// Aquí se guardarán los strings combinados que definimos en el PhoneSelector
export const missingBrandsAtom = atomWithStorage<string[]>('no-results-brand', [], storage)
export const missingModelsAtom = atomWithStorage<string[]>('no-results-model', [], storage)

// 7. Átomos Auxiliares
export const activeImageTabAtom = atom<"Licencias" | "Imagen personal">("Licencias")

// 8. Selectores Derivados
export const stepsPathAtom = atom((get) => {
  const selection = get(selectionAtom)
  return COMBO_STEPS[selection?.comboId] || COMBO_STEPS["combo1"]
})

export const stepProgressAtom = atom((get) => {
  const steps = get(stepsPathAtom) || []
  const currentStep = get(currentStepAtom)
  const currentIndex = steps.indexOf(currentStep)

  let visualStep = 0
  if (currentStep === "phone-selector") visualStep = 1
  else if (currentStep === "combo-selector") visualStep = 2
  else if (["mica-selector", "case-selector", "PROMPT", "image-selector"].includes(currentStep)) visualStep = 3
  else if (currentStep === "contact-form" || currentStep === "final-summary") visualStep = 4

  return {
    current: visualStep,
    total: 4,
    currentIndex,
    previous: (currentIndex > 0 ? steps[currentIndex - 1] : "onboarding") as StepType,
    next: (currentIndex < steps.length - 1 && currentIndex !== -1 ? steps[currentIndex + 1] : "final-summary") as StepType,
  }
})

export const totalSelectionPriceAtom = atom((get) => {
  const selection = get(selectionAtom);
  const comboPrices: Record<string, number> = {
    combo1: 899, combo2: 699, combo3: 599, combo4: 299, combo5: 399
  };
  const micaPrices: Record<string, number> = { m1: 0, m2: 150, m3: 200 };
  const basePrice = comboPrices[selection.comboId] || 0;
  const extraMica = selection.micaId ? (micaPrices[selection.micaId as string] || 0) : 0;
  return basePrice + extraMica;
});