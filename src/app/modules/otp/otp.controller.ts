import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { NextFunction, Request, Response } from "express";
import { OTPServices } from "./otp.service";

const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    await OTPServices.sendOTP(email, name);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP sent successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    await OTPServices.verifyOTP(email, otp);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP verified successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const OTPController = {
  sendOTP,
  verifyOTP,
};
