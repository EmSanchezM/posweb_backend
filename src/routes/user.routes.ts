import { Router } from 'express';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';

//Areas
import { 
    createUserHandler,
    findUserHandler,
    findUsersHandler,
    updateUserHandler,
    deleteUserHandler
} from '../controllers/user.controller';

import { 
    getUserSchema,
    createUserSchema,
    updateUserSchema,
    deleteUserSchema
} from '../validations/user.schema';
import { checkRole } from '../middlewares/checkRole';
import { ROLES } from '../utils/constants/roles';

const router = Router();

// User admin routes
router.get('/api/admin/users', [requireUser, checkRole([ROLES.ADMIN]) ], findUsersHandler);
router.get('/api/admin/users/:userId', [requireUser, checkRole([ROLES.ADMIN]), validateResource(getUserSchema)], findUserHandler);
router.post('/api/admin/users', [requireUser, checkRole([ROLES.ADMIN]), validateResource(createUserSchema)], createUserHandler);
router.put('/api/admin/users/:userId', [requireUser, checkRole([ROLES.ADMIN]), validateResource(updateUserSchema)], updateUserHandler);
router.delete('/api/admin/users/:userId', [requireUser, checkRole([ROLES.ADMIN]), validateResource(deleteUserSchema)], deleteUserHandler);

export default router;