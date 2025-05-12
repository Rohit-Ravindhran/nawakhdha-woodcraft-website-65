
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import SeoFields from "@/components/admin/SeoFields";
import { useContactPage } from "./contact/useContactPage";
import ContactBasicInfo from "./contact/ContactBasicInfo";
import ContactInfo from "./contact/ContactInfo";
import ContactForm from "./contact/ContactForm";

export default function ContactPageEditor() {
  const {
    form,
    isLoading,
    updatePage,
    openSections,
    toggleSection,
    onSubmit
  } = useContactPage();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold mb-4">Edit Contact Page</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Page Info */}
          <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>Basic Page Information</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.basic ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-1">
              <ContactBasicInfo control={form.control} />
            </CollapsibleContent>
          </Collapsible>

          {/* Contact Information */}
          <Collapsible open={openSections.contact} onOpenChange={() => toggleSection('contact')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>Contact Information</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.contact ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-1 space-y-4">
              <ContactInfo control={form.control} watch={form.watch} />
            </CollapsibleContent>
          </Collapsible>

          {/* Contact Form Settings */}
          <Collapsible open={openSections.form} onOpenChange={() => toggleSection('form')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>Contact Form Settings</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.form ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-1 space-y-4">
              <ContactForm control={form.control} />
            </CollapsibleContent>
          </Collapsible>
          
          {/* SEO Settings */}
          <Collapsible open={openSections.seo} onOpenChange={() => toggleSection('seo')}>
            <CollapsibleTrigger className="flex justify-between w-full items-center p-3 font-medium bg-slate-100 rounded-md hover:bg-slate-200">
              <span>SEO Settings</span>
              <Button variant="ghost" size="sm" type="button">
                {openSections.seo ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-1">
              <SeoFields control={form.control} />
            </CollapsibleContent>
          </Collapsible>
          
          <Button 
            type="submit" 
            disabled={updatePage.isPending}
            className="mt-6"
          >
            {updatePage.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
