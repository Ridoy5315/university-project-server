import httpStatus from "http-status";
import { prisma } from "../../../config/db";
import AppError from "../../helpers/AppError";
import * as bcrypt from "bcryptjs";
import config from "../../../config";
import { decrypt, encrypt } from "../../../utils/encryption";

const addCredential = async (payload) => {

  const encryptedPassword = encrypt(payload.password);

  const credentialData = {
    email: payload.email,
    label: payload.label,
    siteName: payload.siteName,
    url: payload.url,
    username: payload.username,
    password: encryptedPassword,
  };
   await prisma.user.findUniqueOrThrow({
    where: {
      email: credentialData.email,
    },
  });

  const credential = await prisma.credential.findFirst({
    where: {
      email: credentialData.email,
      siteName: credentialData.siteName,
      username: credentialData.username,
    },
  });

  if (credential) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already saved this account for this website in your vault."
    );
  }

  const result = await prisma.credential.create({
    data: credentialData,
    include: {
      user: true,
    },
  });

  return result;
};

const getUserCredentials = async (userEmail: string) => {
  console.log("KEY LENGTH:", Buffer.from(config.encryption_key!, "hex").length);
   await prisma.user.findUniqueOrThrow({
    where: {
      email: userEmail,
    },
  });

  const credentials = await prisma.credential.findMany({
    where: {
      email: userEmail
    }
  })

  const formatted = credentials.map((cred) => ({
    id: cred.id,
    email: cred.email,
    siteName: cred.siteName,
    label: cred.label,
    url: cred.url,
    username: cred.username,
    decryptedPassword: decrypt(cred.password), // show decrypted version
    createdAt: cred.createdAt,
    updatedAt: cred.updatedAt,
  }));



  return formatted;
};

export const CredentialsServices = {
  addCredential,
  getUserCredentials
};
