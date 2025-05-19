
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '@/hooks/content/useProductDetails';
import { useProductBySlug } from '@/hooks/content/useProductBySlug';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductMainContent } from '@/components/products/ProductMainContent';
import { ProductGalleryGrid } from '@/components/products/ProductGalleryGrid';
import { ProductLoading } from '@/components/products/ProductLoading';
import { ProductNotFound } from '@/components/products/ProductNotFound';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Use our new hook to find the product by slug
  const { 
    data: productCategory,
    isLoading: loadingCategory,
    error: categoryError 
  } = useProductBySlug(slug);

  // Use the enhanced product detail hook to fetch product details including gallery
  const { 
    data: productData,
    isLoading: loadingProductData
  } = useProductDetail(productCategory?.id);
  
  const isLoading = loadingCategory || loadingProductData;
  
  if (isLoading) {
    return <ProductLoading />;
  }

  if (categoryError || !productCategory) {
    return <ProductNotFound />;
  }

  // Get the product details and description
  const description = productData?.description || productCategory.description || "";
  const categoryName = productCategory.category_name || "";
  const productName = productData?.product_name || productCategory.product_name || categoryName;
  const featuredImage = productData?.gallery_images?.length > 0 
    ? productData.gallery_images[0].url 
    : productCategory.category_image_url;
  const featuredImageAlt = productData?.gallery_images?.length > 0
    ? productData.gallery_images[0].alt
    : productCategory.alt_text;
  
  return (
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
          galleryImages={productData?.gallery_images}
        />
        
        {/* Product Gallery Grid */}
        {productData?.gallery_images && productData.gallery_images.length > 0 && (
          <ProductGalleryGrid 
            images={productData.gallery_images}
            productName={productName}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
