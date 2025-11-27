import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateProjectImage, useUpdateProjectImage, type ProjectImage } from '@/hooks/content/useProjects';
import { useImageUpload } from '@/hooks/storage/useImageUpload';

const imageSchema = z.object({
  image_url: z.string().url('Must be a valid URL'),
  caption: z.string().optional(),
  alt_text: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  position: z.coerce.number().min(0),
});

type ImageFormData = z.infer<typeof imageSchema>;

interface ProjectImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: ProjectImage | null;
  nextPosition: number;
}

const ProjectImageDialog: React.FC<ProjectImageDialogProps> = ({
  open,
  onOpenChange,
  image,
  nextPosition,
}) => {
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const createImage = useCreateProjectImage();
  const updateImage = useUpdateProjectImage();
  const { uploadImage, uploading } = useImageUpload();

  const form = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image_url: '',
      caption: '',
      alt_text: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      position: nextPosition,
    },
  });

  useEffect(() => {
    if (image) {
      form.reset({
        image_url: image.image_url,
        caption: image.caption || '',
        alt_text: image.alt_text || '',
        meta_title: image.meta_title || '',
        meta_description: image.meta_description || '',
        meta_keywords: image.meta_keywords || '',
        position: image.position,
      });
      setUploadedUrl(image.image_url);
    } else {
      form.reset({
        image_url: uploadedUrl || '',
        caption: '',
        alt_text: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        position: nextPosition,
      });
    }
  }, [image, nextPosition, uploadedUrl, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, 'projects-images', '', { optimize: true, imageType: 'product' });
      if (url) {
        setUploadedUrl(url);
        form.setValue('image_url', url);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const onSubmit = async (data: ImageFormData) => {
    try {
      // Ensure image_url is present
      if (!data.image_url) {
        return;
      }

      const payload = {
        image_url: data.image_url,
        caption: data.caption || undefined,
        alt_text: data.alt_text || undefined,
        meta_title: data.meta_title || undefined,
        meta_description: data.meta_description || undefined,
        meta_keywords: data.meta_keywords || undefined,
        position: data.position,
      };

      if (image) {
        await updateImage.mutateAsync({ id: image.id, ...payload });
      } else {
        await createImage.mutateAsync(payload);
      }
      onOpenChange(false);
      setUploadedUrl('');
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{image ? 'Edit Image' : 'Add Image'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel className="text-base font-semibold">Upload Image *</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="cursor-pointer"
              />
              {uploading && <p className="text-sm text-primary">Uploading image...</p>}
              {!uploadedUrl && !uploading && !image && (
                <p className="text-sm text-muted-foreground">
                  Please upload an image first to enable the Create button
                </p>
              )}
              {uploadedUrl && (
                <div className="mt-2">
                  <p className="text-sm text-green-600 mb-2">✓ Image uploaded successfully</p>
                  <img 
                    src={uploadedUrl} 
                    alt="Preview" 
                    className="max-w-xs rounded-lg border"
                  />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter image caption" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alt_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Descriptive text for accessibility" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Position</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 space-y-4">
              <h4 className="font-semibold">SEO Metadata (Optional)</h4>
              
              <FormField
                control={form.control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="SEO description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="keyword1, keyword2, keyword3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={uploading || !uploadedUrl || !form.formState.isValid}
                title={!uploadedUrl ? 'Please upload an image first' : ''}
              >
                {image ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectImageDialog;
