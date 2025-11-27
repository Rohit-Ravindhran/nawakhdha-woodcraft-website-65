import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from 'lucide-react';
import type { ProjectImage } from '@/hooks/content/useProjects';

interface ProjectImagesGridProps {
  images: ProjectImage[];
  onEdit: (image: ProjectImage) => void;
  onDelete: (id: string) => void;
}

const ProjectImagesGrid: React.FC<ProjectImagesGridProps> = ({
  images,
  onEdit,
  onDelete,
}) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No images added yet. Click "Add Image" to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden group">
          <div className="relative w-full" style={{ minHeight: '200px' }}>
            <img
              src={image.image_url}
              alt={image.alt_text || image.caption || 'Project image'}
              className="w-full h-auto object-contain"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onEdit(image)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onDelete(image.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Position: {image.position}
              </span>
            </div>
            {image.caption && (
              <p className="text-sm truncate">{image.caption}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectImagesGrid;
