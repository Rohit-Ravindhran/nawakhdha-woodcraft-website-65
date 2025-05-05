
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AboutTeamMemberData } from "@/hooks/content/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import ImageUploadField from "../ImageUploadField";
import { useAuth } from "@/contexts/AuthContext";

const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  bio: z.string().optional(),
  image_url: z.string().optional(),
  alt_text: z.string().optional(),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

export default function AboutTeamTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTeamMember, setCurrentTeamMember] = useState<AboutTeamMemberData | null>(null);
  const { session } = useAuth();

  const queryClient = useQueryClient();

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["about_team"],
    queryFn: async () => {
      // Using the session from auth context
      const { data, error } = await supabase
        .from("about_team")
        .select("*")
        .order("id");

      if (error) throw error;
      return data as AboutTeamMemberData[];
    },
  });

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      image_url: "",
      alt_text: "",
    },
  });

  const handleEdit = (member: AboutTeamMemberData) => {
    setCurrentTeamMember(member);
    form.reset({
      id: member.id,
      name: member.name || "",
      role: member.role || "",
      bio: member.bio || "",
      image_url: member.image_url || "",
      alt_text: member.alt_text || "",
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentTeamMember(null);
    form.reset({
      name: "",
      role: "",
      bio: "",
      image_url: "",
      alt_text: "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: TeamMemberFormValues) => {
    try {
      // Ensure we have a session before proceeding
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      if (values.id) {
        const { error } = await supabase
          .from("about_team")
          .update({
            name: values.name,
            role: values.role,
            bio: values.bio,
            image_url: values.image_url,
            alt_text: values.alt_text,
          })
          .eq("id", values.id);

        if (error) throw error;
        toast.success("Team member updated successfully");
      } else {
        const { error } = await supabase
          .from("about_team")
          .insert({
            name: values.name,
            role: values.role,
            bio: values.bio,
            image_url: values.image_url,
            alt_text: values.alt_text,
          });

        if (error) throw error;
        toast.success("Team member added successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["about_team"] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving team member: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        // Ensure we have a session before proceeding
        if (!session) {
          toast.error("You must be logged in to perform this action");
          return;
        }
        
        const { error } = await supabase
          .from("about_team")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast.success("Team member deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["about_team"] });
      } catch (error: any) {
        toast.error(`Error deleting team member: ${error.message}`);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">About Team</h2>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New Member
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers && teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="w-16 h-16 relative bg-gray-200 rounded-full overflow-hidden">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.alt_text || `${member.name} photo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No img
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{member.name || "N/A"}</TableCell>
                <TableCell>{member.role || "N/A"}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">{member.bio || "N/A"}</div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(member.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No team members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
    </div>
  );
}
