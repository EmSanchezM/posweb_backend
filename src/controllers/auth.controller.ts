import { Request, Response } from 'express';
import logger from '../utils/logger';

import { 
    CreateUserInput,
    LoginUserInput,
    ProfileUserInput
} from '../validations/user.schema';

import { signAccessToken, signRefreshToken } from '../services/auth.service';

import { 
    findUserByUserName,
    findUser,
    createUser,
    updateUser
} from '../services/user.service';

import { createPerson, updatePerson } from '../services/person.service';
import { createEmployee, findEmployee, updateEmployee } from '../services/employee.service';
import { omit } from 'lodash';

export async function registerHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response) {
    try {
        const { 
            identidad, 
            name, 
            lastName, 
            rtn, 
            birth, 
            gender, 
            email,
            username,
            password,
            rol, 
            phone1, 
            phone2, 
            country, 
            city, 
            location, 
            workLocation
        } = req.body;

        const personSave = {
            identidad, 
            name, 
            lastName, 
            rtn, 
            birth, 
            gender, 
            email, 
            phone1, 
            phone2, 
            country, 
            city, 
            location, 
            isActive: true
        };

        const person = await createPerson(personSave); 

        const employeeSave = {
            person: person._id,
            codeEmployee: `${rtn}_${lastName}`,
            workLocation,
            isActive: true
        };

        const employee = await createEmployee(employeeSave);

        const userSave = {
            employee: employee._id,
            username,
            password,
            rol,
            isActive: true
        };

        const user = await createUser(userSave);

        return res.status(201).send({
            ok: true,
            message: 'Usuario creado exitosamente',
            data: user
        })

    } catch (error: any) {
        logger.error(error);
        return res.status(409).json({
            ok: true,
            message: error.message
        });
    }
}

export async function loginHandler(req: Request<{}, {}, LoginUserInput["body"]>, res: Response){
    try {
        const { username, password } = req.body;
    
        let message = 'Credenciales no validas';
        
        const user = await findUserByUserName(username);
        
        if(!user) {
            return res.send(message); 
        }

        if(!user.isActive) {
            return res.send(message); 
        }

        const isValid = await user.comparePassword(password);

        if(!isValid) {
            throw new Error(message); 
        }
        
        const accessToken = signAccessToken(user);

        const refreshToken = signRefreshToken(user);
        
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });

        const data = omit(user.toJSON(), 'password');

        return res.status(200).json({
            ok: true,
            message: 'Inicio de sesion exitoso',
            user: data,
            accessToken
        });

    } catch (error : any) {
        logger.error(error);
        return res.status(409).json({
            ok: false,
            message: error.message
        });
    }
}

export async function authenticatedUserHandler(req: Request<{}, {}>, res: Response) {
    try {
        const userId = res.locals.user._id;

        const user = await findUser(userId);
        
        if(!user) {
            return res.status(401).json({
                ok: false,
                message: 'Unathorized'
            });
        }
        
        return res.status(200).json({
            ok: true,
            data: user 
        })

    } catch (error: any) {
        logger.error(error);
        return res.status(401).json({
            ok: false, 
            message: error.message
        })
    }
}

export async function logoutHandler(req: Request<{}, {}, {}>, res: Response) {
    res.cookie('jwt', '', { maxAge: 0 });

    return res.send({
        ok: true,
        message: 'Cerrada sesión'
    });
}

export async function updateProfile(req: Request<{}, {}, ProfileUserInput['body']>, res: Response) {
    try {
        const userId = res.locals.user._id;

        const { 
            identidad, 
            name, 
            lastName, 
            rtn, 
            birth, 
            gender, 
            email,
            username,
            phone1, 
            phone2, 
            country, 
            city, 
            location, 
            workLocation
        } = req.body;

        const user = await findUser(userId); 

        if(!user) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        const employee = await findEmployee(user.employee); 

        await updateEmployee(user.employee, {
            workLocation
        }); 

        await updatePerson(employee?.person, {
            identidad, 
            name, 
            lastName, 
            rtn, 
            birth, 
            gender, 
            email,
            username,
            phone1, 
            phone2, 
            country, 
            city, 
            location
        });

        await updateUser(userId, { username });

        return res.status(200).json({
            ok: true,
            message: 'Perfil de usuario actualizado'
        });

    } catch (error: any) {
        logger.error(error);
        return res.status(409).json({
            ok: false,
            message: error.message 
        });
    }
}

export async function refreshToken(req: Request<{},{}, {}>, res: Response) {
    const cookies = req.cookies;

    if(!cookies.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt
}