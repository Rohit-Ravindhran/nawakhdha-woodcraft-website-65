
import React, { useEffect, useState } from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EnhancedImageUploader from "@/components/admin/EnhancedImageUploader";
import { HomePageFormValues } from "@/components/admin/PageSchemas";

interface BlogItem {
  image?: string;
  image_alt?: string;
  title?: string;
  excerpt?: string;
  link?: string;
}

interface BlogSectionData {
  section_title?: string;
  items?: BlogItem[];
}

interface BlogSectionProps {
  control: Control<HomePageFormValues>;
  isOpen: boolean;
  onToggle: () => void;
  watch: UseFormWatch<HomePageFormValues>;
  setValue: UseFormSetValue<HomePageFormValues>;
}

export default function BlogSection({ control, isOpen, onToggle, watch, setValue }: BlogSectionProps) {
  const [blogData, setBlogData] = useState<BlogSectionData>({
    section_title: "",
    items: Array(3).fill({ image: "", image_alt: "", title: "", excerpt: "", link: "" })
  });

  // Parse the JSON string when the form value changes
  useEffect(() => {
    try {
      const blogValue = watch("blog");
      if (typeof blogValue === 'string' && blogValue) {
        const parsed = JSON.parse(blogValue);
        setBlogData(parsed);
      }
    } catch (error) {
      console.error("Error parsing blog JSON:", error);
    }
  }, [watch("blog")]);

  // Update the JSON string when a field changes
  const updateBlogField = (field: string, value: any) => {
    try {
      const currentBlog = watch("blog");
      let blogObject: BlogSectionData = {
        section_title: "",
        items: []
      };
      
      try {
        if (typeof currentBlog === 'string' && currentBlog) {
          blogObject = JSON.parse(currentBlog);
        }
      } catch (e) {
        console.error("Error parsing current blog:", e);
      }
      
      const updatedBlog = {
        ...blogObject,
        [field]: value
      };
      
      setValue("blog", JSON.stringify(updatedBlog));
    } catch (error) {
      console.error("Error updating blog field:", error);
    }
  };

  const updateBlogItem = (index: number, field: string, value: string) => {
    try {
      const currentBlog = watch("blog");
      let blogObject: BlogSectionData = {
        section_title: "",
        items: []
      };
      
      try {
        if (typeof currentBlog === 'string' && currentBlog) {
          blogObject = JSON.parse(currentBlog);
        }
      } catch (e) {
        console.error("Error parsing current blog:", e);
      }
      
      // Ensure items array exists
      if (!blogObject.items) {
        blogObject.items = Array(3).fill({});
      }
      
      // Ensure the item at this index exists
      if (!blogObject.items[index]) {
        blogObject.items[index] = {};
      }
      
      // Update the field
      blogObject.items[index] = {
        ...blogObject.items[index],
        [field]: value
      };
      
      setValue("blog", JSON.stringify(blogObject));
    } catch (error) {
      console.error("Error updating blog item:", error);
    }
  };

  const handleBlogImageUploaded = (index: number, url: string, alt: string) => {
    updateBlogItem(index, "image", url);
    updateBlogItem(index, "image_alt", alt);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
        <span>From Our Workshop Blog Section</span>
        <Button variant="ghost" size="sm" type="button">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1 space-y-6">
        <div className="form-group">
          <label htmlFor="blog_section_title" className="block text-gray-700 mb-1">Section Title</label>
          <Input 
            id="blog_section_title"
            value={blogData.section_title || ""}
            onChange={(e) => updateBlogField("section_title", e.target.value)}
          />
        </div>
        
        <div className="space-y-8">
          <h4 className="font-medium text-sm text-muted-foreground">Blog Post Cards</h4>
          
          {[0, 1, 2].map((index) => (
            <div key={`blog-${index}`} className="border p-4 rounded-md">
              <h5 className="font-medium mb-3">Blog Post {index + 1}</h5>
              
              <div className="mb-4">
                <EnhancedImageUploader
                  onImageUploaded={(url, alt) => handleBlogImageUploaded(index, url, alt)}
                  bucket="homepage"
                  folder="blog"
                  initialImageUrl={blogData.items?.[index]?.image || ""}
                  initialAltText={blogData.items?.[index]?.image_alt || ""}
                  imagePreviewHeight="24"
                />
              </div>
              
              <div className="form-group mt-3">
                <label className="block text-gray-700 mb-1">Blog Post Title</label>
                <Input 
                  value={blogData.items?.[index]?.title || ""}
                  onChange={(e) => updateBlogItem(index, "title", e.target.value)}
                />
              </div>
              
              <div className="form-group mt-3">
                <label className="block text-gray-700 mb-1">Blog Excerpt</label>
                <Textarea 
                  rows={2}
                  value={blogData.items?.[index]?.excerpt || ""}
                  onChange={(e) => updateBlogItem(index, "excerpt", e.target.value)}
                />
              </div>
              
              <div className="form-group mt-3">
                <label className="block text-gray-700 mb-1">Blog Post Link</label>
                <Input 
                  placeholder="/blog/post-slug"
                  value={blogData.items?.[index]?.link || ""}
                  onChange={(e) => updateBlogItem(index, "link", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
