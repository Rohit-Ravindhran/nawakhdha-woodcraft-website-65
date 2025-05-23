
import React, { useEffect } from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EnhancedImageUploader from "@/components/admin/EnhancedImageUploader";
import { HomePageFormValues } from "@/components/admin/PageSchemas";
import { useBasicHomeProducts } from "@/hooks/content/products/useBasicHomeProducts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductsSectionProps {
  control: Control<HomePageFormValues>;
  isOpen: boolean;
  onToggle: () => void;
  watch: UseFormWatch<HomePageFormValues>;
  setValue: UseFormSetValue<HomePageFormValues>;
}

export default function ProductsSection({ control, isOpen, onToggle, watch, setValue }: ProductsSectionProps) {
  // Fetch home products for linking - replacing useHomeProducts with useBasicHomeProducts
  const { data: homeProductsList, isLoading: isHomeProductsLoading } = useBasicHomeProducts();
  
  // Parse the products JSON if it's a string
  const getProductsData = () => {
    try {
      const productsStr = watch("products");
      if (typeof productsStr === 'string' && productsStr) {
        return JSON.parse(productsStr);
      }
      return { section_title: "", items: [{}, {}, {}, {}] };
    } catch (e) {
      return { section_title: "", items: [{}, {}, {}, {}] };
    }
  };

  const handleProductImageUploaded = (index: number) => (url: string, alt?: string) => {
    const productsData = getProductsData();
    productsData.items = productsData.items || [];
    if (!productsData.items[index]) {
      productsData.items[index] = {};
    }
    productsData.items[index].image = url;
    productsData.items[index].image_alt = alt || "";
    setValue("products", JSON.stringify(productsData), { shouldValidate: true });
  };

  const handleInputChange = (field: string, value: string, index?: number) => {
    const productsData = getProductsData();
    
    if (index !== undefined) {
      productsData.items = productsData.items || [];
      if (!productsData.items[index]) {
        productsData.items[index] = {};
      }
      productsData.items[index][field] = value;
    } else {
      productsData[field] = value;
    }
    
    setValue("products", JSON.stringify(productsData), { shouldValidate: true });
  };

  // Handle selection of a product slug
  const handleProductLinkChange = (homeProductId: string, index: number) => {
    if (!homeProductsList) return;
    
    const selectedProduct = homeProductsList.find(product => product.id === homeProductId);
    if (!selectedProduct) return;
    
    const productsData = getProductsData();
    productsData.items = productsData.items || [];
    
    if (!productsData.items[index]) {
      productsData.items[index] = {};
    }
    
    // Store both the product ID and its slug
    productsData.items[index].id = selectedProduct.id;
    productsData.items[index].category_slug = selectedProduct.slug;
    
    // If no title is set yet, use the category name
    if (!productsData.items[index].title && selectedProduct.category_name) {
      productsData.items[index].title = selectedProduct.category_name;
    }
    
    // If no image is set yet, use the product image
    if (!productsData.items[index].image && selectedProduct.image_url) {
      productsData.items[index].image = selectedProduct.image_url;
      productsData.items[index].image_alt = selectedProduct.alt_text || `${selectedProduct.category_name} image`;
    }
    
    setValue("products", JSON.stringify(productsData), { shouldValidate: true });
  };

  const productsData = getProductsData();

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
        <span>Our Products Section</span>
        <Button variant="ghost" size="sm" type="button">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1 space-y-6">
        <FormItem>
          <FormLabel>Section Title</FormLabel>
          <FormControl>
            <Input 
              value={productsData.section_title || ""} 
              onChange={(e) => handleInputChange("section_title", e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        
        <div className="space-y-8">
          <h4 className="font-medium text-sm text-muted-foreground">Product Cards</h4>
          
          {[0, 1, 2, 3].map((index) => {
            const item = productsData.items?.[index] || {};
            
            return (
              <div key={`product-${index}`} className="border p-4 rounded-md">
                <h5 className="font-medium mb-3">Product Card {index + 1}</h5>
                
                <div className="mb-4">
                  <EnhancedImageUploader
                    onImageUploaded={handleProductImageUploaded(index)}
                    bucket="homepage"
                    folder="products"
                    existingUrl={item.image || ""}
                    initialAltText={item.image_alt || ""}
                    imagePreviewHeight="24"
                  />
                </div>
                
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input 
                      value={item.title || ""} 
                      onChange={(e) => handleInputChange("title", e.target.value, index)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                
                <FormItem className="mt-3">
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      value={item.description || ""} 
                      onChange={(e) => handleInputChange("description", e.target.value, index)}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                
                <FormItem className="mt-3">
                  <FormLabel>Link to Home Product</FormLabel>
                  <Select
                    value={item.id || ""}
                    onValueChange={(value) => handleProductLinkChange(value, index)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {homeProductsList?.map(product => (
                        <SelectItem key={product.id} value={product.id || ""}>
                          {product.category_name || 'Unnamed Category'}
                          {product.slug ? ` (${product.slug})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.category_slug ? 
                      `This will link to: /product/${item.category_slug}` : 
                      'Select a product to create an automatic link'}
                  </p>
                </FormItem>
                
                <FormItem className="mt-3">
                  <FormLabel>Custom Link (overrides product link)</FormLabel>
                  <FormControl>
                    <Input 
                      value={item.link || ""} 
                      onChange={(e) => handleInputChange("link", e.target.value, index)}
                      placeholder="/products/product-slug" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
