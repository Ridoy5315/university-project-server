import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { prisma } from "../../../config/db";

const createUser = async (req: Request, res: Response) => {
  

  const userData = req.body;

  

  try {
    const result = await prisma.user.create({
      data: userData,
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
