import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { 
  useProjectsVideos, 
  useDeleteProjectVideo 
} from '@/hooks/content/useProjects';
import ProjectVideoDialog from './ProjectVideoDialog';
import ProjectVideosTable from './ProjectVideosTable';
import type { ProjectVideo } from '@/hooks/content/useProjects';

interface ProjectVideosManagerProps {
  pageSlug?: string;
  bucket?: string;
  pageLabel?: string;
}

const ProjectVideosManager: React.FC<ProjectVideosManagerProps> = ({
  pageSlug = 'our-projects',
  bucket = 'projects-videos',
  pageLabel = 'Our Projects',
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ProjectVideo | null>(null);
  
  const { data: videos = [], isLoading } = useProjectsVideos(pageSlug);
  const deleteVideo = useDeleteProjectVideo();

  const handleEdit = (video: ProjectVideo) => {
    setEditingVideo(video);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      await deleteVideo.mutateAsync(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVideo(null);
  };

  // Calculate next position
  const nextPosition = videos.length > 0 
    ? Math.max(...videos.map(v => v.position)) + 1 
    : 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Videos</h3>
          <p className="text-sm text-muted-foreground">
            Manage videos displayed on the {pageLabel} page
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading videos...</div>
      ) : (
        <ProjectVideosTable
          videos={videos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ProjectVideoDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        video={editingVideo}
        nextPosition={nextPosition}
        pageSlug={pageSlug}
        bucket={bucket}
      />
    </div>
  );
};

export default ProjectVideosManager;
