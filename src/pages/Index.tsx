
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

// Redirect the Index page to the HomePage
const Index = () => {
  useEffect(() => {
    console.log("Index page loaded, redirecting to HomePage");
  }, []);
  
  return <Navigate to="/home" replace />;
};

export default Index;
