
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAboutTeam } from "./about/useAboutTeam";
import AboutTeamTable from "./about/AboutTeamTable";
import AboutTeamForm from "./about/AboutTeamForm";

export default function AboutTeamTab() {
  const {
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
  } = useAboutTeam();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">About Team</h2>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New Member
        </Button>
      </div>

      <AboutTeamTable
        teamMembers={teamMembers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AboutTeamForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentTeamMember={currentTeamMember}
        form={form}
        onSubmit={onSubmit}
      />
    </div>
  );
}
