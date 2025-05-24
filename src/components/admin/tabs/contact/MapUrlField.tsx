
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface MapUrlFieldProps {
  control: Control<any>;
}

export default function MapUrlField({ control }: MapUrlFieldProps) {
  return (
    <FormField
      control={control}
      name="map_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Google Maps Embed URL</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              placeholder="https://www.google.com/maps/embed?pb=..." 
              value={field.value || ''}
            />
          </FormControl>
          <p className="text-sm text-muted-foreground mt-1">
            Paste the embed URL from Google Maps (iframe src attribute)
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
