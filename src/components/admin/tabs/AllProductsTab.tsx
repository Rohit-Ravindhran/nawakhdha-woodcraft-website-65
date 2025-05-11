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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts, useDeleteProduct } from "@/hooks/content";
import { ProductData } from "@/hooks/content/types";
import { transformGalleryImages } from "@/utils/imageHelpers";
import CategoryEditor from "@/components/admin/editors/CategoryEditor";
import ProductEditor from "@/components/admin/ProductEditor";

// Product categories from the website
const PRODUCT_CATEGORIES = [
  "Doors - Western Designs",
  "Doors - Middle Eastern Designs",
  "Doors - Modern Designs",
  "TV Cabinets",
  "Kitchen Cabinets",
  "Wardrobes",
  "Dining Tables & Chairs",
  "Teapoy",
  "Wall Partitions",
  "Study Tables",
  "Wall Cladding",
  "Office Furniture",
  "Bedroom Furniture",
  "Dressing Tables",
  "Outdoor Swings",
  "Patio Furniture",
  "Walk-in Closets",
  "Parquet Flooring",
  "Book Shelves",
  "Showcases"
];

const AllProductsTab = () => {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  // Filter products by selected category
  const filteredProducts = activeCategory 
    ? products?.filter(product => product.category_name === activeCategory)
    : products;

  // Group products by category
  const productsByCategory = products?.reduce((acc, product) => {
    const category = product.category_name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  // Get unique categories that have products
  const existingCategories = productsByCategory 
    ? Object.keys(productsByCategory).sort()
    : [];

  // All categories (both from predefined list and existing products)
  const allCategories = [...new Set([...PRODUCT_CATEGORIES, ...existingCategories])].sort();

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-border mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">All Products</h2>
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryEditor 
              onSave={() => setIsAddingCategory(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Select Category</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Button>
          {allCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {loadingProducts ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {activeCategory ? (
            <CategoryProductList 
              category={activeCategory}
              products={filteredProducts || []} 
              onDelete={handleDeleteProduct}
            />
          ) : (
            <div className="space-y-8">
              {allCategories.map((category) => (
                <div key={category} className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">{category}</h3>
                  <CategoryProductList 
                    category={category}
                    products={(productsByCategory?.[category] || []) as ProductData[]} 
                    onDelete={handleDeleteProduct}
                    compact
                  />
                </div>
              ))}
            </div>
          )}
          
          {filteredProducts && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {activeCategory 
                ? `No products found in "${activeCategory}". Add your first product!`
                : "No products found. Add your first product!"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface CategoryProductListProps {
  category: string;
  products: ProductData[];
  onDelete: (id: string) => void;
  compact?: boolean;
}

const CategoryProductList = ({ category, products, onDelete, compact = false }: CategoryProductListProps) => {
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  if (products.length === 0 && compact) {
    return (
      <div className="text-muted-foreground text-sm mb-6">
        No products in this category yet.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {!compact && (
          <h3 className="text-lg font-semibold">{category}</h3>
        )}
        
        <div className="space-x-2">
          <Dialog open={isEditingCategory} onOpenChange={setIsEditingCategory}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">Edit Category</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Category: {category}</DialogTitle>
              </DialogHeader>
              <CategoryEditor 
                categoryName={category}
                onSave={() => setIsEditingCategory(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Product to {category}</DialogTitle>
              </DialogHeader>
              <ProductForm 
                defaultCategory={category}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {products.map((product) => {
          // Convert any numeric IDs to string to fix type issues
          const productWithStringId = {
            ...product,
            id: product.id?.toString() || ""
          };
          
          return (
            <ProductListItem 
              key={productWithStringId.id} 
              product={productWithStringId}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </>
  );
};

interface ProductListItemProps {
  product: ProductData & { id: string };
  onDelete: (id: string) => void;
}

// Use existing ProductListItem component
const ProductListItem = ({ product, onDelete }: ProductListItemProps) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md">
      <div className="flex items-center gap-3">
        {product.gallery_images && product.gallery_images.length > 0 && (
          <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
            <img 
              src={product.gallery_images[0].url} 
              alt={product.gallery_images[0].alt || product.product_name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <span>{product.product_name}</span>
      </div>
      <div className="space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Edit</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm 
              product={product}
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

// Update the ProductForm component to use our ProductEditor
const ProductForm = ({ product, defaultCategory }: { product?: ProductData & { id: string }, defaultCategory?: string }) => {
  const initialData = product ? {
    ...product
  } : defaultCategory ? {
    category_name: defaultCategory
  } : undefined;
  
  return (
    <ProductEditor 
      product={initialData}
      onComplete={() => {
        // Dialog will close automatically through parent component
      }}
    />
  );
};

export default AllProductsTab;
