// This file is kept for backwards compatibility but auth is now handled via AuthContext + Supabase
// See src/contexts/AuthContext.tsx for the real implementation
export const authService = {
  getCurrentUser: () => null,
  isAdmin: () => false,
};
