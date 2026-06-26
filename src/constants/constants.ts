export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NO_CONTENT:204
});

export const JSON_SUCCESS = Object.freeze({
  TRUE: true,
  FALSE: false,
});

export const USER_MESSAGE = Object.freeze({
  SIGNUP_SUCCESS: "User created successfully",
  LOGIN_SUCESS: "User logged in successfully",
  USER_FETCH_SUCCESS: "User fetched successfully",
  USER_FETCH_FAIL: (id: number | string) => `No User found with id: ${id}`,
  ALL_USERS_FETCH_SUCCESS: "All Users fetched successfully",
  ALL_USERS_FETCH_FAIL: "No User found in database",
  UPDATE_USER_SUCCESS: (id: string | number) => `User updated with id: ${id}`,
  DELETE_USER_SUCCESS: (id: string | number) =>
    `User with id: ${id} deleted successfully`,
});
// export const EXPERIENCE_MESSAGES=Object.freeze({
//   NO_EXPERIENCE_FOUND_FOR_ID:(id:number)=>`no experience found with given Experience id: ${id}`,
//   NO_EXPERIENCE_FOUND_FOR_USER_ID:(id:number)=>`no experience found with given USer id: ${id}`
// })
export const ERROR_MESSAGE = Object.freeze({
  JSON_DATA_ERROR: "json format is not valid",
  P2002_ERROR: (targets: string) => `${targets} already exists`,
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  ID_CHECK_FAIL: "Id should be a number",
});
