import { mockUsers } from "@/data/mockData";
import type { User } from "@/types";

export const userService = {
  async getAll(): Promise<User[]> {
    return mockUsers;
  },

  async getById(id: string): Promise<User | undefined> {
    return mockUsers.find((u) => u.id === id);
  },
};
