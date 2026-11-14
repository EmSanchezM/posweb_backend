import { object, string, boolean, date, TypeOf } from "zod";
import { invalidType, required } from './errorMessages';

const payload = {
    body: object({
        identidad: string(required('Identidad es requerida'))
        .trim(),

        name: string(required('Nombre es requerido'))
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim(),

        lastName: string(required('Last Name is required')).min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim(),

        rtn: string()
            .min(14, { message: 'Debe tener 14 o más caracteres de largo'})
            .trim(),

        gender: string().trim(),
        
        birth: string(),

        email: string(required('Email es requerido'))
        .trim()
        .email('No es un email valido'),

        phone1: string(required('Telefono es requerido')).trim(),

        phone2: string().trim(),

        location: string().trim(),

        country: string().trim(),

        city: string().trim(),

        payIVA: boolean(required('Paga IVA es requerido'))
    })
};

const updatePayload = {
    body: object({
        identidad: string(invalidType('Identidad must be a string'))
        .trim()
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .optional(),

        name: string(invalidType('Identidad must be a string'))
        .trim()
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .optional(),

        lastName: string(invalidType('Last Name must be a string'))
        .trim()
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .optional(),

        rtn: string(invalidType('RTN must be a string'))
        .trim()
        .optional(),

        gender: string(invalidType('Gender must be a string'))
        .trim()
        .optional(),
        
        birth: string().optional(),

        email: string(invalidType('Email must be a string'))
        .trim()
        .email('Not a valid email')
        .optional(),

        phone1: string().trim().optional(),

        phone2: string().trim().optional(),

        location: string().trim().optional(),

        country: string().trim().optional(),

        city: string().trim().optional(),

        payIVA: boolean().optional()

    })
};

const params = {
    params: object({
        customerId: string(required('Customer ID es requerido')),
    }),
};

export const createCustomerSchema = object({
    ...payload
});

export const getCustomerSchema = object({
    ...params 
});

export const updateCustomerSchema = object({
    ...updatePayload,
    ...params
});

export const deleteCustomerSchema = object({
    ...params 
});

export type CreateCustomerInput = TypeOf<typeof createCustomerSchema>;
export type UpdateCustomerInput = TypeOf<typeof updateCustomerSchema>;
export type ReadCustomerInput = TypeOf<typeof getCustomerSchema>;
export type DeleteCustomerInput = TypeOf<typeof deleteCustomerSchema>;