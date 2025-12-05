import { NextFunction, Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { prisma } from "../../../config/db";
import * as bcrypt from "bcryptjs";
import config from "../../../config";
import { askOpenRouter } from "../../helpers/open-router";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
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
    next(error);
  }
};

const getAISuggestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.query.name || "";

    const prompt = `
      Generate ONE strong, memorable password inspired by the user's name: "${userName}".
      
      Rules:
      - DO NOT include the full name inside the password.
      - You may use only the first letter or abstract theme.
      - Must be hard to guess.
      - Length: 12–16 characters.
      - Must include uppercase, lowercase, numbers, and symbols.
      - Must NOT include spaces.
      - Must not be a dictionary word.

      Return JSON only:
      {
        "password": "..."
      }
    `;

    const response = await askOpenRouter([{ role: "user", content: prompt }]);
    const cleanedJson = response
    .replace(/```(?:json)?\s*/, "") // remove ``` or ```json
    .replace(/```$/, "") // remove ending ```
    .trim();

    const json = JSON.parse(cleanedJson);

    console.log(json)

    res.json({
      success: true,
      password: json.password,
    });

  } catch (error) {
    next(error)
  }
};

export const UserController = {
  createUser,
  getAISuggestion
};
