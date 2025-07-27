import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2, FileText, Code, Tag } from "lucide-react";
import { useCreateContentChangeRequest } from "@/hooks/content/useContentChangeRequests";
import { useToast } from "@/hooks/use-toast";

interface ContentAnalyzerProps {
  onAnalysisComplete?: () => void;
}

export default function ContentAnalyzer({ onAnalysisComplete }: ContentAnalyzerProps) {
  const [pageSlug, setPageSlug] = useState("interior-fitouts-bahrain");
  const [pageTitle, setPageTitle] = useState("Interior Fit-outs Bahrain");
  const [contentType, setContentType] = useState("description");
  const [sectionId, setSectionId] = useState("hero-description");
  const [currentContent, setCurrentContent] = useState(`Full-service interior fit-outs and bespoke furniture manufacturing in Bahrain: design, joinery, installation, project management and MEP integration for residential, commercial and hospitality sectors.`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const createRequest = useCreateContentChangeRequest();
  const { toast } = useToast();

  const handleCreateTestRequest = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis and content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const enhancedContent = `Premium interior fit-out solutions and bespoke furniture manufacturing in Bahrain: comprehensive design consultation, expert joinery, professional installation, full project management and MEP integration for residential, commercial, and hospitality sectors. Trusted by leading businesses across Bahrain for turnkey interior solutions.`;
    
    const newKeywords = ["premium", "comprehensive", "expert", "professional", "trusted", "turnkey"];
    
    try {
      await createRequest.mutateAsync({
        page_slug: pageSlug,
        page_title: pageTitle,
        content_type: contentType,
        section_identifier: sectionId,
        current_content: currentContent,
        proposed_content: enhancedContent,
        change_reason: "Enhanced with trending SEO keywords and improved readability based on current search trends for interior fit-out services in Bahrain",
        seo_keywords_added: newKeywords,
      });
      
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error) {
      console.error("Failed to create content request:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Content Analysis & Enhancement
        </CardTitle>
        <CardDescription>
          Create a test content change request for the interior-fitouts page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="page-slug">Page Slug</Label>
            <Input
              id="page-slug"
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value)}
              placeholder="interior-fitouts-bahrain"
            />
          </div>
          <div>
            <Label htmlFor="page-title">Page Title</Label>
            <Input
              id="page-title"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Interior Fit-outs Bahrain"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="content-type">Content Type</Label>
            <select
              id="content-type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="description">Description</option>
              <option value="json-ld">JSON-LD Schema</option>
              <option value="meta-tags">Meta Tags</option>
              <option value="heading">Heading</option>
            </select>
          </div>
          <div>
            <Label htmlFor="section-id">Section Identifier</Label>
            <Input
              id="section-id"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              placeholder="hero-description"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="current-content">Current Content</Label>
          <Textarea
            id="current-content"
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            placeholder="Enter the current content that will be analyzed and enhanced..."
            className="min-h-[100px]"
          />
        </div>

        <div className="pt-4">
          <Button
            onClick={handleCreateTestRequest}
            disabled={isAnalyzing || !currentContent.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Content...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Create Test Content Enhancement Request
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          <h4 className="font-medium mb-2">What this will do:</h4>
          <ul className="space-y-1 text-xs">
            <li>• Analyze the current content for SEO opportunities</li>
            <li>• Generate enhanced content with trending keywords</li>
            <li>• Create a review request that appears in the Content Review tab</li>
            <li>• Allow you to approve or decline the changes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}