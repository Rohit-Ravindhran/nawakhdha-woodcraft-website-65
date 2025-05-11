
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Note: This component is kept for backward compatibility but will be non-functional
// since the settings table doesn't exist in the database. It shows a placeholder message instead.

const settingsSchema = z.object({
  background_color: z.string(),
  site_title: z.string(),
  site_description: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsEditor() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      background_color: "#F8F7F4",
      site_title: "Al Nawakhdha Furniture W.L.L.",
      site_description: "Bahrain's premier carpentry and furniture manufacturing workshop.",
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    toast.info("Settings functionality is not available in this version.");
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">Site Settings</h3>
      
      <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
        <p className="font-medium">Settings Functionality Disabled</p>
        <p className="text-sm mt-1">
          The settings functionality has been disabled as there is no settings table in the database.
          Please contact your administrator to set up the required database tables if you need this feature.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="site_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="site_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="background_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <div className="flex space-x-3">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <div 
                    className="w-10 h-10 border rounded" 
                    style={{ backgroundColor: field.value }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="mt-4"
          >
            Save Settings
          </Button>
        </form>
      </Form>
    </div>
  );
}
