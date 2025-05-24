
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategoryData, ProductDetailData, GalleryImage } from './types';

export function useProductDetail(productId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['product_detail', productId],
    queryFn: async (): Promise<(ProductCategoryData & ProductDetailData & { 
      gallery_images: GalleryImage[] 
    }) | null> => {
      if (!productId) {
        console.log('useProductDetail: No productId provided');
        return null;
      }
      
      console.log('useProductDetail: Fetching details for productId:', productId);
      
      let categoryRecord = null;
      let homeProductRecord = null;
      let actualCategoryId = null;
      
      // Step 1: Try to get category data by ID first
      console.log('useProductDetail: Step 1 - Querying product_categories by ID...');
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', productId);
        
      console.log('useProductDetail: Category by ID query result:', {
        data: categoryData,
        error: categoryError,
        searchingForId: productId
      });

      if (categoryData && categoryData.length > 0) {
        categoryRecord = categoryData[0];
        actualCategoryId = categoryRecord.id;
        console.log('useProductDetail: Found category by ID:', categoryRecord);
      } else {
        // Step 2: Try to find by home_products ID
        console.log('useProductDetail: No category found by ID, trying home_products...');
        
        const { data: homeProductData, error: homeProductError } = await supabase
          .from('home_products')
          .select('*')
          .eq('id', productId);
          
        console.log('useProductDetail: Home product by ID lookup:', {
          data: homeProductData,
          error: homeProductError,
          searchedId: productId
        });
        
        if (homeProductData && homeProductData.length > 0) {
          homeProductRecord = homeProductData[0];
          console.log('useProductDetail: Found home product by ID:', homeProductRecord);
          
          // Step 3: Enhanced category matching by category_name from home_products
          if (homeProductRecord.category_name) {
            console.log('useProductDetail: Looking for category by name:', homeProductRecord.category_name);
            
            // Create specific mapping for known mismatches
            const categoryMappings = {
              'Outdoor Wooden Furniture': 'Outdoor Furniture',
              'Western Wooden Doors': 'Modern Design Doors',
              'Western Design Doors': 'Modern Design Doors'
            };
            
            const mappedCategoryName = categoryMappings[homeProductRecord.category_name] || homeProductRecord.category_name;
            console.log('useProductDetail: Mapped category name:', {
              original: homeProductRecord.category_name,
              mapped: mappedCategoryName
            });
            
            // First try exact match with original name
            const { data: categoryByName, error: categoryByNameError } = await supabase
              .from('product_categories')
              .select('*')
              .eq('category_name', homeProductRecord.category_name);
              
            console.log('useProductDetail: Category by exact name lookup:', {
              data: categoryByName,
              error: categoryByNameError,
              categoryName: homeProductRecord.category_name
            });
            
            if (categoryByName && categoryByName.length > 0) {
              categoryRecord = categoryByName[0];
              actualCategoryId = categoryRecord.id;
              console.log('useProductDetail: Found category by exact name, actualCategoryId:', actualCategoryId);
            } else if (mappedCategoryName !== homeProductRecord.category_name) {
              // Try with mapped name
              console.log('useProductDetail: Trying mapped category name:', mappedCategoryName);
              const { data: categoryByMapped, error: categoryByMappedError } = await supabase
                .from('product_categories')
                .select('*')
                .eq('category_name', mappedCategoryName);
                
              console.log('useProductDetail: Category by mapped name lookup:', {
                data: categoryByMapped,
                error: categoryByMappedError,
                mappedName: mappedCategoryName
              });
              
              if (categoryByMapped && categoryByMapped.length > 0) {
                categoryRecord = categoryByMapped[0];
                actualCategoryId = categoryRecord.id;
                console.log('useProductDetail: Found category by mapped name, actualCategoryId:', actualCategoryId);
              }
            }
            
            // If still no match, try case-insensitive search
            if (!categoryRecord) {
              console.log('useProductDetail: Trying case-insensitive category search...');
              const { data: categoryInsensitive, error: categoryInsensitiveError } = await supabase
                .from('product_categories')
                .select('*')
                .ilike('category_name', homeProductRecord.category_name);
                
              console.log('useProductDetail: Case-insensitive category search:', {
                data: categoryInsensitive,
                error: categoryInsensitiveError
              });
              
              if (categoryInsensitive && categoryInsensitive.length > 0) {
                categoryRecord = categoryInsensitive[0];
                actualCategoryId = categoryRecord.id;
                console.log('useProductDetail: Found category with case-insensitive search, actualCategoryId:', actualCategoryId);
              }
            }
            
            // If still no match, try smart partial matching (more restrictive)
            if (!categoryRecord) {
              const originalName = homeProductRecord.category_name;
              console.log('useProductDetail: Trying smart partial matching for:', originalName);
              
              // Strategy 1: Look for key category words with higher specificity
              const keywordMappings = {
                'outdoor wooden furniture': ['Outdoor Furniture'],
                'wardrobes': ['Wardrobes'],
                'western wooden doors': ['Modern Design Doors'],
                'western design doors': ['Modern Design Doors']
              };
              
              const lowerOriginal = originalName.toLowerCase();
              const matchingKeywords = keywordMappings[lowerOriginal];
              
              if (matchingKeywords) {
                console.log('useProductDetail: Found keyword mapping for:', lowerOriginal, 'trying:', matchingKeywords);
                
                for (const keyword of matchingKeywords) {
                  const { data: keywordMatch, error: keywordError } = await supabase
                    .from('product_categories')
                    .select('*')
                    .ilike('category_name', `%${keyword}%`);
                    
                  console.log('useProductDetail: Keyword match result:', {
                    keyword,
                    data: keywordMatch,
                    error: keywordError
                  });
                  
                  if (keywordMatch && keywordMatch.length > 0) {
                    categoryRecord = keywordMatch[0];
                    actualCategoryId = categoryRecord.id;
                    console.log('useProductDetail: Found category with keyword mapping, actualCategoryId:', actualCategoryId);
                    break;
                  }
                }
              }
              
              // Strategy 2: Only if no keyword mapping, try individual words (but be more selective)
              if (!categoryRecord) {
                const words = originalName.split(/\s+/).filter(word => 
                  word.length > 3 && // Only words longer than 3 characters
                  !['wooden', 'design', 'custom', 'luxury', 'modern'].includes(word.toLowerCase()) // Skip generic words
                );
                console.log('useProductDetail: Strategy 2 - Filtered meaningful words:', words);
                
                for (const word of words) {
                  console.log('useProductDetail: Strategy 2 - Trying word:', word);
                  const { data: wordMatch, error: wordError } = await supabase
                    .from('product_categories')
                    .select('*')
                    .ilike('category_name', `%${word}%`);
                    
                  console.log('useProductDetail: Strategy 2 word match result:', {
                    word,
                    data: wordMatch,
                    error: wordError
                  });
                  
                  if (wordMatch && wordMatch.length > 0) {
                    // Additional validation: make sure it's a reasonable match
                    const match = wordMatch[0];
                    const matchName = match.category_name?.toLowerCase() || '';
                    const originalLower = originalName.toLowerCase();
                    
                    // Check if this makes sense (avoid matching "outdoor" to "outdoor swings" when looking for "outdoor furniture")
                    const isGoodMatch = 
                      matchName.includes('furniture') && originalLower.includes('furniture') ||
                      matchName.includes('wardrobe') && originalLower.includes('wardrobe') ||
                      matchName.includes('door') && originalLower.includes('door');
                    
                    if (isGoodMatch) {
                      categoryRecord = match;
                      actualCategoryId = categoryRecord.id;
                      console.log('useProductDetail: Found category with Strategy 2 (validated word match), actualCategoryId:', actualCategoryId);
                      break;
                    } else {
                      console.log('useProductDetail: Skipping potential match as not semantically appropriate:', {
                        found: matchName,
                        looking: originalLower
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      // Step 4: If we still don't have a category, create synthetic one from home product
      if (!categoryRecord && homeProductRecord) {
        console.log('useProductDetail: Creating synthetic category from home product');
        categoryRecord = {
          id: homeProductRecord.id,
          category_name: homeProductRecord.category_name,
          category_image_url: homeProductRecord.image_url,
          alt_text: homeProductRecord.alt_text,
          category_slug: productId,
          product_name: homeProductRecord.category_name
        };
        // For synthetic categories, we can't fetch details since there's no real category_id
        actualCategoryId = null;
        console.log('useProductDetail: Created synthetic category:', categoryRecord);
      }
      
      if (!categoryRecord) {
        console.log('useProductDetail: No category data found');
        return null;
      }
      
      let detailData = null;
      
      // Step 5: Get product details using the ACTUAL category ID (not home product ID)
      if (actualCategoryId) {
        console.log('useProductDetail: Step 5 - Fetching product_category_details for ACTUAL category ID:', actualCategoryId);
        
        const { data: detailDataResult, error: detailError } = await supabase
          .from('product_category_details')
          .select('*')
          .eq('category_id', actualCategoryId)
          .maybeSingle();
          
        console.log('useProductDetail: Detail query result:', {
          data: detailDataResult,
          error: detailError,
          actualCategoryId: actualCategoryId,
          hasDescription: !!detailDataResult?.description,
          hasProductName: !!detailDataResult?.product_name
        });
        
        detailData = detailDataResult;
      } else {
        console.log('useProductDetail: Skipping product_category_details fetch - no actual category ID');
      }
      
      // Step 6: Get gallery images
      const gallerySearchId = actualCategoryId || categoryRecord.id;
      console.log('useProductDetail: Step 6 - Fetching product_gallery for category:', gallerySearchId);
      const { data: galleryData, error: galleryError } = await supabase
        .from('product_gallery')
        .select('*')
        .eq('category_id', gallerySearchId)
        .order('position', { ascending: true });
        
      console.log('useProductDetail: Gallery query result:', {
        data: galleryData,
        error: galleryError,
        categoryId: gallerySearchId,
        galleryCount: galleryData?.length || 0
      });
      
      // Step 7: Get slug from home_products if we don't have it
      let finalSlug = homeProductRecord?.slug;
      if (!finalSlug && categoryRecord.category_name) {
        console.log('useProductDetail: Step 7 - Fetching slug from home_products...');
        const { data: homeProductSlug, error: homeProductSlugError } = await supabase
          .from('home_products')
          .select('slug')
          .eq('category_name', categoryRecord.category_name)
          .maybeSingle();
        
        console.log('useProductDetail: Home product slug query:', {
          data: homeProductSlug,
          error: homeProductSlugError,
          categoryName: categoryRecord.category_name
        });
        
        finalSlug = homeProductSlug?.slug;
      }
      
      // Step 8: Combine all data
      const result = {
        ...categoryRecord,
        ...(detailData || {}),
        slug: finalSlug,
        gallery_images: galleryData?.map(img => ({
          url: img.image_url,
          caption: img.caption,
          alt: img.alt_text,
          position: img.position
        })) || []
      };
      
      console.log('useProductDetail: Final result assembly:', {
        hasCategory: !!categoryRecord,
        hasDetails: !!detailData,
        galleryCount: result.gallery_images.length,
        hasSlug: !!result.slug,
        categoryName: result.category_name,
        productName: result.product_name,
        hasDescription: !!result.description,
        actualCategoryIdUsed: actualCategoryId,
        finalProductName: detailData?.product_name || categoryRecord.product_name || categoryRecord.category_name,
        dataSource: detailData ? 'product_category_details' : 'category_only',
        descriptionFromDetails: detailData?.description || 'No description found',
        partialMatchUsed: !!actualCategoryId && actualCategoryId !== productId,
        matchingStrategy: detailData ? 'successful_match' : 'synthetic_fallback'
      });
      
      return result;
    },
    enabled: options?.enabled !== false && !!productId,
    staleTime: 5 * 60 * 1000,
    retry: false // Disable retry for faster debugging
  });
}
