import type { UserRepository } from "./user.repo.js";
import AppError from "../../utils/error.handler.js";
import { HTTP_STATUS, USER_MESSAGE } from "../../constants/constants.js";
import { userDTO, type UserDTOType } from "../../types/user.DTO.js";
import z from "zod";
import { updatedUserBodySchema, type userType } from "./user.validations.js";
import { getLogger } from "../../context/logger.js";
const logger=()=>getLogger().child({
  module:"user",
  service:"service"
})
export default class UserService {
  constructor(public userRepo: UserRepository) {}

  //get user by id
  getUserById = async (id: number): Promise<UserDTOType | null> => {
    const data = await this.userRepo.findById(id);
    if (!data) {
      
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        USER_MESSAGE.USER_FETCH_FAIL(id),
      );
    };
    logger().info({userId:id},"user fetched successfully")
    const safeData=userDTO.parse(data);
    return safeData;
  };

  //get all users
  getAllUsers = async (): Promise<UserDTOType[] | []> => {
    const allUsers = await this.userRepo.findAll();
    if(allUsers.length===0){
      logger().info("0 user fetched")
      return [];
    }
    const parseAllUsers=z.array(userDTO).parse(allUsers);
    logger().info("all user fetched successfully")

    return parseAllUsers;
  };

  //update user
  updateUser = async (id: number, user: userType): Promise<UserDTOType> => {
    //sanitize incoming data;//making service layer independent of controller
    const safeUser=  updatedUserBodySchema.parse(user);

    const data = await this.userRepo.update(id, safeUser);
    const safeData=userDTO.parse(data);

    logger().info({userId:id},"user updated successfully")
    return safeData;
  };

  //delete User
  deleteUser = async (id: number): Promise<void> => {
    logger().info({userId:id},"user deleted successfully");
    await this.userRepo.delete(id);
  };
}
