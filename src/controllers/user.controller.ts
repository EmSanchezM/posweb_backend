import { Request, Response } from 'express';
import logger from '../utils/logger';

import { 
    CreateUserInput,
    ReadUserInput,
    UpdateUserInput,
    DeleteUserInput
} from '../validations/user.schema';

import { 
    createUser,
    deactivateUser,
    findUsersAdmin,
    findUser,
    updateUser
} from '../services/user.service';
import { validateObjectID } from '../utils/validateObjectId';
import { createPerson, updatePerson } from '../services/person.service';
import { createEmployee, findEmployee, updateEmployee } from '../services/employee.service';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response){
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

        return res.status(201).json({
            ok: true,
            message: 'Usuario creado exitosamente',
            data: user
        });

    } catch (error : any) {
        logger.error(error);
        return res.status(409).json({
            ok: true,
            message: error.message
        });
    }
}

export async function findUsersHandler(req: Request, res: Response){
    try {
        const users = await findUsersAdmin();
        
        return res.status(200).json({
            ok: true,
            data: users
        });
    } catch (error: any) {
        logger.error(error);
        return res.status(409).json({
            ok: false,
            message: error.message 
        });        
    }
}

export async function findUserHandler(req: Request<ReadUserInput['params']>, res: Response){
    try {
        const userId = req.params.userId;
        
        const message = validateObjectID(userId);

        if(message !== '') {
            return res.status(400).send({
                ok: false,
                message 
            });
        }

        const user = await findUser(userId);

        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            ok: true,
            data: user
        });
    } catch (error: any) {
        logger.error(error);
        return res.status(409).json({
            ok: false,
            message: error.message 
        });        
    }
}

export async function updateUserHandler(
    req: Request<UpdateUserInput['params']>,
    res: Response
){
    try {
        const userId = req.params.userId;

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
        
        const message = validateObjectID(userId);

        if(message !== '') {
            return res.status(400).send({
                ok: false,
                message 
            });
        }
    
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
            message: 'Usuario actualizado exitosamente'
        });

    } catch (error: any) {
        logger.error(error);
        return res.status(409).json({
            ok: false,
            message: error.message 
        }); 
    }
}

export async function deleteUserHandler(
    req: Request<DeleteUserInput['params']>,
    res: Response 
){
    try {
        const userId = req.params.userId;

        const message = validateObjectID(userId);

        if(message !== '') {
            return res.status(400).send({
                ok: false,
                message 
            });
        }

        const user = await findUser(userId);
        
        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

       await deactivateUser(user._id, { isActive: !user.isActive });

        return res.status(200).json({
            ok: true, 
            message: 'Usuario eliminada exitosamente',
            data: user
        });

    } catch (error: any) {
        logger.error(error);
        return res.status(409).json({
            ok: false,
            message: error.message 
        }); 
    }
}
