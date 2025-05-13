
/**
 * Safely parses a JSON string, returning a default value if parsing fails
 * @param jsonString The JSON string to parse
 * @param defaultValue The default value to return if parsing fails (defaults to null)
 * @returns The parsed JSON object or default value
 */
export const parseJSON = <T>(jsonString: any, defaultValue: T | null = null): T | null => {
  if (jsonString === null || jsonString === undefined || jsonString === "NULL" || jsonString === "null") {
    return defaultValue;
  }
  
  // If it's already an object, just return it
  if (typeof jsonString === 'object' && jsonString !== null) {
    return jsonString as T;
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return defaultValue;
  }
};

/**
 * Alias for parseJSON for backward compatibility
 */
export const safeJsonParse = parseJSON;

/**
 * Checks if a value is a valid JSON string
 * @param value The value to check
 * @returns True if the value is a valid JSON string, false otherwise
 */
export function isJsonString(value: any): boolean {
  if (typeof value !== 'string') return false;
  if (value === "NULL" || value === "null") return false;
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}
