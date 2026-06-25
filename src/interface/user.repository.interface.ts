import type { userType } from "../validations/user.validations.js";

export interface IUserRepo {
  create(data: userType): Promise<userType>;
  findAll(): Promise<userType[]>;
  findById(id: number): Promise<userType | null>;
  update(id: number, data: userType): Promise<userType>;
}
