import type { AuthRepository } from "./auth.repo.js";
import type { User } from "../../generated/prisma/index.js";
import type { loginType, userType } from "./auth.validations.js";
import bcrypt from "bcryptjs";



export default class AuthService {
  constructor(public authRepo: AuthRepository) {}

  register = async (data: userType): Promise<User> => {
    const {password}=data;
    const saltRounds=10;
    const hashedPassowrd=await bcrypt.hash(password,saltRounds);
    data.password=hashedPassowrd;
    const d=await bcrypt.compare("kamlesh978",data.password);
    console.log(d);
    return await this.authRepo.create(data);
  };

  login =async(data:loginType):Promise<boolean> =>{
    const fetchedData= await this.authRepo.login(data);
    if(fetchedData?.password){
      const result= await bcrypt.compare(data.password,fetchedData.password)
   
        return result

      
    }


return false;

  }
}