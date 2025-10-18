import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectVideosManager from './my-projects/ProjectVideosManager';
import ProjectImagesManager from './my-projects/ProjectImagesManager';

const MyProjectsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Projects Management</CardTitle>
          <CardDescription>
            Manage videos and images displayed on the My Projects page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-6">
              <ProjectVideosManager />
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <ProjectImagesManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProjectsTab;
