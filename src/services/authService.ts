import { mockUsers } from "@/data/mockData";
import type { User } from "@/types";

// Mock auth — replace with calls to your Auth microservice
let currentUser: User | null = null;

export const authService = {
  async login(email: string, _password: string): Promise<User | null> {
    const user = mockUsers.find((u) => u.email === email);
    if (user) currentUser = user;
    return user ?? null;
  },

  async logout(): Promise<void> {
    currentUser = null;
  },

  getCurrentUser(): User | null {
    return currentUser;
  },

  isAdmin(): boolean {
    return currentUser?.role === "admin";
  },
};
