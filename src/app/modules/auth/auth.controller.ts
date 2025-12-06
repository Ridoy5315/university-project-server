import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../config/db";
import * as bcrypt from "bcryptjs";
import AppError from "../../helpers/AppError";
import sendResponse from "../../shared/sendResponse";
import config from "../../../config";
import { AuthServices } from "./auth.service";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessTokenExpiresIn = config.jwt
      .jwt_access_token_expires_in as string;
    const refreshTokenExpiresIn = config.jwt
      .jwt_refresh_token_expires_in as string;

    // convert accessTokenExpiresIn to milliseconds
    let accessTokenMaxAge = 0;
    const accessTokenUnit = accessTokenExpiresIn.slice(-1);
    const accessTokenValue = parseInt(accessTokenExpiresIn.slice(0, -1));
    if (accessTokenUnit === "y") {
      accessTokenMaxAge = accessTokenValue * 365 * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "M") {
      accessTokenMaxAge = accessTokenValue * 30 * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "w") {
      accessTokenMaxAge = accessTokenValue * 7 * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "d") {
      accessTokenMaxAge = accessTokenValue * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "h") {
      accessTokenMaxAge = accessTokenValue * 60 * 60 * 1000;
    } else if (accessTokenUnit === "m") {
      accessTokenMaxAge = accessTokenValue * 60 * 1000;
    } else if (accessTokenUnit === "s") {
      accessTokenMaxAge = accessTokenValue * 1000;
    } else {
      accessTokenMaxAge = 1000 * 60 * 60; // default 1 hour
    }

    // convert refreshTokenExpiresIn to milliseconds
    let refreshTokenMaxAge = 0;
    const refreshTokenUnit = refreshTokenExpiresIn.slice(-1);
    const refreshTokenValue = parseInt(refreshTokenExpiresIn.slice(0, -1));
    if (refreshTokenUnit === "y") {
      refreshTokenMaxAge = refreshTokenValue * 365 * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "M") {
      refreshTokenMaxAge = refreshTokenValue * 30 * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "w") {
      refreshTokenMaxAge = refreshTokenValue * 7 * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "d") {
      refreshTokenMaxAge = refreshTokenValue * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "h") {
      refreshTokenMaxAge = refreshTokenValue * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "m") {
      refreshTokenMaxAge = refreshTokenValue * 60 * 1000;
    } else if (refreshTokenUnit === "s") {
      refreshTokenMaxAge = refreshTokenValue * 1000;
    } else {
      refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 30; // default 30 days
    }

    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;

    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: accessTokenMaxAge,
    });
    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: refreshTokenMaxAge,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logged in successfully!",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const getNewAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;
    const accessTokenExpiresIn = config.jwt
      .jwt_access_token_expires_in as string;
    const refreshTokenExpiresIn = config.jwt
      .jwt_refresh_token_expires_in as string;

    // convert accessTokenExpiresIn to milliseconds
    let accessTokenMaxAge = 0;
    const accessTokenUnit = accessTokenExpiresIn.slice(-1);
    const accessTokenValue = parseInt(accessTokenExpiresIn.slice(0, -1));
    if (accessTokenUnit === "y") {
      accessTokenMaxAge = accessTokenValue * 365 * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "M") {
      accessTokenMaxAge = accessTokenValue * 30 * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "w") {
      accessTokenMaxAge = accessTokenValue * 7 * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "d") {
      accessTokenMaxAge = accessTokenValue * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === "h") {
      accessTokenMaxAge = accessTokenValue * 60 * 60 * 1000;
    } else if (accessTokenUnit === "m") {
      accessTokenMaxAge = accessTokenValue * 60 * 1000;
    } else if (accessTokenUnit === "s") {
      accessTokenMaxAge = accessTokenValue * 1000;
    } else {
      accessTokenMaxAge = 1000 * 60 * 60; // default 1 hour
    }

    // convert refreshTokenExpiresIn to milliseconds
    let refreshTokenMaxAge = 0;
    const refreshTokenUnit = refreshTokenExpiresIn.slice(-1);
    const refreshTokenValue = parseInt(refreshTokenExpiresIn.slice(0, -1));
    if (refreshTokenUnit === "y") {
      refreshTokenMaxAge = refreshTokenValue * 365 * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "M") {
      refreshTokenMaxAge = refreshTokenValue * 30 * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "w") {
      refreshTokenMaxAge = refreshTokenValue * 7 * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "d") {
      refreshTokenMaxAge = refreshTokenValue * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "h") {
      refreshTokenMaxAge = refreshTokenValue * 60 * 60 * 1000;
    } else if (refreshTokenUnit === "m") {
      refreshTokenMaxAge = refreshTokenValue * 60 * 1000;
    } else if (refreshTokenUnit === "s") {
      refreshTokenMaxAge = refreshTokenValue * 1000;
    } else {
      refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 30; // default 30 days
    }

    const result = await AuthServices.getNewAccessToken(refreshToken);

    res.cookie("accessToken", result.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: accessTokenMaxAge,
    });
    res.cookie("refreshToken", result.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: refreshTokenMaxAge,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Access token generated successfully!",
      data: {
        message: "Access token generated successfully!",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  loginUser,
  getNewAccessToken,
};
