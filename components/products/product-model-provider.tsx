'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ProductModel } from '@/lib/products'

interface Ctx {
  models: ProductModel[]
  model: ProductModel
  setModelId: (id: string) => void
}

const ModelContext = createContext<Ctx | null>(null)

export function ProductModelProvider({ models, children }: { models: ProductModel[]; children: ReactNode }) {
  const [modelId, setModelId] = useState(models[0].id)
  const value = useMemo(
    () => ({ models, model: models.find((m) => m.id === modelId) ?? models[0], setModelId }),
    [models, modelId],
  )
  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
}

export function useProductModel() {
  const ctx = useContext(ModelContext)
  if (!ctx) throw new Error('useProductModel must be used inside ProductModelProvider')
  return ctx
}
