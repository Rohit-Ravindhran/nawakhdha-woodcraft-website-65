
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
import { MapPin, Phone, Mail } from "lucide-react";

interface ContactInfoProps {
  control: Control<any>;
  watch: any;
}

export default function ContactInfo({ control, watch }: ContactInfoProps) {
  return (
    <>
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" /> Address
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                rows={2}
                placeholder="Building 123, Road 456, Block 789, Manama, Bahrain"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Phone className="h-4 w-4 mr-2" /> Phone
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="+973 1234 5678" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Mail className="h-4 w-4 mr-2" /> Email
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="info@nawakhdha.com" type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
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
              />
            </FormControl>
            <p className="text-sm text-muted-foreground mt-1">
              Paste the embed URL from Google Maps (iframe src attribute)
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {watch("map_url") && (
        <div className="border rounded-md p-2 mt-4">
          <p className="text-sm font-medium mb-2">Map Preview:</p>
          <iframe
            src={watch("map_url")}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}
    </>
  );
}
