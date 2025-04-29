
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSettings, useUpdateSettings } from "@/hooks/content";
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

const settingsSchema = z.object({
  background_color: z.string(),
  site_title: z.string(),
  site_description: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsEditor() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      background_color: "#F8F7F4",
      site_title: "Al Nawakhdha Furniture W.L.L.",
      site_description: "Bahrain's premier carpentry and furniture manufacturing workshop.",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        background_color: settings.background_color || "#F8F7F4",
        site_title: settings.site_title || "Al Nawakhdha Furniture W.L.L.",
        site_description: settings.site_description || "Bahrain's premier carpentry and furniture manufacturing workshop.",
      });
    }
  }, [settings, form]);

  const onSubmit = (values: SettingsFormValues) => {
    // Ensure all required fields have values
    const updatedSettings = {
      id: settings?.id,
      background_color: values.background_color,
      site_title: values.site_title,
      site_description: values.site_description
    };
    
    updateSettings.mutate(updatedSettings);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">Site Settings</h3>
      
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
            disabled={updateSettings.isPending}
            className="mt-4"
          >
            {updateSettings.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
