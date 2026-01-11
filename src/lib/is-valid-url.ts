
export function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === '') {
    return false;
  }
  
  // Check for data URIs
  if (value.startsWith('data:image/')) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
