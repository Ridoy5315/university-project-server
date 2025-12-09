import express from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUser } from "./user.validation";

const router = express.Router();



router.post(
  "/create-user", validateRequest(createUser) ,UserController.createUser
);

router.get(
  "/me" ,UserController.getUser
);

router.get(
  "/password-suggestion", UserController.getAISuggestion
);



export const userRoutes = router;
