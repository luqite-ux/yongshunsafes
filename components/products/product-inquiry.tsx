'use client'

import { InquiryForm } from '@/components/forms/inquiry-form'
import { useProductModel } from '@/components/products/product-model-provider'

export function ProductInquiry({ productName,minimumOrder }: { productName: string;minimumOrder?:number }) {
  const { model } = useProductModel()
  return <InquiryForm scope="product" productName={productName} modelName={model.name} minimumOrder={minimumOrder} />
}
