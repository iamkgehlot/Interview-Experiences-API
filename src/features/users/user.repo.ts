import type { User } from "../../generated/prisma/client.js";
import type { userType } from "./user.validations.js";

export interface UserRepository {
  // create(data: userType): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  update(id: number, data: userType): Promise<User>;
  delete(id:number):Promise<User>
}
