import type { User } from "@prisma/client";
import type { userType } from "./user.validations.js";
import type { SafeUser } from "./user.return.js";

export interface UserRepository {
  // create(data: userType): Promise<User>;
  findAll(): Promise<SafeUser[]>;
  findById(id: number): Promise<SafeUser | null>;
  update(id: number, data: userType): Promise<SafeUser>;
  delete(id: number): Promise<User>;
  findUserId(id: number): Promise<{ userId: number } | null>;
}
