/**
 * API Client for Delta Steel Project
 * 
 * Centralized API functions for all backend endpoints
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Helper function to get current user from localStorage
const getCurrentUserFromStorage = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Generic fetch wrapper with auth
const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle 404 specifically
    if (response.status === 404) {
      const error = await response.json().catch(() => ({ message: "Not Found" }));
      const err = new Error(error.message || "Not Found");
      (err as any).status = 404;
      throw err;
    }
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      const error = await response.json().catch(() => ({ message: "Unauthorized" }));
      const err = new Error(error.message || "Unauthorized");
      (err as any).status = 401;
      throw err;
    }
    
    // Handle other errors
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    const err = new Error(error.message || `HTTP error! status: ${response.status}`);
    (err as any).status = response.status;
    throw err;
  }

  return response.json();
};

// ==================== AUTH API ====================

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Store token and user
    if (response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  getCurrentUser: () => {
    return getCurrentUserFromStorage();
  },
};

// ==================== PRODUCTS API ====================

export const productsAPI = {
  getAll: () => apiFetch("/admin/products"), // Admin only - requires auth
  getAllPublic: () => apiFetch("/products"), // Public - no auth required
  get: (id: number) => apiFetch(`/products/${id}`), // Public - no auth required
  getById: (id: number) => apiFetch(`/products/${id}`), // Alias for get - Public
  create: (data: any) =>
    apiFetch("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch(`/admin/products/${id}`, {
      method: "DELETE",
    }),
  duplicate: (id: number) =>
    apiFetch(`/admin/products/${id}/duplicate`, {
      method: "POST",
    }),
};

// ==================== BLOG API ====================

export const blogAPI = {
  getAll: () => apiFetch("/admin/blog"),
  get: (id: number) => apiFetch(`/blog/${id}`),
  listPublished: () => apiFetch("/blog"), // Public endpoint for published posts
  getPublished: (id: number) => apiFetch(`/blog/${id}`), // Public endpoint for single post
  create: (data: any) =>
    apiFetch("/admin/blog", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch(`/admin/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch(`/admin/blog/${id}`, {
      method: "DELETE",
    }),
};

// ==================== SERVICES API ====================

export const servicesAPI = {
  listCategories: () => apiFetch("/services/categories"),
  getCategories: () => apiFetch("/services/categories"), // Alias for public use
  listServices: (categoryId?: number) => {
    const endpoint = categoryId
      ? `/admin/services/services?categoryId=${categoryId}`
      : "/admin/services/services";
    return apiFetch(endpoint);
  },
  getService: (id: number) => apiFetch(`/services/${id}`),
  createService: (data: any) =>
    apiFetch("/admin/services/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateService: (id: number, data: any) =>
    apiFetch(`/admin/services/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteService: (id: number) =>
    apiFetch(`/admin/services/services/${id}`, {
      method: "DELETE",
    }),
  // Category management
  createCategory: (data: any) =>
    apiFetch("/admin/services/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCategory: (id: number, data: any) =>
    apiFetch(`/admin/services/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: number) =>
    apiFetch(`/admin/services/categories/${id}`, {
      method: "DELETE",
    }),
};

// ==================== SEARCH API ====================

export const searchAPI = {
  search: (query: string) => apiFetch(`/search?q=${encodeURIComponent(query)}`),
};

// ==================== USERS API ====================

export const usersAPI = {
  getAll: () => apiFetch("/admin/users"),
  get: (id: number) => apiFetch(`/admin/users/${id}`),
  create: (data: any) =>
    apiFetch("/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch(`/admin/users/${id}`, {
      method: "DELETE",
    }),
};

// ==================== PAGES API ====================

export const pagesAPI = {
  getAll: () => apiFetch("/admin/pages"),
  get: (id: number) => apiFetch(`/admin/pages/${id}`),
  getBySlug: (slug: string) => apiFetch(`/pages/${slug}`),
  create: (data: any) =>
    apiFetch("/admin/pages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiFetch(`/admin/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiFetch(`/admin/pages/${id}`, {
      method: "DELETE",
    }),
};

// ==================== PAGE-BASED CONTENT APIs ====================
// These use the Pages API with specific slugs

const getPageBySlug = async (slug: string) => {
  try {
    return await pagesAPI.getBySlug(slug);
  } catch (error: any) {
    // If page doesn't exist (404), return null
    if (error.status === 404 || error.message?.includes("404") || error.message?.includes("Not Found")) {
      return null;
    }
    // For other errors, rethrow
    throw error;
  }
};

const createOrUpdatePage = async (slug: string, data: any) => {
  try {
    // Try to get existing page
    const existing = await getPageBySlug(slug);
    
    if (existing) {
      // Find the page ID from admin pages list
      const allPages = await pagesAPI.getAll();
      const page = allPages.find((p: any) => p.slug === slug);
      if (page) {
        return await pagesAPI.update(page.id, { ...data, slug });
      }
    }
    
    // Create new page
    return await pagesAPI.create({ ...data, slug, isPublished: true });
  } catch (error) {
    // If update fails, try to create
    return await pagesAPI.create({ ...data, slug, isPublished: true });
  }
};

// ==================== SETTINGS API ====================

export const settingsAPI = {
  get: async () => {
    const page = await getPageBySlug("settings");
    if (page) {
      try {
        return JSON.parse(page.content || "{}");
      } catch {
        return {};
      }
    }
    return {};
  },
  update: async (data: any) => {
    return await createOrUpdatePage("settings", {
      title: "Settings",
      content: JSON.stringify(data),
    });
  },
};

// ==================== HERO API ====================

export const heroAPI = {
  get: async () => {
    const page = await getPageBySlug("hero");
    if (page) {
      try {
        return JSON.parse(page.content || "{}");
      } catch {
        return { slides: [] };
      }
    }
    return { slides: [] };
  },
  update: async (data: any) => {
    return await createOrUpdatePage("hero", {
      title: "Hero Section",
      content: JSON.stringify(data),
    });
  },
};

// ==================== ABOUT API ====================

export const aboutAPI = {
  get: async () => {
    const page = await getPageBySlug("about");
    if (page) {
      try {
        return JSON.parse(page.content || "{}");
      } catch {
        return {};
      }
    }
    return {};
  },
  update: async (data: any) => {
    return await createOrUpdatePage("about", {
      title: "About",
      content: JSON.stringify(data),
    });
  },
};

// ==================== STRATEGY API ====================

export const strategyAPI = {
  get: async () => {
    const page = await getPageBySlug("strategy");
    if (page) {
      try {
        return JSON.parse(page.content || "{}");
      } catch {
        return {};
      }
    }
    return {};
  },
  update: async (data: any) => {
    return await createOrUpdatePage("strategy", {
      title: "Strategy",
      content: JSON.stringify(data),
    });
  },
};

// ==================== QUALITY API ====================

export const qualityAPI = {
  get: async () => {
    const page = await getPageBySlug("quality");
    if (page) {
      try {
        return JSON.parse(page.content || "{}");
      } catch {
        return {};
      }
    }
    return {};
  },
  update: async (data: any) => {
    return await createOrUpdatePage("quality", {
      title: "Quality",
      content: JSON.stringify(data),
    });
  },
};

// ==================== VISION MISSION API ====================

export const visionMissionAPI = {
  get: async () => {
    const page = await getPageBySlug("vision-mission");
    if (page) {
      try {
        return JSON.parse(page.content || "{}");
      } catch {
        return {};
      }
    }
    return {};
  },
  update: async (data: any) => {
    return await createOrUpdatePage("vision-mission", {
      title: "Vision & Mission",
      content: JSON.stringify(data),
    });
  },
};

// ==================== CEO MESSAGE API ====================

export const ceoMessageAPI = {
  get: async () => {
    const page = await getPageBySlug("ceo-message");
    if (page) {
      try {
        return JSON.parse(page.content || "{}");
      } catch {
        return {};
      }
    }
    return {};
  },
  update: async (data: any) => {
    return await createOrUpdatePage("ceo-message", {
      title: "CEO Message",
      content: JSON.stringify(data),
    });
  },
};

// ==================== LABORATORY EQUIPMENT API ====================

export const laboratoryEquipmentAPI = {
  get: async () => {
    const page = await getPageBySlug("laboratory-equipment");
    if (page) {
      try {
        return JSON.parse(page.content || "{}");
      } catch {
        return {};
      }
    }
    return {};
  },
  update: async (data: any) => {
    return await createOrUpdatePage("laboratory-equipment", {
      title: "Laboratory Equipment",
      content: JSON.stringify(data),
    });
  },
};

// ==================== PUBLIC SETTINGS API ====================

export const defaultSettingsData = {
  siteName: "شركة مصانع الدلتا للصلب",
  contact: {
    email: "info@deltasteel.com",
    phone: "+20 123 456 7890",
    address: "مصر",
  },
  socialMedia: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  },
};

export const publicSettingsAPI = {
  get: async () => {
    try {
      const page = await getPageBySlug("settings");
      if (page) {
        try {
          return JSON.parse(page.content || "{}");
        } catch {
          return defaultSettingsData;
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
    return defaultSettingsData;
  },
};

// ==================== UPLOAD API ====================

export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/upload/image`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },
};

