import { prisma } from "../repositories/prisma.js";
import type { userType } from "../validations/user.validations.js";

const postUserService = async (input: userType)  => {
    const {name,email,age,yearsOfExperience,current_role,industry}=input;
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      yearsOfExperience:Number(yearsOfExperience),
      current_role,
      industry,
      age:Number(age)
    },
  });
  return createdUser;
};

export {postUserService};
