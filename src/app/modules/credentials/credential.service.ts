import httpStatus from 'http-status';
import { prisma } from "../../../config/db";
import AppError from "../../helpers/AppError";

const addCredential = async (payload) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const credential = await prisma.credential.findFirst({
  where: {
    email: payload.email,
    siteName: payload.siteName,
    username: payload.username,
  },
});

if (credential) {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "You already saved this account for this website in your vault."
  );
}

  const result = await prisma.credential.create({
    data: payload,
    include: {
      user: true,
    },
  });

  return result;
};

export const CredentialsServices = {
  addCredential,
};
