
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '@/hooks/content/useProductDetails';
import { useProductBySlug } from '@/hooks/content/useProductBySlug';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductMainContent } from '@/components/products/ProductMainContent';
import { ProductGalleryGrid } from '@/components/products/ProductGalleryGrid';
import { ProductLoading } from '@/components/products/ProductLoading';
import { ProductNotFound } from '@/components/products/ProductNotFound';
import { Helmet } from 'react-helmet-async';
import { Separator } from '@/components/ui/separator';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  console.log('ProductDetailPage: Rendering with slug:', slug);
  
  // Step 1: Find the product by slug
  const { 
    data: productCategory,
    isLoading: loadingCategory,
    error: categoryError 
  } = useProductBySlug(slug);

  // Step 2: Fetch product details only when we have a category ID
  const { 
    data: productData,
    isLoading: loadingProductData,
    error: productDataError 
  } = useProductDetail(productCategory?.id, {
    enabled: !!productCategory?.id // Only fetch when ID exists
  });
  
  const isLoading = loadingCategory || loadingProductData;
  
  console.log('ProductDetailPage: State:', {
    slug,
    productCategory: productCategory?.id,
    productData: !!productData,
    isLoading,
    categoryError: categoryError?.message,
    productDataError: productDataError?.message
  });
  
  if (isLoading) {
    console.log('ProductDetailPage: Showing loading state');
    return <ProductLoading />;
  }

  // Enhanced error handling - check both category and product data errors
  if (categoryError || productDataError) {
    console.error('ProductDetailPage: Error occurred:', { categoryError, productDataError });
    return <ProductNotFound />;
  }

  // Data hydration guard - ensure we have the basic category data
  if (!productCategory) {
    console.log('ProductDetailPage: No product category found');
    return <ProductNotFound />;
  }

  // Get the product details and description (productData is optional)
  const description = productData?.description || productCategory.description || "";
  const categoryName = productCategory.category_name || "";
  const productName = productData?.product_name || productCategory.product_name || categoryName;
  
  // Choose the first gallery image as featured, or fall back to category image
  const featuredImage = productData?.gallery_images?.length > 0 
    ? productData.gallery_images[0].url 
    : productCategory.category_image_url;
    
  const featuredImageAlt = productData?.gallery_images?.length > 0
    ? productData.gallery_images[0].alt
    : productCategory.alt_text;
    
  // SEO metadata - prioritize productData, fallback to category
  const seoTitle = productData?.seo_title || productCategory.seo_title || productName;
  const seoDescription = productData?.seo_description || productCategory.seo_description || description.substring(0, 160);
  const seoKeywords = productData?.seo_keywords || productCategory.seo_keywords || '';
  
  // Gallery images with fallback handling
  const galleryImages = productData?.gallery_images ? [...productData.gallery_images] : [];
  
  // Sort images by position if available
  galleryImages.sort((a, b) => {
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    }
    return 0;
  });
  
  console.log('ProductDetailPage: Rendering product:', {
    categoryName,
    productName,
    hasDescription: !!description,
    galleryCount: galleryImages.length,
    hasFeaturedImage: !!featuredImage
  });
  
  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {featuredImage && <meta property="og:image" content={featuredImage} />}
        <meta property="og:type" content="product" />
      </Helmet>
      
      <div className="py-12">
        <div className="container-custom">
          <ProductHeader 
            categoryName={categoryName} 
            productName={productName} 
          />
          
          <ProductMainContent 
            featuredImage={featuredImage}
            featuredImageAlt={featuredImageAlt}
            productName={productName}
            description={description}
            categoryName={categoryName}
            productSlug={productCategory.slug}
          />
          
          {galleryImages.length > 0 && (
            <>
              <Separator className="my-10" />
              <ProductGalleryGrid 
                images={galleryImages}
                productName={productName}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
