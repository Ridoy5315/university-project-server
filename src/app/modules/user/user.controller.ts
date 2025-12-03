import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { prisma } from "../../../config/db";
import * as bcrypt from "bcryptjs";
import config from "../../../config";

const createUser = async (req: Request, res: Response) => {
  const hashedPassword: string = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round)
  );

  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  };

  try {
    const result = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Created the user",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
};

export const UserController = {
  createUser,
};
