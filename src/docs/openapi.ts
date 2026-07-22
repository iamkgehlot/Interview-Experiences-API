import { registry } from "./registry.js";
import { OpenApiGeneratorV32 } from "@asteasolutions/zod-to-openapi";
import "../features/users/user.openapi.js";

const generator= new OpenApiGeneratorV32(registry.definitions);
export const openApiDocument=generator.generateDocument({
    openapi: "3.0.0",
    info: {
        title:"Interview Experience Api",
        version:"1.0.0",
        description:"Api Documentation"
    },
    servers:[{
        url:"https://localhost:3000"
    }]
})