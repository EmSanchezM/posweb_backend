import { Request, Response } from 'express';
import logger from '../utils/logger';

import { 
   CreateCustomerInput,
   ReadCustomerInput,
   UpdateCustomerInput,
   DeleteCustomerInput
} from '../validations/customer.schema';

import { 
    createCustomer,
    findCustomer,
    findCustomers,
    updateCustomer,
    deleteCustomer
} from '../services/customer.service';

import { createPerson, deletePerson, updatePerson } from '../services/person.service';
import { validateObjectID } from '../utils/validateObjectId';

export async function createCustomerHandler(req: Request<{}, {}, CreateCustomerInput["body"]>, res: Response){
    try {
        const { 
            identidad, 
            name, 
            lastName, 
            rtn, 
            gender, 
            birth, 
            email, 
            phone1, 
            phone2, 
            location,
            country,
            city,
            payIVA
        } = req.body; 

        const personSave = {
            identidad, 
            name, 
            lastName, 
            rtn, 
            gender, 
            birth, 
            email, 
            phone1, 
            phone2, 
            location,
            country,
            city,
            isActive: true
        }

        const person = await createPerson(personSave);
        
        const customerSave = {
            person: person._id,
            codeCustomer: `${req.body.rtn}_${req.body.lastName}`,
            payIVA,
            isActive: true 
        }

        const customer = await createCustomer(customerSave);

        return res.status(201).json({
            ok: true,
            message: 'Cliente creado exitosamente',
            data: customer
        });

    } catch (error : any) {
        logger.error(error);
        return res.status(409).json({
            ok: true,
            message: error.message
        });
    }
}

export async function findCustomersHandler(req: Request, res: Response){
    try {
        const customers = await findCustomers();

        return res.status(200).json({
            ok: true,
            data: customers
        });
    } catch (error: any) {
        logger.error(error);
        return res.status(409).json({
            ok: false,
            message: error.message 
        });        
    }
}

export async function findCustomerHandler(req: Request<ReadCustomerInput['params']>, res: Response){
    try {
        const customerId = req.params.customerId;

        const message = validateObjectID(customerId);

        if(message !== '') {
            return res.status(400).send({
                ok: false,
                message 
            });
        }

        const customer = await findCustomer(customerId);

        if(!customer){
            return res.status(404).json({
                ok: false,
                message: 'Cliente no encontrado'
            });
        }

        return res.status(200).json({
            ok: true,
            data: customer
        });
    } catch (error: any) {
        logger.error(error);

        return res.status(409).json({
            ok: false,
            message: error.message 
        });        
    }
}

export async function updateCustomerHandler(
    req: Request<UpdateCustomerInput['params']>,
    res: Response
){
    try {
        const customerId = req.params.customerId;

        const { 
            identidad, 
            name, 
            lastName, 
            rtn, 
            gender, 
            birth, 
            email, 
            phone1, 
            phone2, 
            location,
            country,
            city
        } = req.body;

        const message = validateObjectID(customerId);

        if(message !== '') {
            return res.status(400).send({
                ok: false,
                message 
            });
        }

        const customerFind = await findCustomer(customerId);
        
        if(!customerFind){
            return res.status(404).json({
                ok: false,
                message: 'Cliente no encontrado'
            });
        }

        const personUpdate = {
            identidad, 
            name, 
            lastName, 
            rtn, 
            gender, 
            birth, 
            email, 
            phone1, 
            phone2, 
            location,
            country,
            city,
        }

        await updatePerson(customerFind?.person, personUpdate);
        
        const customer = await updateCustomer(customerId, req.body);

        return res.status(200).json({
            ok: true,
            message: 'Cliente actualizado exitosamente',
            data: customer
        });

    } catch (error: any) {
        logger.error(error);
        
        return res.status(409).json({
            ok: false,
            message: error.message 
        }); 
    }
}

export async function deleteCustomerHandler(
    req: Request<DeleteCustomerInput['params']>,
    res: Response 
){
    try {
        const customerId = req.params.customerId;

        const message = validateObjectID(customerId);

        if(message !== '') {
            return res.status(400).send({
                ok: false,
                message 
            });
        }

        const customer = await findCustomer(customerId);

        if(!customer){
            return res.status(404).json({
                ok: false,
                message: 'Cliente no encontrado'
            });
        }

        await deletePerson(customer.person); 

        await deleteCustomer(customer._id);

        return res.status(200).json({
            ok: true, 
            message: 'Cliente eliminado exitosamente',
            data: customer
        });

    } catch (error: any) {
        logger.error(error);
        return res.status(409).json({
            ok: false,
            message: error.message 
        }); 
    }
}
