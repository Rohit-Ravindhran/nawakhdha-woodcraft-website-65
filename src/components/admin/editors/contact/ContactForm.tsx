
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

interface ContactFormProps {
  control: Control<any>;
}

export default function ContactForm({ control }: ContactFormProps) {
  return (
    <>
      <FormField
        control={control}
        name="form_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Form Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Send us a message" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="form_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Form Description</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                rows={3}
                placeholder="Fill out the form below and we'll get back to you as soon as possible."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
