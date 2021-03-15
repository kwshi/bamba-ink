import * as Redis from "redis";

import * as Config from "./config";

export const client = Redis.createClient(Config.REDIS_URL);
