import type { SystemRole } from "@prisma/client";

export type CleanedUser = {
  id: number;
  name: string;
  email: string;
};

export type cleanData = {
  name: string;
  email: string;
  age: number;
  role:SystemRole;
  password:string;
  yearsOfExperience: number;
  current_role: string;
  industry: string;
};
