
import React from 'react';
import { Loader2 } from 'lucide-react';

export function ProductLoading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
