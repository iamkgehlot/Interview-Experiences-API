import createApp from "../../index.js";
import request from "supertest";

const appInstance=createApp();
const expressApp=appInstance.getServer();
export const testClient=request(expressApp);