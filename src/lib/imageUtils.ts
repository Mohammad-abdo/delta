/**
 * Image URL Resolution Utility
 * 
 * Centralized utility for resolving image URLs from the backend.
 * Handles relative paths, full URLs, and base64 images.
 */

/**
 * Get the API origin URL (without /api suffix)
 */
export const getApiOrigin = (): string => {
  const apiBase = import.meta.env.VITE_API_URL || "";
  // Remove /api suffix if present
  return apiBase.replace(/\/api\/?$/, "");
};

/**
 * Resolve image URL to a full URL that can be used in img src
 * 
 * @param src - Image source (can be relative path, full URL, or base64)
 * @returns Resolved image URL
 */
export const resolveImageUrl = (src?: string | null): string => {
  if (!src || !src.trim()) return "";
  
  const trimmedSrc = src.trim();
  
  // Handle base64 images - return as-is
  if (trimmedSrc.startsWith("data:image/")) {
    return trimmedSrc;
  }
  
  // Handle full URLs (http/https) - check for localhost FIRST
  if (trimmedSrc.includes("localhost")) {
    // Extract /uploads/ path from localhost URL
    const uploadsMatch = trimmedSrc.match(/\/uploads\/[^\/\s"']+(?:\.[a-zA-Z0-9]+)?/);
    if (uploadsMatch) {
      // Convert to relative path and resolve using API origin
      const apiOrigin = getApiOrigin();
      return apiOrigin ? `${apiOrigin}${uploadsMatch[0]}` : uploadsMatch[0];
    }
    // If localhost URL but no /uploads/ found, return empty
    return "";
  }
  
  // Handle other full URLs (http/https) - return as-is
  if (trimmedSrc.startsWith("http://") || trimmedSrc.startsWith("https://")) {
    return trimmedSrc;
  }
  
  // Handle relative paths from uploads
  if (trimmedSrc.startsWith("/uploads/")) {
    const apiOrigin = getApiOrigin();
    if (apiOrigin) {
      return `${apiOrigin}${trimmedSrc}`;
    }
    // If no API origin configured, return relative path (will be resolved by browser)
    return trimmedSrc;
  }
  
  // Return as-is for other cases
  return trimmedSrc;
};

