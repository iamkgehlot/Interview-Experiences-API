import type { userType } from "./user.validations.js";
import type { UserRepository } from "./user.repo.js";

import type { SafeUser } from "../../types/user.return.js";
import AppError from "../../utils/error.handler.js";
import {HTTP_STATUS, USER_MESSAGE } from "../../constants/constants.js";

export default class UserService {
  constructor(public userRepo: UserRepository) {}

  //get user by id
  getUserById = async (id: number): Promise<SafeUser | null> => {
    const data= await this.userRepo.findById(id);
    if(!data){
      throw new AppError(HTTP_STATUS.NOT_FOUND,USER_MESSAGE.USER_FETCH_FAIL(id))
    }
    //sanitize outgoing user
     
    ;
    return data;
  };

  //get all users
  getAllUsers = async (): Promise<SafeUser[] | []> => {
    const allUsers = await this.userRepo.findAll();
    //sanitize outgoing user
     
   // const safeData = allUsers.map(({ password, ...rest }) => rest);
    return allUsers;
  };

  //update user
  updateUser = async (id: number, user: userType): Promise<SafeUser> => {
    //sanitize incoming data;
    const { name, email, age, yearsOfExperience, current_role, industry } =
      user;
    const safeUser = {name,email,age,yearsOfExperience,current_role,industry };

    const data = await this.userRepo.update(id, safeUser);

    //sanitze data
     
    
    return data;
  };

  //delete User
  deleteUser = async (id: number): Promise<void> => {
     await this.userRepo.delete(id);
  };
}
