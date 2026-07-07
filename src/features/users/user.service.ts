import type { userType } from "./user.validations.js";
import type { UserRepository } from "./user.repo.js";

import type { safeData } from "../../types/user.return.js";

export default class UserService {
  constructor(public userRepo: UserRepository) {}

  //get user by id
  getUserById = async (id: number): Promise<safeData | null> => {
    const data= await this.userRepo.findById(id);
    //sanitize outgoing user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password,...safeData}=data;
    return safeData;
  };

  //get all users
  getAllUsers = async (): Promise<safeData[] | []> => {
    const allUsers = await this.userRepo.findAll();
    //sanitize outgoing user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const safeData = allUsers.map(({ password, ...rest }) => rest);
    return safeData;
  };

  //update user
  updateUser = async (id: number, user: userType): Promise<safeData> => {
    //sanitize incoming data;
    const { name, email, age, yearsOfExperience, current_role, industry } =
      user;
    const safeUser = {name,email,age,yearsOfExperience,current_role,industry };

    const data = await this.userRepo.update(id, safeUser);

    //sanitze data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = data;
    return rest;
  };

  //delete User
  deleteUser = async (id: number): Promise<void> => {
     await this.userRepo.delete(id);
  };
}
