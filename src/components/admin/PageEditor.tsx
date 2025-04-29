
import { useEffect } from "react";
import { usePage } from "@/hooks/content";
import { Loader2 } from "lucide-react";
import HomePageEditor from "@/components/admin/editors/HomePageEditor";
import BasicPageEditor from "@/components/admin/editors/BasicPageEditor";

interface PageEditorProps {
  pageName: string;
}

export default function PageEditor({ pageName }: PageEditorProps) {
  const { data: page, isLoading, error } = usePage(pageName);

  // Parse JSON fields from string if needed
  useEffect(() => {
    if (page) {
      try {
        // This is now handled within each editor component
        console.log("Page data loaded:", page.page_name);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    }
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Choose the appropriate editor based on page type
  if (pageName === "home") {
    return <HomePageEditor page={page} isLoading={isLoading} />;
  }
  
  // For all other page types, use the basic editor
  return <BasicPageEditor page={page} pageName={pageName} isLoading={isLoading} />;
}
