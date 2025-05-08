
import React from "react";
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

interface ServicesSectionProps {
  control: Control<HomePageFormValues>;
  isOpen: boolean;
  onToggle: () => void;
  watch: UseFormWatch<HomePageFormValues>;
  setValue: UseFormSetValue<HomePageFormValues>;
}

export default function ServicesSection({ control, isOpen, onToggle, watch, setValue }: ServicesSectionProps) {
  // Parse the services JSON if it's a string
  const getServicesData = () => {
    try {
      const servicesStr = watch("services");
      if (typeof servicesStr === 'string' && servicesStr) {
        return JSON.parse(servicesStr);
      }
      return { section_title: "", items: [{}, {}, {}, {}] };
    } catch (e) {
      return { section_title: "", items: [{}, {}, {}, {}] };
    }
  };

  const handleServiceImageUploaded = (index: number, url: string, alt: string) => {
    const servicesData = getServicesData();
    servicesData.items = servicesData.items || [];
    if (!servicesData.items[index]) {
      servicesData.items[index] = {};
    }
    servicesData.items[index].image = url;
    servicesData.items[index].image_alt = alt;
    setValue("services", JSON.stringify(servicesData), { shouldValidate: true });
  };

  const handleInputChange = (field: string, value: string, index?: number) => {
    const servicesData = getServicesData();
    
    if (index !== undefined) {
      servicesData.items = servicesData.items || [];
      if (!servicesData.items[index]) {
        servicesData.items[index] = {};
      }
      servicesData.items[index][field] = value;
    } else {
      servicesData[field] = value;
    }
    
    setValue("services", JSON.stringify(servicesData), { shouldValidate: true });
  };

  const servicesData = getServicesData();

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
        <span>Our Services Section</span>
        <Button variant="ghost" size="sm" type="button">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1 space-y-6">
        <FormItem>
          <FormLabel>Section Title</FormLabel>
          <FormControl>
            <Input 
              value={servicesData.section_title || ""} 
              onChange={(e) => handleInputChange("section_title", e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        
        <div className="space-y-8">
          <h4 className="font-medium text-sm text-muted-foreground">Service Cards</h4>
          
          {[0, 1, 2, 3].map((index) => {
            const item = servicesData.items?.[index] || {};
            
            return (
              <div key={`service-${index}`} className="border p-4 rounded-md">
                <h5 className="font-medium mb-3">Service Card {index + 1}</h5>
                
                <div className="mb-4">
                  <EnhancedImageUploader
                    onImageUploaded={(url, alt) => handleServiceImageUploaded(index, url, alt)}
                    bucket="homepage"
                    folder="services"
                    initialImageUrl={item.image || ""}
                    initialAltText={item.image_alt || ""}
                    imagePreviewHeight="24"
                  />
                </div>
                
                <FormItem>
                  <FormLabel>Service Title</FormLabel>
                  <FormControl>
                    <Input 
                      value={item.title || ""} 
                      onChange={(e) => handleInputChange("title", e.target.value, index)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                
                <FormItem className="mt-3">
                  <FormLabel>Service Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      value={item.description || ""} 
                      onChange={(e) => handleInputChange("description", e.target.value, index)}
                      rows={2}
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
