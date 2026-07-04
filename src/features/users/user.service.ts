import type { userType } from "./user.validations.js";
import type { UserRepository } from "./user.repo.js";
import type { User } from "@prisma/client";

export default class UserService {
  constructor(public userRepo: UserRepository) {}
  //post user
  // postUser = async (data: userType): Promise<User> => {
  //   return await this.userRepo.create(data);
  // };

  //get user by id
  getUserById = async (id: number): Promise<User | null> => {
    return await this.userRepo.findById(id);
  };

  //get all users
  getAllUsers = async (): Promise<User[] | []> => {
    return await this.userRepo.findAll();
  };

  //update user
  updateUser = async (id: number, user: userType): Promise<User> => {
    const safeUser = {
      name: user.name,
      email: user.email,
      age: user.age,
      yearsOfExperience: user.yearsOfExperience,
      current_role: user.current_role,
      industry: user.industry,
    };
    return await this.userRepo.update(id, safeUser);
  };

  //delete User
  deleteUser = async (id: number): Promise<User> => {
    return await this.userRepo.delete(id);
  };
}
