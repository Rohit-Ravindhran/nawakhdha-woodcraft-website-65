
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Control } from "react-hook-form";

interface SeoFieldsProps {
  control: Control<any>;
  titleFieldName?: string;
  descriptionFieldName?: string;
  keywordsFieldName?: string;
  canonicalUrlFieldName?: string;
}

export default function SeoFields({
  control,
  titleFieldName = "seo_title",
  descriptionFieldName = "seo_description",
  keywordsFieldName = "seo_keywords",
  canonicalUrlFieldName = "seo_canonical_url"
}: SeoFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-lg font-medium">SEO Settings</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Configure these settings to improve your page's visibility in search engines.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <FormField
        control={control}
        name={titleFieldName}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>SEO Title</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>50-60 characters recommended. This appears in search results and browser tabs.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              {field.value?.length || 0}/60 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name={descriptionFieldName}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Meta Description</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>150-160 characters recommended. This appears in search results below the title.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Textarea {...field} rows={3} />
            </FormControl>
            <FormDescription className="text-xs">
              {field.value?.length || 0}/160 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name={keywordsFieldName}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Meta Keywords</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Separate keywords with commas. Less important for modern SEO but still useful for content organization.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Input {...field} placeholder="keyword1, keyword2, keyword3" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {canonicalUrlFieldName && (
        <FormField
          control={control}
          name={canonicalUrlFieldName}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Canonical URL</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Use this if this content appears on multiple URLs to avoid duplicate content issues.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <Input {...field} placeholder="https://example.com/canonical-page" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
