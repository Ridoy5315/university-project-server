import httpStatus from "http-status";
import { prisma } from "../../../config/db";
import AppError from "../../helpers/AppError";
import * as bcrypt from "bcryptjs";
import config from "../../../config";
import { decrypt, encrypt } from "../../../utils/encryption";
import { ICredential } from "../../interfaces/credential.types";

const addCredential = async (payload: ICredential) => {
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

  await prisma.user.findUniqueOrThrow({
    where: {
      email: userEmail,
    },
  });

  const credentials = await prisma.credential.findMany({
    where: {
      email: userEmail,
    },
  });

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

const updateUserCredential = async (credentialId: string, payload: Partial<ICredential>) => {
  
  if (!payload.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is required to update credential."
    );
  }

  const encryptedPassword = encrypt(payload.password);

  const credentialData = {
    label: payload.label,
    url: payload.url,
    username: payload.username,
    password: encryptedPassword,
  };
  
  const credential = await prisma.credential.findUniqueOrThrow({
    where: {id: credentialId},
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: {email: credential.email}
  })

  const updatedCredential = await prisma.credential.update({
    where: {id: credential.id},
    data: credentialData
  })

  return updatedCredential;
};

export const CredentialsServices = {
  addCredential,
  getUserCredentials,
  updateUserCredential,
};
