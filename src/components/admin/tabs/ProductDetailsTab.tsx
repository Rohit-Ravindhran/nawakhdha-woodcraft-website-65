
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import ProductEditor from "@/components/admin/ProductEditor";
import { useProducts, useDeleteProduct } from "@/hooks/content";
import { toast } from "sonner";
import { ProductData } from "@/hooks/content/types";
import { transformGalleryImages } from "@/utils/imageHelpers";

const ProductDetailsTab = () => {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-border mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product Details Templates</h2>
        <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductEditor 
              onSave={() => setIsAddingProduct(false)}
              isLoading={false} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-md p-4 mb-6">
        <h3 className="text-md font-medium mb-2">About Product Details</h3>
        <p className="text-sm text-muted-foreground mb-2">
          This section allows you to manage product details templates that can be reused across your website.
          Each product includes:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
          <li>Product name</li>
          <li>Full description</li>
          <li>Category assignment</li>
          <li>Image gallery</li>
          <li>SEO metadata (title, description, keywords)</li>
        </ul>
      </div>
      
      {loadingProducts ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
          {products && products.length > 0 ? (
            products.map((product) => {
              // Safely transform the product data to match the expected type
              const transformedProduct: ProductData & { id: number } = {
                id: product.id,
                product_name: product.product_name,
                description: product.description,
                category_name: product.category_name,
                // Add SEO fields with safe defaults
                seo_title: product.seo_title || "",
                seo_description: product.seo_description || "",
                seo_keywords: product.seo_keywords || "",
                // Safely transform gallery_images
                gallery_images: transformGalleryImages(product.gallery_images)
              };
              
              return (
                <ProductListItem 
                  key={transformedProduct.id} 
                  product={transformedProduct}
                  onDelete={handleDeleteProduct}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No products found. Add your first product!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ProductListItemProps {
  product: ProductData & { id: number };
  onDelete: (id: number) => void;
}

const ProductListItem = ({ product, onDelete }: ProductListItemProps) => {
  return (
    <div className="flex flex-col p-4 border rounded-md gap-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{product.product_name}</h3>
        <span className="text-xs bg-slate-100 px-2 py-1 rounded">{product.category_name}</span>
      </div>
      
      {product.gallery_images && product.gallery_images.length > 0 && (
        <div className="h-32 rounded-md overflow-hidden">
          <img 
            src={product.gallery_images[0].url} 
            alt={product.gallery_images[0].alt || product.product_name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      
      <div className="flex justify-end space-x-2 mt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Edit</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductEditor 
              product={product}
              isLoading={false}
            />
          </DialogContent>
        </Dialog>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(product.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsTab;
