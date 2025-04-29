
import React from "react";

interface TabContentWrapperProps {
  children: React.ReactNode;
}

const TabContentWrapper = ({ children }: TabContentWrapperProps) => {
  return (
    <div className="space-y-8">
      {children}
    </div>
  );
};

export default TabContentWrapper;
