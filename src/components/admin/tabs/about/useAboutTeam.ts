
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AboutTeamMemberData } from "@/hooks/content/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";

const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  bio: z.string().optional(),
  image_url: z.string().optional(),
  alt_text: z.string().optional(),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

export const useAboutTeam = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTeamMember, setCurrentTeamMember] = useState<AboutTeamMemberData | null>(null);
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["about_team"],
    queryFn: async () => {
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

  return {
    teamMembers,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    currentTeamMember,
    form,
    handleEdit,
    handleAdd,
    onSubmit,
    handleDelete,
  };
};
