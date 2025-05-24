
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
    enabled: !!productCategory?.id
  });
  
  const isLoading = loadingCategory || loadingProductData;
  
  console.log('ProductDetailPage: Current state:', {
    slug,
    productCategory: productCategory ? {
      id: productCategory.id,
      category_name: productCategory.category_name,
      product_name: productCategory.product_name,
      hasSlug: !!productCategory.slug
    } : null,
    productData: productData ? {
      id: productData.id,
      category_name: productData.category_name,
      product_name: productData.product_name,
      hasDescription: !!productData.description,
      galleryCount: productData.gallery_images?.length || 0
    } : null,
    isLoading,
    categoryError: categoryError?.message,
    productDataError: productDataError?.message
  });
  
  if (isLoading) {
    console.log('ProductDetailPage: Showing loading state');
    return <ProductLoading />;
  }

  if (categoryError || productDataError) {
    console.error('ProductDetailPage: Error occurred:', { categoryError, productDataError });
    return <ProductNotFound />;
  }

  if (!productCategory) {
    console.log('ProductDetailPage: No product category found for slug:', slug);
    return <ProductNotFound />;
  }

  // Use productData if available (has detailed info), otherwise fall back to productCategory
  const finalData = productData || productCategory;
  
  const categoryName = finalData.category_name || "";
  
  // For product name, use the product_name from details if available
  const productName = finalData.product_name || finalData.category_name || "";
  
  // Use description from product details
  const description = finalData.description || "";
  
  // Choose the first gallery image as featured, or fall back to category image
  const featuredImage = finalData.gallery_images?.length > 0 
    ? finalData.gallery_images[0].url 
    : finalData.category_image_url;
    
  const featuredImageAlt = finalData.gallery_images?.length > 0
    ? finalData.gallery_images[0].alt
    : finalData.alt_text;
    
  // SEO metadata
  const seoTitle = finalData.seo_title || productName;
  const seoDescription = finalData.seo_description || description.substring(0, 160);
  const seoKeywords = finalData.seo_keywords || '';
  
  // Gallery images
  const galleryImages = finalData.gallery_images || [];
  
  console.log('ProductDetailPage: Rendering product with final data:', {
    categoryName,
    productName,
    hasDescription: !!description,
    galleryCount: galleryImages.length,
    hasFeaturedImage: !!featuredImage,
    dataSource: productData ? 'productData' : 'productCategory',
    finalDataId: finalData.id
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
            productSlug={finalData.slug}
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
