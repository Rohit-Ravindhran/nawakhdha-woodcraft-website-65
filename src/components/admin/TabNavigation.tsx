
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
}

const TabNavigation = ({ activeTab }: TabNavigationProps) => {
  return (
    <TabsList className="mb-8 flex flex-wrap gap-1">
      <TabsTrigger value="home">Home Page</TabsTrigger>
      <TabsTrigger value="all-products">All Products</TabsTrigger>
      <TabsTrigger value="product-details">Product Details</TabsTrigger>
      <TabsTrigger value="about">About</TabsTrigger>
      <TabsTrigger value="contact">Contact Us</TabsTrigger>
      <TabsTrigger value="blog">Blogs</TabsTrigger>
      <TabsTrigger value="gallery">Gallery</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
  );
};

export default TabNavigation;
