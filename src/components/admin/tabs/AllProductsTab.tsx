
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

const AllProductsTab = () => {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };
  
  const handleProductUpdate = () => {
    setIsAddingProduct(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-border mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Products</h2>
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
              onProductUpdated={handleProductUpdate}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
          {products && products.length > 0 ? (
            products.map((product) => {
              // Ensure product has an id property
              const productWithRequiredId = {
                ...product,
                id: product.id || ''
              };
              
              return (
                <ProductListItem 
                  key={productWithRequiredId.id} 
                  product={productWithRequiredId}
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
  product: any;
  onDelete: (id: string) => void;
}

const ProductListItem = ({ product, onDelete }: ProductListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleProductUpdated = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center p-4 border rounded-md">
      <span>{product.product_name || product.category_name}</span>
      <div className="space-x-2">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Edit</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductEditor 
              productId={product.id}
              onProductUpdated={handleProductUpdated}
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

export default AllProductsTab;
