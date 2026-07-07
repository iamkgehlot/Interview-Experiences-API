import type { SystemRole } from "@prisma/client";

export type safeData={
 name: string;
 id: number;
 role: SystemRole;
 email: string;
 age: number;
 yearsOfExperience: number;
 current_role: string;
 industry: string;
};