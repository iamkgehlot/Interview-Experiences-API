import { AsyncLocalStorage } from "node:async_hooks";
import { baseLogger } from "../config/base.logger.js";
import { type Logger } from "pino";

type loggerStore={
    logger:Logger
}

const asyncLocalStorage=new AsyncLocalStorage<loggerStore>();
 const getLogger=()=>{
    const store=asyncLocalStorage.getStore();
    return store?store.logger:baseLogger;
}
export {asyncLocalStorage,getLogger};