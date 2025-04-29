
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
}

const TabNavigation = ({ activeTab }: TabNavigationProps) => {
  return (
    <TabsList className="mb-8">
      <TabsTrigger value="pages">Main Pages</TabsTrigger>
      <TabsTrigger value="products">Products</TabsTrigger>
      <TabsTrigger value="blog">Blog</TabsTrigger>
      <TabsTrigger value="gallery">Gallery</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
  );
};

export default TabNavigation;
