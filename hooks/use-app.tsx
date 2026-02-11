"use client";

import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { 
  selectionAtom, 
  currentStepAtom, 
  updateSelectionAction, 
  resetImageAction,
  resetAppAction 
} from '@/lib/store';

export function useApp() {
  const [isMounted, setIsMounted] = useState(false);
  
  const selection = useAtomValue(selectionAtom);
  const currentStep = useAtomValue(currentStepAtom);
  
  const setStep = useSetAtom(currentStepAtom);
  const updateSelection = useSetAtom(updateSelectionAction);
  const resetImage = useSetAtom(resetImageAction);
  const resetApp = useSetAtom(resetAppAction);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Si no está montado (SSR), devolvemos un estado vacío seguro
  if (!isMounted) {
    return {
      selection: { brand: null, model: null } as any,
      currentStep: "onboarding" as any,
      setStep: () => {},
      updateSelection: () => {},
      resetImage: () => {},
      resetApp: () => {},
      isHydrated: false
    };
  }

  return {
    selection,
    currentStep,
    setStep,
    updateSelection,
    resetImage,
    resetApp,
    isHydrated: true
  };
}