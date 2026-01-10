import { fetchApi } from "./api-client";

export async function getCurrentUser() {
  try {
    const response = await fetchApi("/auth/profile");
    if (response.success && response.data) {
      const user = response.data;
      // Ensure we have name in all formats expected by the frontend
      if (user) {
        user.fullName = user.name || user.fullName;
        user.full_name = user.name || user.fullName;

        // Normalize roles to lowercase for frontend consistency
        const rawRole = (user.role || "").toUpperCase();
        if (rawRole === 'ADMIN') user.role = 'admin';
        else if (rawRole === 'EDITOR') user.role = 'redactor';
        else if (rawRole === 'AUTHOR') user.role = 'viewer';
        else user.role = rawRole.toLowerCase();
      }
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function getUserProfile() {
  return getCurrentUser();
}

export async function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  }
}

export type UserRole = "admin" | "redactor" | "viewer";

export async function hasRole(role: UserRole | UserRole[]) {
  const user = await getCurrentUser();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role as UserRole);
  }

  return user.role === role;
}
