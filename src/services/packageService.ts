import { mockPackages } from "@/data/mockData";
import type { SafariPackage } from "@/types";

// Replace with real API calls to your Package microservice
const API_BASE = "/api/packages";

export const packageService = {
  async getAll(): Promise<SafariPackage[]> {
    return mockPackages.filter((p) => p.status === "published");
  },

  async getById(id: string): Promise<SafariPackage | undefined> {
    return mockPackages.find((p) => p.id === id);
  },

  async getBySlug(slug: string): Promise<SafariPackage | undefined> {
    return mockPackages.find((p) => p.slug === slug);
  },

  async getFeatured(): Promise<SafariPackage[]> {
    return mockPackages.filter((p) => p.featured && p.status === "published");
  },

  async getAllAdmin(): Promise<SafariPackage[]> {
    return mockPackages;
  },

  async create(pkg: Omit<SafariPackage, "id" | "createdAt">): Promise<SafariPackage> {
    const newPkg: SafariPackage = { ...pkg, id: `p${Date.now()}`, createdAt: new Date().toISOString() };
    mockPackages.push(newPkg);
    return newPkg;
  },

  async update(id: string, data: Partial<SafariPackage>): Promise<SafariPackage | undefined> {
    const idx = mockPackages.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    Object.assign(mockPackages[idx], data);
    return mockPackages[idx];
  },
};
