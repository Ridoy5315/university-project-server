import crypto from "crypto";
import config from "../config";

const algorithm = "aes-256-ctr";
const secretKey = Buffer.from(config.encryption_key!, "hex"); // Must be 32 bytes
const ivLength = 16;

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (text: string) => {
  const [ivHex, contentHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const content = Buffer.from(contentHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrypted = Buffer.concat([
    decipher.update(content),
    decipher.final(),
  ]);

  return decrypted.toString();
};