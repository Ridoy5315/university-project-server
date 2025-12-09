import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { NextFunction, Request, Response } from "express";
import { CredentialsServices } from "./credential.service";

const addCredential = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const result = await CredentialsServices.addCredential(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment booked successfully!",
        data: result
    })
  } catch (error) {
    next(error);
  }
};

export const CredentialsController = {
     addCredential
};