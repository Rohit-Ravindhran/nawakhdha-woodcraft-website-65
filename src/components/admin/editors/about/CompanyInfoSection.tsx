
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
import { Textarea } from "@/components/ui/textarea";

interface CompanyInfoSectionProps {
  control: Control<any>;
}

export default function CompanyInfoSection({ control }: CompanyInfoSectionProps) {
  return (
    <>
      <FormField
        control={control}
        name="since_year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Established Year</FormLabel>
            <FormControl>
              <Input {...field} placeholder="1975" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="company_story"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Story</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                rows={5}
                placeholder="Share the story of your company..."
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="mission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mission Statement</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                rows={3}
                placeholder="Our mission is to..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="vision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vision</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                rows={3}
                placeholder="Our vision is to..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
