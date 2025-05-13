
/// <reference types="vite/client" />

// Add global GA type
interface Window {
  ga?: (command: string, hitType: string, ...fields: any[]) => void;
}
