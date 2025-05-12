
import React, { useEffect, useState } from "react";
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
import { safeJsonParse } from "@/utils/jsonHelpers";

interface HeroSectionProps {
  control: Control<HomePageFormValues>;
  isOpen: boolean;
  onToggle: () => void;
  watch: UseFormWatch<HomePageFormValues>;
  setValue: UseFormSetValue<HomePageFormValues>;
}

export default function HeroSection({ control, isOpen, onToggle, watch, setValue }: HeroSectionProps) {
  // Local state to handle the parsed hero data
  const [heroData, setHeroData] = useState<{
    background_image?: string;
    background_image_alt?: string;
    headline?: string;
    subheadline?: string;
    button_text?: string;
    button_link?: string;
  }>({});

  // Parse the JSON string when the form value changes
  useEffect(() => {
    try {
      const heroValue = watch("hero");
      if (typeof heroValue === 'string' && heroValue) {
        const parsed = safeJsonParse(heroValue);
        if (parsed) {
          setHeroData(parsed);
        }
      }
    } catch (error) {
      console.error("Error parsing hero JSON:", error);
    }
  }, [watch("hero")]);

  // Update the JSON string when a field changes
  const updateHeroField = (field: string, value: string) => {
    try {
      const currentHero = watch("hero");
      let heroObject = {};
      
      try {
        if (typeof currentHero === 'string' && currentHero) {
          const parsed = safeJsonParse(currentHero);
          if (parsed) {
            heroObject = parsed;
          }
        }
      } catch (e) {
        console.error("Error parsing current hero:", e);
      }
      
      const updatedHero = {
        ...heroObject,
        [field]: value
      };
      
      setValue("hero", JSON.stringify(updatedHero));
    } catch (error) {
      console.error("Error updating hero field:", error);
    }
  };

  const handleHeroImageUploaded = (url: string, alt: string) => {
    updateHeroField("background_image", url);
    updateHeroField("background_image_alt", alt);
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
            initialImageUrl={heroData.background_image || ""}
            initialAltText={heroData.background_image_alt || ""}
          />
        </div>
        
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="headline" className="block text-gray-700 mb-1">Headline</label>
            <Input 
              id="headline"
              value={heroData.headline || ""}
              onChange={(e) => updateHeroField("headline", e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subheadline" className="block text-gray-700 mb-1">Subheadline</label>
            <Textarea 
              id="subheadline"
              rows={3}
              value={heroData.subheadline || ""}
              onChange={(e) => updateHeroField("subheadline", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="button_text" className="block text-gray-700 mb-1">Button Text</label>
              <Input 
                id="button_text"
                value={heroData.button_text || ""}
                onChange={(e) => updateHeroField("button_text", e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="button_link" className="block text-gray-700 mb-1">Button Link</label>
              <Input 
                id="button_link"
                placeholder="/about"
                value={heroData.button_link || ""}
                onChange={(e) => updateHeroField("button_link", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
