import express from 'express'
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { otpRoutes } from '../modules/otp/otp.route';
import { credentialRoutes } from '../modules/credentials/credential.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/otp',
        route: otpRoutes
    },
    {
        path: '/credentials',
        route: credentialRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;