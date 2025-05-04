
import React, { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import ImageUploader from "@/components/admin/ImageUploader";
import { Image } from "lucide-react";

interface ImageUploadFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  altTextName?: string;
  bucket?: string;
  folder?: string;
}

export default function ImageUploadField({
  control,
  name,
  label,
  altTextName,
  bucket = "content",
  folder = "",
}: ImageUploadFieldProps) {
  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="space-y-2">
                {field.value && (
                  <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden mb-2">
                    <img
                      src={field.value}
                      alt={`Preview for ${label}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                )}
                
                {!field.value && (
                  <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded mb-2">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <Input 
                  type="text" 
                  placeholder="Image URL" 
                  value={field.value || ''} 
                  onChange={field.onChange}
                />
                
                <ImageUploader 
                  onImageUploaded={field.onChange}
                  bucket={bucket}
                  folder={folder}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {altTextName && (
        <Controller
          control={control}
          name={altTextName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alt Text</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Image alt text for accessibility" 
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
