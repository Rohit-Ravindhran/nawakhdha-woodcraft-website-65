
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save } from "lucide-react";
import ImageUploadField from "../../ImageUploadField";
import { TeamMemberFormValues } from "./useAboutTeam";
import { UseFormReturn } from "react-hook-form";
import { AboutTeamMemberData } from "@/hooks/content/types";

interface AboutTeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentTeamMember: AboutTeamMemberData | null;
  form: UseFormReturn<TeamMemberFormValues>;
  onSubmit: (values: TeamMemberFormValues) => Promise<void>;
}

const AboutTeamForm = ({ isOpen, onClose, currentTeamMember, form, onSubmit }: AboutTeamFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{currentTeamMember ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Member name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Job title or role" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short biography" {...field} rows={5} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ImageUploadField
              control={form.control}
              name="image_url"
              label="Photo"
              altTextName="alt_text"
              bucket="about-team"
              folder="about_team"
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AboutTeamForm;
