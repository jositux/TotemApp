"use client"

import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { 
  selectionAtom, currentStepAtom, stepProgressAtom, 
  stepsPathAtom, initialSelection, SelectionState 
} from '@/lib/store'

export function useApp() {
  const [isMounted, setIsMounted] = useState(false)
  const selection = useAtomValue(selectionAtom)
  const currentStep = useAtomValue(currentStepAtom)
  const progress = useAtomValue(stepProgressAtom)
  const stepsPath = useAtomValue(stepsPathAtom)
  const setStep = useSetAtom(currentStepAtom)
  const setSelection = useSetAtom(selectionAtom)

  useEffect(() => { setIsMounted(true) }, [])

  const updateSelection = (data: Partial<SelectionState>) => {
    setSelection((prev) => ({ ...prev, ...data }))
  }

  const resetApp = () => {
    setSelection(initialSelection)
    setStep('onboarding')
  }

  return {
    selection: isMounted ? selection : initialSelection,
    currentStep: isMounted ? currentStep : 'onboarding',
    progress,
    stepsPath,
    setStep,
    updateSelection,
    resetApp,
    isHydrated: isMounted
  }
}