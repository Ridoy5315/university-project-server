import express from 'express';
import { CredentialsController } from './credental.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createCredentialSchema, updateCredentialSchema } from './credentials.validation';



const router = express.Router();

router.post(
  "/add", validateRequest(createCredentialSchema), CredentialsController.addCredential
);

router.get(
  "/userCredentials",  CredentialsController.getUserCredentials
);

router.patch("/:id", validateRequest(updateCredentialSchema), CredentialsController.updateUserCredential)



export const credentialRoutes = router;
