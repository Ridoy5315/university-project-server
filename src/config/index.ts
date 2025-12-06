import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  salt_round: process.env.SALT_ROUND,
  openRouterApiKey: process.env.OPEN_ROUTER_API_KEY,
  jwt: {
    jwt_access_token_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_token_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_token_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_token_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  redis: {
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_username: process.env.REDIS_USERNAME,
    redis_password: process.env.REDIS_PASSWORD,
  },
  smtp: {
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
    smtp_from: process.env.SMTP_FROM,
  }
};
