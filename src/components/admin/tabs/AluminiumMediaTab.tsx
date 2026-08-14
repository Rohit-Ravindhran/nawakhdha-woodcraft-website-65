import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectVideosManager from './my-projects/ProjectVideosManager';
import ProjectImagesManager from './my-projects/ProjectImagesManager';

const PAGE_SLUG = 'aluminium-work-bahrain';

const AluminiumMediaTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Aluminium Works Media</CardTitle>
          <CardDescription>
            Manage videos and images displayed on the Aluminium Works page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-6">
              <ProjectVideosManager pageSlug={PAGE_SLUG} pageLabel="Aluminium Works" />
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <ProjectImagesManager pageSlug={PAGE_SLUG} pageLabel="Aluminium Works" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AluminiumMediaTab;
