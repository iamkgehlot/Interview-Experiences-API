import type { Experience } from "../../generated/prisma/client.js";
import type { experienceType } from "./experience.validations.js";

export default interface ExperienceRepo{
    create(userid:number,experience:experienceType):Promise<Experience>,
    findAllByUserId(id:number):Promise<Experience[]>,
    findAllExperience():Promise<Experience[]>,
    findById(id:number):Promise<Experience|null>,
    update(id:number,experience:experienceType):Promise<Experience>,
    delete(id:number):Promise<Experience>,
    fetchUserId(experienceId:number):Promise<{userId:number}|null>
}