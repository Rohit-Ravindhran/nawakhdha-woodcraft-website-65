
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

export interface Product {
  id: number;
  product_name: string;
}

const ProductsTab = () => {
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
        <h2 className="text-xl font-bold">Manage Products</h2>
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
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {loadingProducts ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductListItem 
                key={product.id} 
                product={product as ProductData & { id: number }}
                onDelete={handleDeleteProduct}
              />
            ))
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
    <div className="flex justify-between items-center p-4 border rounded-md">
      <span>{product.product_name}</span>
      <div className="space-x-2">
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

export default ProductsTab;
