"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface SelectionState {
  brand: string | null;
  model: string | null;
  comboId: string | null;
  micaId: string | null;
  caseId: string | null;
  caseColor: string | null;
  caseType: string | null;
  // --- ESTADO DE IMAGEN CON INDICADOR DE ORIGEN ---
  imageSourceType: "brand" | "custom" | null; // Indica qué quedó seleccionado
  imageBrandId: string | null;   // ID de imagen de catálogo (Disney, etc)
  imageCustomId: string | null;  // ID o URL de imagen subida por usuario
  selectedBrandTag: string | null; // Nombre de la marca (ej: "Disney")
  imageConfig: {
    orientation: "Vertical" | "Horizontal";
    size: "Grande" | "Mediana" | "Pequeña";
  } | null;
}

interface AppState {
  currentStep:
    | "onboarding"
    | "phone-selector"
    | "combo-selector"
    | "mica-selector"
    | "case-selector"
    | "image-selector"
    | "auth"
    | "final-summary";
  selection: SelectionState;
}

interface AppContextType extends AppState {
  setStep: (step: AppState["currentStep"]) => void;
  updateSelection: (data: Partial<SelectionState>) => void;
  resetImage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentStep: "onboarding",
    selection: {
      brand: null,
      model: null,
      comboId: null,
      micaId: null,
      caseId: null,
      caseType: null,
      caseColor: null,
      imageSourceType: null, // Inicialmente nada
      imageBrandId: null,
      imageCustomId: null,
      selectedBrandTag: null,
      imageConfig: null,
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("telcel_selection");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((prev) => ({ 
          ...prev, 
          selection: { ...prev.selection, ...parsed } 
        }));
      } catch (e) {
        console.error("Error cargando selección", e);
      }
    }
  }, []);

  const setStep = (step: AppState["currentStep"]) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const updateSelection = (data: Partial<SelectionState>) => {
    setState((prev) => {
      const newSelection = { ...prev.selection, ...data };
      localStorage.setItem("telcel_selection", JSON.stringify(newSelection));
      return { ...prev, selection: newSelection };
    });
  };

  const resetImage = () => {
    updateSelection({
      imageSourceType: null,
      imageBrandId: null,
      imageCustomId: null,
      selectedBrandTag: null,
      imageConfig: null
    });
  };

  return (
    <AppContext.Provider value={{ ...state, setStep, updateSelection, resetImage }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};