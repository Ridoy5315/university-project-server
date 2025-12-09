import express from 'express';
import { CredentialsController } from './credental.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createCredentialSchema } from './credentials.validation';



const router = express.Router();

router.post(
  "/add", validateRequest(createCredentialSchema), CredentialsController.addCredential
);



export const credentialRoutes = router;
