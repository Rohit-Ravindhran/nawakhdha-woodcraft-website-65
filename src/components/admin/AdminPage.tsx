
// We need to improve the AdminPage with storage bucket initialization
// Add the following check at the beginning of the AdminPage component

import { useStorageBuckets } from "@/hooks/useStorageBuckets";

// Add at the top of the AdminPage component:
const { isInitialized: bucketsInitialized, error: bucketsError } = useStorageBuckets();

// Then ensure it's passed to the actual page layout
