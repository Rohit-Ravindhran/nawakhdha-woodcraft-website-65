
// Re-export all product hooks for easy imports
export * from './types';
export * from './useBasicHomeProducts';
export * from './useHomeProductsWithCategories';
export * from './useProductMutations';

// Export aliased version for backward compatibility
import { useBasicHomeProducts } from './useBasicHomeProducts';

export const useHomeProducts = useBasicHomeProducts;
