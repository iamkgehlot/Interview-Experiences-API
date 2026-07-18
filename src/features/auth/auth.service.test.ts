
import type { AuthRepository } from "./auth.repo.js";
import AuthService from "./auth.service.js";
import bcrypt from "bcryptjs";
import { SystemRole } from "@prisma/client";
import { envConfig } from "../../config/env.config.js";


jest.mock("../../context/logger.js", () => ({
  getLogger: jest.fn(() => ({
    child: jest.fn(() => ({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    })),
  })),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare:jest.fn()
}));
jest.mock("jsonwebtoken",()=>({
    sign:jest.fn()
}))
jest.mock("../../config/env.config.js",()=>({
    envConfig:jest.fn(()=>({
        JWT_SECRET:jest.fn()
    }))
}))

describe("Auth Service", () => {
  let authService: AuthService;
  let mockRepo: jest.Mocked<AuthRepository>;

  


  const data = {
    name: "kamlesh",
    password: "superSecretPassword123",
    email: "iamkgehlot@gmail.com",
    age: 29,
    yearsOfExperience: 3,
    current_role: "backend dev",
    industry: "it",
    role:SystemRole.USER
  };
  const validLogin={
    email:"iamkgehlot@gmail.com",
    password:"superSecretPassword123"
  }

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      deleteRefreshToken: jest.fn(),
      replaceRefreshToken: jest.fn(),
      createRefreshToken: jest.fn(),
      logOut: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;
    authService=new AuthService(mockRepo);

  });

  describe("register",()=>{
    test("HappyPath: user registers successfully",async ()=>{
        (bcrypt.hash as jest.Mock).mockResolvedValue("hash_password");
        
        const signupData={id:1,...data}
        mockRepo.create.mockResolvedValue({...signupData});

        const result=await authService.register(data);
        
        expect(bcrypt.hash).toHaveBeenCalledWith("superSecretPassword123",expect.any(Number));
        expect(mockRepo.create).toHaveBeenCalledWith({...data,password:"hash_password"})
        expect(mockRepo.create).toHaveBeenCalledTimes(1);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password,...resultData}=signupData
        expect(result).toEqual({...resultData});
    })
  });
  describe("login",()=>{
    test("HappyPath: successful login",async ()=>{
        const dbResponse={id:1,role:SystemRole.USER,password:"hash_password"}
        mockRepo.login.mockResolvedValue(dbResponse);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (envConfig.JWT_SECRET as jest.Mock).mockReturnValue("jwt_secret_mocked")

        const result=await authService.login(validLogin);

        expect(bcrypt.compare).toHaveBeenCalledWith(validLogin.password,dbResponse.password);
       // expect(result).toEqual


    })
  })
  
});
