
// Re-export all product related hooks from separate files
export * from './useProductCategories';
export * from './useProductDetails';
export * from './useProductMutations';

// Add missing exports for compatibility with existing code
// These are re-exports of similar functions with different names
import { useProductCategories } from './useProductCategories';
import { useDeleteProductCategory } from './useProductMutations';

// Export aliases to maintain backward compatibility
export const useProducts = useProductCategories;
export const useDeleteProduct = useDeleteProductCategory;
