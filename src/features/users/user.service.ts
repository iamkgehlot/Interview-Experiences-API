import type { userType } from "./user.validations.js";
import type { UserRepository } from "./user.repository.js";
import type { User } from "../../generated/prisma/client.js";

export default class UserService {
  constructor(public userRepo: UserRepository) {}
  //post user
  postUser = async (data: userType):Promise<User> => {
    const createdUser = await this.userRepo.create(data);
    return createdUser;
  };

  //get user by id
  getUserById = async (id: number):Promise<User|null> => {
    const getUserById = await this.userRepo.findById(id);
    return getUserById;
  };

  //get all users
  getAllUsers = async ():Promise<User[]|null> => {
    const data = await this.userRepo.findAll();
    return data;
  };

  //update user
  updateUser = async (id: number, user: userType) :Promise<User>=> {
    const updatedUser = await this.userRepo.update(id, user);

    return updatedUser;
  };

  //delete User
  deleteUser=async (id:number):Promise<User>=>{
    return await this.userRepo.delete(id);
  }
}
