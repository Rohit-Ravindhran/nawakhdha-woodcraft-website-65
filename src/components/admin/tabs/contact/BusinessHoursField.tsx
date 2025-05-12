
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface BusinessHoursFieldProps {
  control: Control<any>;
}

export default function BusinessHoursField({ control }: BusinessHoursFieldProps) {
  return (
    <FormField
      control={control}
      name="business_hours_json"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Business Hours (JSON Format)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder={`{
  "monday": "9:00 AM - 5:00 PM",
  "tuesday": "9:00 AM - 5:00 PM",
  "wednesday": "9:00 AM - 5:00 PM",
  "thursday": "9:00 AM - 5:00 PM",
  "friday": "9:00 AM - 4:00 PM",
  "saturday": "Closed",
  "sunday": "Closed"
}`} 
              {...field} 
              rows={10}
              className="font-mono text-sm"
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
