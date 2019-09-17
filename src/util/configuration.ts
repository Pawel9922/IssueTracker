import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync("config/.env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: "config/.env" });
} else {
    logger.debug("Using local-config file to supply config environment variables");
    dotenv.config({ path: "config/local-config" });
}

export const ENVIRONMENT = process.env.NODE_ENV;

const prod = ENVIRONMENT === "production";
export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];

if (!MONGODB_URI) {
    if (prod) {
        logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    } else {
        logger.error("No mongo connection string. Set MONGODB_URI_LOCAL environment variable.");
    }
    process.exit(1);
}
