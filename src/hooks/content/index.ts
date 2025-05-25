// Re-export all hooks and types
export * from './usePages';
export * from './useProducts';
export * from './useProductCategories';
export * from './useProductDetails';
export * from './useProductBySlug';
export * from './useProductMutations';
export * from './useBlogs';
export * from './useGallery';
export * from './types';

// Export products by named exports to avoid type conflicts
export { useBasicHomeProducts } from './products/useBasicHomeProducts';
export { useHomeProductsWithCategories } from './products/useHomeProductsWithCategories';
export { useUpdateHomeProduct, useDeleteHomeProduct } from './products/useProductMutations';
export { useHomeContent } from './useHomeContent';

// Export json helpers (with corrected import path)
export * from '../../utils/jsonHelpers';

export { useBlogBySlug } from './useBlogBySlug';
