import type { userType } from "../validations/user.validations.js";
import type { IUserRepo } from "../interface/user.repository.interface.js";

export default class UserService {
  constructor(public userRepo: IUserRepo) {}
  //post user
  postUserService = async (data: userType) => {
    const createdUser = await this.userRepo.create(data);
    return createdUser;
  };

  //get user by id
  getUserByIdService = async (id: number) => {
    const getUserById = await this.userRepo.findById(id);
    return getUserById;
  };

  //get all users
  getAllUsersService = async () => {
    const data = await this.userRepo.findAll();
    return data;
  };

  //update user
  updateUserService = async (id: number, user: userType) => {
    const updatedUser = await this.userRepo.update(id, user);

    return updatedUser;
  };
}
