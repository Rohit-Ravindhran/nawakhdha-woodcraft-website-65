
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminHeaderProps {
  handleLogout: () => void;
}

const AdminHeader = ({ handleLogout }: AdminHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-md">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Enhanced Content Management</AlertTitle>
        <AlertDescription>
          You can now easily edit all content and images across your website, with built-in SEO optimization tools. 
          Images are automatically compressed for better performance.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default AdminHeader;
