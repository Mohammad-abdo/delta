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
  // Always use production API in production builds
  // Check if we're running on production domain
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'deltasteelmill.com' || 
     window.location.hostname === 'www.deltasteelmill.com');
  
  if (isProduction) {
    return "https://back.deltasteelmill.com";
  }
  
  // For development, use environment variable or default to production
  const apiBase = import.meta.env.VITE_API_URL || "https://back.deltasteelmill.com/api";
  const origin = apiBase.replace(/\/api\/?$/, "");
  
  // Never return localhost - always use production API
  if (origin.includes("localhost")) {
    return "https://back.deltasteelmill.com";
  }
  
  return origin;
};
//new
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
  // This handles: http://localhost:4000/uploads/file.png, https://localhost:4000/uploads/file.png, etc.
  if (trimmedSrc.includes("localhost")) {
    // Extract /uploads/ path from localhost URL
    // Pattern: /uploads/ followed by filename (numbers, letters, dots, hyphens) and extension
    const uploadsMatch = trimmedSrc.match(/\/uploads\/[^/\s"'?]+/);
    if (uploadsMatch) {
      // Remove any query parameters or fragments
      const cleanPath = uploadsMatch[0].split('?')[0].split('#')[0];
      // Convert to relative path and resolve using API origin
      const apiOrigin = getApiOrigin();
      return apiOrigin ? `${apiOrigin}${cleanPath}` : cleanPath;
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
    // ALWAYS use production API for relative paths - never localhost
    // Check if we're on production domain first
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'deltasteelmill.com' || hostname === 'www.deltasteelmill.com') {
        return `https://back.deltasteelmill.com${trimmedSrc}`;
      }
    }
    
    // Get API origin, but never use localhost
    const apiOrigin = getApiOrigin();
    if (apiOrigin && !apiOrigin.includes("localhost") && apiOrigin !== "") {
      return `${apiOrigin}${trimmedSrc}`;
    }
    
    // Final fallback: ALWAYS use production API
    return `https://back.deltasteelmill.com${trimmedSrc}`;
  }
  
  // Return as-is for other cases
  return trimmedSrc;
};

