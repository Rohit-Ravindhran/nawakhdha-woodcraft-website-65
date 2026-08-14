import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectsVideos, useProjectsImages } from '@/hooks/content/useProjects';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { useImageLightbox } from '@/hooks/use-image-lightbox';

interface ProjectMediaGalleryProps {
  pageSlug: string;
  title?: string;
  description?: string;
  fallbackAlt?: string;
}

const ProjectMediaGallery: React.FC<ProjectMediaGalleryProps> = ({
  pageSlug,
  title,
  description,
  fallbackAlt = 'Project image',
}) => {
  const { data: videos = [], isLoading: videosLoading } = useProjectsVideos(pageSlug);
  const { data: images = [], isLoading: imagesLoading } = useProjectsImages(pageSlug);
  const { isOpen, currentImage, openLightbox, closeLightbox } = useImageLightbox();

  return (
    <section className="section-padding">
      <div className="container-custom">
        {title && (
          <h2 className="heading-lg text-center mb-4 text-foreground">{title}</h2>
        )}
        {description && (
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10">{description}</p>
        )}

        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="videos" className="text-base">Videos</TabsTrigger>
            <TabsTrigger value="pictures" className="text-base">Pictures</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-0">
            {videosLoading ? (
              <div className="text-center py-12">Loading videos...</div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No videos available yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {videos.map((video) => (
                  <div key={video.id} className="space-y-3">
                    <div className="rounded-lg overflow-hidden shadow-md bg-muted" style={{ minHeight: '300px' }}>
                      {video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be') ? (
                        <iframe
                          src={video.video_url.replace('watch?v=', 'embed/')}
                          className="w-full aspect-video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={video.caption || 'Project video'}
                        />
                      ) : (
                        <video
                          src={video.video_url}
                          controls
                          className="w-full h-auto object-contain max-h-[600px]"
                          aria-label={video.alt_text || video.caption || 'Project video'}
                        />
                      )}
                    </div>
                    {video.caption && (
                      <p className="text-center text-muted-foreground">{video.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pictures" className="mt-0">
            {imagesLoading ? (
              <div className="text-center py-12">Loading images...</div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No images available yet.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    id={`project-${image.id}`}
                    className="relative rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-shadow group bg-muted"
                    style={{ minHeight: '200px' }}
                    onClick={() => openLightbox({
                      src: image.image_url,
                      alt: image.alt_text || image.caption || fallbackAlt,
                      caption: image.caption,
                    })}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || image.caption || fallbackAlt}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {currentImage && (
        <ImageLightbox
          isOpen={isOpen}
          onClose={closeLightbox}
          src={currentImage.src}
          alt={currentImage.alt}
          caption={currentImage.caption}
        />
      )}
    </section>
  );
};

export default ProjectMediaGallery;
