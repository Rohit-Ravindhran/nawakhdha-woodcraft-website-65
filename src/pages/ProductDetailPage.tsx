
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '@/hooks/content/useProductDetails';
import { useProductBySlug } from '@/hooks/content/useProductBySlug';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductMainContent } from '@/components/products/ProductMainContent';
import { ProductGalleryGrid } from '@/components/products/ProductGalleryGrid';
import { ProductLoading } from '@/components/products/ProductLoading';
import { ProductNotFound } from '@/components/products/ProductNotFound';
import { Separator } from '@/components/ui/separator';
import PageSEO from '@/components/seo/PageSEO';
import BreadcrumbNavigation from '@/components/ui/breadcrumb-navigation';
import InternalLinks from '@/components/seo/InternalLinks';

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
  
  console.log('ProductDetailPage: Current state analysis:', {
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
      galleryCount: productData.gallery_images?.length || 0,
      dataSource: productData.description ? 'has_details' : 'category_only'
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

  // Prioritize productData (from product_category_details) over productCategory
  const finalData = productData || productCategory;
  
  // Get the correct data with priority to detailed information
  const categoryName = finalData.category_name || "";
  
  // Product name priority: product_name from details > product_name from category > category_name
  const productName = (productData?.product_name) || 
                     (finalData.product_name) || 
                     (finalData.category_name) || "";
  
  // Description from product details (this is what was missing!)
  const description = (productData?.description) || "";
  
  // Choose the first gallery image as featured, or fall back to category image
  const featuredImage = finalData.gallery_images?.length > 0 
    ? finalData.gallery_images[0].url 
    : finalData.category_image_url;
    
  const featuredImageAlt = finalData.gallery_images?.length > 0
    ? finalData.gallery_images[0].alt
    : finalData.alt_text;
    
  // SEO metadata - prioritize from product details
  const seoTitle = (productData?.seo_title) || finalData.seo_title || `${productName} - Al Nawakhdha Furniture W.L.L`;
  const seoDescription = (productData?.seo_description) || finalData.seo_description || description.substring(0, 160) || `Premium ${productName} crafted by Al Nawakhdha Furniture in Bahrain. Custom wooden furniture manufacturing since 1975.`;
  const seoKeywords = (productData?.seo_keywords) || finalData.seo_keywords || `${productName}, furniture Bahrain, custom furniture, wooden furniture, Al Nawakhdha`;
  
  // Gallery images
  const galleryImages = finalData.gallery_images || [];
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: productName }
  ];
  
  // Related internal links
  const relatedLinks = [
    {
      title: 'All Products',
      href: '/products',
      description: 'Explore our complete collection of handcrafted furniture'
    },
    {
      title: 'Contact Us',
      href: '/contact',
      description: 'Get a custom quote for your furniture needs'
    },
    {
      title: 'About Us',
      href: '/about',
      description: 'Learn about our craftsmanship and heritage since 1975'
    }
  ];
  
  console.log('ProductDetailPage: Final data for rendering:', {
    categoryName,
    productName,
    hasDescription: !!description,
    descriptionLength: description.length,
    galleryCount: galleryImages.length,
    hasFeaturedImage: !!featuredImage,
    dataSource: productData ? 'productData_with_details' : 'productCategory_only',
    finalDataId: finalData.id,
    productDataExists: !!productData,
    productDataHasDescription: !!(productData?.description),
    productDataProductName: productData?.product_name
  });
  
  return (
    <>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={featuredImage}
        url={`/product/${slug}`}
        type="product"
      />
      
      <div className="py-6">
        <div className="container-custom">
          <BreadcrumbNavigation items={breadcrumbItems} className="mb-6" />
          
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
          
          <Separator className="my-10" />
          <InternalLinks 
            title="Related Pages" 
            links={relatedLinks}
            variant="grid"
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
