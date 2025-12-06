import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { TErrorSources } from "../interfaces/error.types";
import { Prisma } from "@prisma/client";
import { handleZodError } from "../helpers/handleZodError";
import config from "../../config";
import { prismaP2002Error, prismaP2025Error } from "../helpers/prismaClientError";

const sanitizeError = (error: any) => {
  // Don't expose Prisma errors in production
  if (process.env.NODE_ENV === "production" && error.code?.startsWith("P")) {
    return {
      message: "Database operation failed",
      errorDetails: null,
    };
  }
  return error;
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log({ err });

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let errorSources: TErrorSources[] = [];

  if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    message = err.message;
  } else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const simplifiedError = prismaP2002Error(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError.errorSources as TErrorSources[];
    }
    else if (err.code === "P2025") {
      const simplifiedError = prismaP2025Error(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError.errorSources as TErrorSources[];
    }
  }

  // Sanitize error before sending response
  //   const sanitizedError = sanitizeError(err.message);

  res.status(statusCode).json({
    success,
    message,
    errorSources,
    err: config.env === "development" ? err : null,
    stack: config.env === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
