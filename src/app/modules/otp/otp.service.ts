import httpStatus from "http-status";
import crypto from "crypto";
import { redisClient } from "../../../config/redis.config";
import { sendEmail } from "../../../config/sendEmail";
import AppError from "../../helpers/AppError";
import { prisma } from "../../../config/db";

const OTP_EXPIRATION = 5 * 60; // 5 minutes

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (email: string, name: string) => {
  let user;
  try {
    user = await prisma.user.findUniqueOrThrow({
      where: { email },
    });
  } catch {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No account found with this email."
    );
  }

  if (user.isVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your account is already verified."
    );
  }

  const otp = generateOtp();

  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });

  return {};
};

const verifyOTP = async (email: string, otp: string) => {
     
  let user;

  try {
    user = await prisma.user.findUniqueOrThrow({
      where: { email },
    });
  } catch {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No account found with this email."
    );
  }

  if (user.isVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your account is already verified."
    );
  }
  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "The verification code has expired. Please request a new OTP."
    );
  }

  if (savedOtp !== otp) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "The verification code you entered is incorrect. Please try again."
    );
  }

  await Promise.all([
    prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    }),

    redisClient.del([redisKey]),
  ]);
};

export const OTPServices = {
  sendOTP,
  verifyOTP,
};
