import { prisma } from "../../../config/db";
import * as bcrypt from "bcryptjs";
import AppError from "../../helpers/AppError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Login failed — wrong password."
    );
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
    },
    config.jwt.jwt_access_token_secret as Secret,
    config.jwt.jwt_access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
    },
    config.jwt.jwt_refresh_token_secret as Secret,
    config.jwt.jwt_refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getNewAccessToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_refresh_token_secret as Secret
    );
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email
    },
        config.jwt.jwt_access_token_secret as Secret,
        config.jwt.jwt_access_token_expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email
    },
        config.jwt.jwt_refresh_token_secret as Secret,
        config.jwt.jwt_refresh_token_expires_in as string
    );

    return {
        accessToken,
        refreshToken
    };
};

export const AuthServices = {
  loginUser,
  getNewAccessToken,
};
