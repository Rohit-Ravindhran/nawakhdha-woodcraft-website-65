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
import { useCreateProjectVideo, useUpdateProjectVideo, type ProjectVideo } from '@/hooks/content/useProjects';
import { useImageUpload } from '@/hooks/storage/useImageUpload';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const videoSchema = z.object({
  video_url: z.string().min(1, 'Video URL is required'),
  caption: z.string().optional(),
  alt_text: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  position: z.coerce.number().min(0),
});

type VideoFormData = z.infer<typeof videoSchema>;

interface ProjectVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: ProjectVideo | null;
  nextPosition: number;
  pageSlug?: string;
  bucket?: string;
}

const ProjectVideoDialog: React.FC<ProjectVideoDialogProps> = ({
  open,
  onOpenChange,
  video,
  nextPosition,
  pageSlug = 'our-projects',
  bucket = 'projects-videos',
}) => {
  const createVideo = useCreateProjectVideo();
  const updateVideo = useUpdateProjectVideo();
  const { uploadImage: uploadVideo, uploading } = useImageUpload();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      video_url: '',
      caption: '',
      alt_text: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      position: nextPosition,
    },
  });

  useEffect(() => {
    if (video) {
      form.reset({
        video_url: video.video_url,
        caption: video.caption || '',
        alt_text: video.alt_text || '',
        meta_title: video.meta_title || '',
        meta_description: video.meta_description || '',
        meta_keywords: video.meta_keywords || '',
        position: video.position,
      });
      setVideoPreview(video.video_url);
    } else {
      form.reset({
        video_url: '',
        caption: '',
        alt_text: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        position: nextPosition,
      });
      setVideoPreview(null);
    }
  }, [video, nextPosition, form]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, MOV, or WebM)');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Video file size must be less than 100MB');
      return;
    }

    try {
      setUploadProgress(10);
      
      // Upload to Supabase storage
      const videoUrl = await uploadVideo(file, bucket, '', { 
        optimize: false,
        imageType: 'other'
      });
      
      setUploadProgress(100);

      if (videoUrl) {
        form.setValue('video_url', videoUrl);
        setVideoPreview(videoUrl);
        toast.success('Video uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploadProgress(0);
    }
  };

  const onSubmit = async (data: VideoFormData) => {
    try {
      const payload = {
        video_url: data.video_url,
        caption: data.caption || undefined,
        alt_text: data.alt_text || undefined,
        meta_title: data.meta_title || undefined,
        meta_description: data.meta_description || undefined,
        meta_keywords: data.meta_keywords || undefined,
        position: data.position,
        page_slug: pageSlug,
      };

      if (video) {
        await updateVideo.mutateAsync({ id: video.id, ...payload });
      } else {
        await createVideo.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{video ? 'Edit Video' : 'Add Video'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL or Upload *</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input 
                        placeholder="https://youtube.com/watch?v=... or upload from PC" 
                        {...field} 
                        disabled={uploading}
                      />
                      
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer">
                          <Button 
                            type="button" 
                            variant="outline" 
                            disabled={uploading}
                            asChild
                          >
                            <span>
                              {uploading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload from PC
                                </>
                              )}
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="video/mp4,video/quicktime,video/webm"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <span className="text-sm text-muted-foreground">
                            {uploadProgress}%
                          </span>
                        )}
                      </div>

                      {videoPreview && (
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <video 
                            src={videoPreview} 
                            controls 
                            className="w-full max-h-48 rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter video caption" {...field} />
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
              <Button type="submit">
                {video ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectVideoDialog;
