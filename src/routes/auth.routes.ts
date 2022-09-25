import { Router } from 'express';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';

import { 
    loginHandler,
    registerHandler,
    authenticatedUserHandler,
    logoutHandler,
    updateProfile,
    refreshToken
} from '../controllers/auth.controller';

import { 
    loginSchema,
    createUserSchema,
    updateProfileSchema
} from '../validations/user.schema';

const router = Router();

router.post('/api/auth/login', validateResource(loginSchema), loginHandler);
router.post('/api/auth/register', validateResource(createUserSchema), registerHandler);
router.get('/api/auth/user', requireUser, authenticatedUserHandler);
router.get('api/auth/refresh', refreshToken);
router.post('/api/auth/logout', requireUser, logoutHandler);
router.put('/api/auth/profile', [requireUser, validateResource(updateProfileSchema)], updateProfile);

export default router;