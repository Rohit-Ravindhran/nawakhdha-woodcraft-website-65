
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

interface HeroSectionProps {
  control: Control<HomePageFormValues>;
  isOpen: boolean;
  onToggle: () => void;
  watch: UseFormWatch<HomePageFormValues>;
  setValue: UseFormSetValue<HomePageFormValues>;
}

export default function HeroSection({ control, isOpen, onToggle, watch, setValue }: HeroSectionProps) {
  const handleHeroImageUploaded = (url: string, alt: string) => {
    setValue('hero.background_image', url, { shouldValidate: true });
    setValue('hero.background_image_alt', alt, { shouldValidate: true });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
        <span>Hero Banner Section</span>
        <Button variant="ghost" size="sm" type="button">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1 space-y-4">
        <div className="mb-4">
          <EnhancedImageUploader 
            onImageUploaded={handleHeroImageUploaded} 
            bucket="homepage"
            folder="hero"
            initialImageUrl={watch('hero.background_image')}
            initialAltText={watch('hero.background_image_alt')}
          />
        </div>
        
        <FormField
          control={control}
          name="hero.headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="hero.subheadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subheadline</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="hero.button_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="hero.button_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Link</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="/about" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
