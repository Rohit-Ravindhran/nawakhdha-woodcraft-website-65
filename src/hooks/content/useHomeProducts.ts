
// This file is now just a re-export wrapper for the refactored product hooks
// to maintain backward compatibility with existing code

export * from './products';

// Export the specialized hooks directly for better discovery
export { useHomeProductsWithCategories } from './products/useHomeProductsWithCategories';
export { useUpdateHomeProduct, useDeleteHomeProduct } from './products/useProductMutations';
