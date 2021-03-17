import * as Dotenv from "dotenv";

process.env.NODE_ENV === "development" &&
  Dotenv.config({
    path: "dev.env",
  });

if (!process.env.REDIS_URL) throw new Error("REDIS_URL not defined");

export const { NODE_ENV, REDIS_URL, PORT } = process.env;
