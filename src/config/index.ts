import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  salt_round: process.env.SALT_ROUND,
  openRouterApiKey: process.env.OPEN_ROUTER_API_KEY,
};
