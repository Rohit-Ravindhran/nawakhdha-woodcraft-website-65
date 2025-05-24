
import { AboutTeamMemberData } from "@/hooks/content/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface AboutTeamTableProps {
  teamMembers: AboutTeamMemberData[] | undefined;
  isLoading: boolean;
  onEdit: (member: AboutTeamMemberData) => void;
  onDelete: (id: string) => void;
}

const AboutTeamTable = ({ teamMembers, isLoading, onEdit, onDelete }: AboutTeamTableProps) => {
  if (isLoading) return <div>Loading...</div>;

  return (
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
                  <Button variant="outline" size="icon" onClick={() => onEdit(member)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onDelete(member.id!)}>
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
  );
};

export default AboutTeamTable;
