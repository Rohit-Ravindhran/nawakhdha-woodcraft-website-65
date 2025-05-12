
// This file now re-exports hooks from separate mutation files
// for better code organization and maintainability

import { useUpdateProduct } from './mutations/useUpdateProduct';
import { useDeleteProduct } from './mutations/useDeleteProduct';
import { useCreateProduct } from './mutations/useCreateProduct';

// Export the hooks with their original names for backward compatibility
export const useUpdateProductCategory = useUpdateProduct;
export const useDeleteProductCategory = useDeleteProduct;
export const useCreateProductCategory = useCreateProduct;

// Also export the hooks with their new names for forward compatibility
export { useUpdateProduct, useDeleteProduct, useCreateProduct };
