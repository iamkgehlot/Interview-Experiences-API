import { ERROR_MESSAGE, HTTP_STATUS } from "../constants/constants.js";
import { prisma } from "../repositories/prisma.js";
import AppError from "../utils/error.handler.js";
import type { userType } from "../validations/user.validations.js";

//post user
const postUserService = async (input: userType) => {
  const { name, email, age, yearsOfExperience, current_role, industry } = input;
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      yearsOfExperience,
      current_role,
      industry,
      age,
    },
  });
  return createdUser;
};

//get user by id
const getUserByIdService = async (id: number) => {
 
  const getUserById = await prisma.user.findFirst({
    where: {
      id,
    },
  });
  return getUserById;
};

//get all users
const getAllUsersService = async () => {
  const data = await prisma.user.findMany();
  return data;
};

//update user
const updateUserService = async (id: number, user: userType) => {
  console.log(id);
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: user,
  });

  return updatedUser;
};

export {
  postUserService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
};
