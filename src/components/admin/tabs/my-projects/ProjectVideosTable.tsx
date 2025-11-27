import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from 'lucide-react';
import type { ProjectVideo } from '@/hooks/content/useProjects';

interface ProjectVideosTableProps {
  videos: ProjectVideo[];
  onEdit: (video: ProjectVideo) => void;
  onDelete: (id: string) => void;
}

const ProjectVideosTable: React.FC<ProjectVideosTableProps> = ({
  videos,
  onEdit,
  onDelete,
}) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No videos added yet. Click "Add Video" to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Video</TableHead>
            <TableHead>Caption</TableHead>
            <TableHead>Alt Text</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell className="font-medium">{video.position}</TableCell>
              <TableCell>
                <div className="w-32 h-20 rounded overflow-hidden bg-muted">
                  {video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be') ? (
                    <iframe
                      src={video.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      title={video.caption || 'Video'}
                    />
                  ) : (
                    <video 
                      src={video.video_url} 
                      className="w-full h-full object-contain bg-muted"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {video.caption || '-'}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {video.alt_text || '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(video)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(video.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectVideosTable;
