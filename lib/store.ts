import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// 1. Tipado del Estado
export interface SelectionState {
  brand: string | null;
  model: string | null;
  comboId: string | null;
  micaId: string | null;
  caseId: string | null;
  caseColor: string | null;
  caseType: string | null;
  imageSourceType: "brand" | "custom" | null;
  imageBrandId: string | null;
  imageCustomId: string | null;
  selectedBrandTag: string | null;
  imageConfig: {
    orientation: "Vertical" | "Horizontal";
    size: "Grande" | "Mediana" | "Pequeña";
  } | null;
}

export type StepType = 
  | "onboarding"
  | "phone-selector"
  | "combo-selector"
  | "mica-selector"
  | "case-selector"
  | "image-selector"
  | "auth"
  | "final-summary";

// 2. Valores Iniciales
const initialSelection: SelectionState = {
  brand: null,
  model: null,
  comboId: null,
  micaId: null,
  caseId: null,
  caseType: null,
  caseColor: null,
  imageSourceType: null,
  imageBrandId: null,
  imageCustomId: null,
  selectedBrandTag: null,
  imageConfig: null,
};

// 3. Configuración de Storage segura para SSR
const storage = createJSONStorage<any>(() => 
  typeof window !== 'undefined' ? localStorage : ({} as Storage)
);

export const selectionAtom = atomWithStorage<SelectionState>(
  'telcel_selection', 
  initialSelection,
  storage
);

export const currentStepAtom = atomWithStorage<StepType>(
  'telcel_step', 
  'onboarding',
  storage
);

/**
 * 4. Átomos de Acción
 */

// Actualizar selección parcialmente
export const updateSelectionAction = atom(
  null,
  (get, set, data: Partial<SelectionState>) => {
    const prev = get(selectionAtom);
    set(selectionAtom, { ...prev, ...data });
  }
);

// Resetear solo la imagen
export const resetImageAction = atom(
  null,
  (get, set) => {
    const prev = get(selectionAtom);
    set(selectionAtom, {
      ...prev,
      imageSourceType: null,
      imageBrandId: null,
      imageCustomId: null,
      selectedBrandTag: null,
      imageConfig: null,
    });
  }
);

// Reset total de la aplicación (Vuelve al origen)
export const resetAppAction = atom(
  null,
  (get, set) => {
    set(selectionAtom, initialSelection);
    set(currentStepAtom, 'onboarding');
  }
);