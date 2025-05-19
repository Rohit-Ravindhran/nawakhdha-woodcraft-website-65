
import React from 'react';

export function ProductNotFound() {
  return (
    <div className="container-custom py-16">
      <h1 className="text-2xl font-bold mb-4 text-center">Product Not Found</h1>
      <p className="text-center text-muted-foreground">
        Sorry, we couldn't find the product you're looking for.
      </p>
    </div>
  );
}
