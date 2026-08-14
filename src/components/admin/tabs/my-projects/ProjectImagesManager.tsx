import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { 
  useProjectsImages, 
  useDeleteProjectImage 
} from '@/hooks/content/useProjects';
import ProjectImageDialog from './ProjectImageDialog';
import ProjectImagesGrid from './ProjectImagesGrid';
import type { ProjectImage } from '@/hooks/content/useProjects';

interface ProjectImagesManagerProps {
  pageSlug?: string;
  bucket?: string;
  pageLabel?: string;
}

const ProjectImagesManager: React.FC<ProjectImagesManagerProps> = ({
  pageSlug = 'our-projects',
  bucket = 'projects-images',
  pageLabel = 'Our Projects',
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ProjectImage | null>(null);
  
  const { data: images = [], isLoading } = useProjectsImages(pageSlug);
  const deleteImage = useDeleteProjectImage();

  const handleEdit = (image: ProjectImage) => {
    setEditingImage(image);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      await deleteImage.mutateAsync(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingImage(null);
  };

  // Calculate next position
  const nextPosition = images.length > 0 
    ? Math.max(...images.map(img => img.position)) + 1 
    : 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Images</h3>
          <p className="text-sm text-muted-foreground">
            Manage images displayed on the {pageLabel} page
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading images...</div>
      ) : (
        <ProjectImagesGrid
          images={images}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ProjectImageDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        image={editingImage}
        nextPosition={nextPosition}
        pageSlug={pageSlug}
        bucket={bucket}
      />
    </div>
  );
};

export default ProjectImagesManager;
