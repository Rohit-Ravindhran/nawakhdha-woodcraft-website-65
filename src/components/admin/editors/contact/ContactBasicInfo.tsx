
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

interface ContactBasicInfoProps {
  control: Control<any>;
}

export default function ContactBasicInfo({ control }: ContactBasicInfoProps) {
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Page Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Contact Us" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="subtitle"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Subtitle</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Get in touch with us" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
