
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminHeaderProps {
  handleLogout: () => void;
}

const AdminHeader = ({ handleLogout }: AdminHeaderProps) => {
  const { user } = useAuth();
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="heading-md">Admin Dashboard</h1>
          {user && (
            <div className="ml-4 text-sm text-muted-foreground flex items-center">
              <User className="h-4 w-4 mr-1" />
              {user.email}
            </div>
          )}
        </div>
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
