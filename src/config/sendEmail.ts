import nodemailer from "nodemailer";
import config from ".";
import { SendEmailOptions } from "../app/interfaces/sendEmailOptions";
import path from "path";
import ejs from "ejs";
import AppError from "../app/helpers/AppError";

const transporter = nodemailer.createTransport({
  secure: true,
  auth: {
    user: config.smtp.smtp_user,
    pass: config.smtp.smtp_pass,
  },
  port: Number(config.smtp.smtp_port),
  host: config.smtp.smtp_host,
});

export const sendEmail = async ({
  from,
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    // const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
    const templatePath = path.join(
      process.cwd(),
      "src",
      "app",
      "shared",
      "templates",
      `${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const sender = from || config.smtp.smtp_from;

    const info = await transporter.sendMail({
      from: sender,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    // eslint-disable-next-line no-console
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log("email sending error", error.message);
    throw new AppError(401, "Email error");
  }
};
