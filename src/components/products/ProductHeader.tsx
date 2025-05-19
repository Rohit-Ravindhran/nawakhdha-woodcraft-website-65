
import React from 'react';
import SectionTitle from '@/components/ui/section-title';

interface ProductHeaderProps {
  categoryName: string;
  productName: string;
}

export function ProductHeader({ categoryName, productName }: ProductHeaderProps) {
  return (
    <SectionTitle
      title={categoryName}
      subtitle={productName !== categoryName ? productName : ""}
      centered
    />
  );
}
