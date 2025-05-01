
/**
 * Safely parses a JSON string, handling null, undefined, and "NULL" values
 * @param jsonString The JSON string to parse
 * @returns The parsed object or null if parsing fails
 */
export function safeJsonParse(jsonString: string | null | undefined) {
  if (!jsonString || jsonString === "NULL") return null;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return null;
  }
}

/**
 * Checks if a value is a valid JSON string
 * @param value The value to check
 * @returns True if the value is a valid JSON string, false otherwise
 */
export function isJsonString(value: any): boolean {
  if (typeof value !== 'string') return false;
  if (value === "NULL") return false;
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Safely parses a JSON string, returns null if parsing fails
 * @param input The JSON string to parse
 * @returns The parsed object or null if parsing fails
 */
export function parseJSON(input: string | null | undefined): any | null {
  if (!input) return null;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}
