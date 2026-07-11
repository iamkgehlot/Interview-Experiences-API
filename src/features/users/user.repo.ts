
import type { updatedUserType } from "./user.validations.js";

import type { UserDTOType } from "../../types/user.DTO.js";

export interface UserRepository {
  // create(data: userType): Promise<User>;
  findAll(): Promise<UserDTOType[]>;
  findById(id: number): Promise<UserDTOType | null>;
  update(id: number, data: updatedUserType): Promise<UserDTOType>;
  delete(id: number): Promise<UserDTOType>;
  findUserId(id: number): Promise<{ userId: number } | null>;
}
