import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../config/db";
import * as bcrypt from 'bcryptjs';
import AppError from "../../helpers/AppError";
import sendResponse from '../../shared/sendResponse';

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const {email, password} = req.body;

     const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(password, userData.password);

    if (!isCorrectPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Login failed — wrong password.")
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logged in successfully.",
      data: {},
    });

  } catch (error) {
     next(error);
  }
};

export const authController = {
  loginUser,
};
