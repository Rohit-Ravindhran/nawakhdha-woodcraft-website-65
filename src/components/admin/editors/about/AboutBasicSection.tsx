
import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EnhancedImageUploader from "@/components/admin/EnhancedImageUploader";

interface AboutBasicSectionProps {
  control: Control<any>;
  watch: any;
  setValue: any;
}

export default function AboutBasicSection({ control, watch, setValue }: AboutBasicSectionProps) {
  const handleHeaderImageUploaded = (url: string, alt: string) => {
    setValue("header_image", url);
    setValue("header_image_alt", alt);
  };
  
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Page Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="About Us" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="mt-4">
        <FormLabel>Header Image</FormLabel>
        <EnhancedImageUploader
          onImageUploaded={handleHeaderImageUploaded}
          bucket="pages"
          folder="about"
          initialImageUrl={watch("header_image")}
          initialAltText={watch("header_image_alt")}
        />
      </div>
    </>
  );
}
