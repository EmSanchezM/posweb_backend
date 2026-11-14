import { object, string, TypeOf } from "zod";
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

        companyName: string(required('Nombre de la empresa es requerido'))
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim(),

        companyLocation: string(required('Ubicación de la empresa es requerido'))
        .min(2, { message: 'Debe tener 2 o más caracteres de largo' })
        .trim(),

        companyPhone1: string(required('Telefono es requerido')).trim(),

        companyPhone2: string().trim(),

        companyRtn: string()
        .min(14, { message: 'Debe tener 14 o más caracteres de largo'})
        .trim(),

        companyLogo: string().trim(),

        workPosition: string().trim(),
        
        title: string().trim()
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
        
        birth: string().trim(),

        email: string(invalidType('Email must be a string'))
        .trim()
        .email('Not a valid email')
        .optional(),

        phone1: string().trim().optional(),

        phone2: string().trim().optional(),

        location: string().trim().optional(),

        country: string().trim().optional(),

        city: string().trim().optional(),

        companyName: string(required('Nombre de la empresa es requerido'))
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim(),

        companyLocation: string()
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim()
        .optional(),

        companyPhone1: string().trim().optional(),

        companyPhone2: string().trim().optional(),

        companyRtn: string()
        .min(14, { message: 'Debe tener 14 o más caracteres de largo'})
        .trim()
        .optional(),

        companyLogo: string().trim().optional(),

        workPosition: string().trim().optional(),

        title: string().trim().optional()
    })
};

const params = {
    params: object({
        supplierId: string(required('Supplier ID es requerido')),
    }),
};

export const createSupplierSchema = object({
    ...payload
});

export const getSupplierSchema = object({
    ...params 
});

export const updateSupplierSchema = object({
    ...updatePayload,
    ...params
});

export const deleteSupplierSchema = object({
    ...params 
});

export type CreateSupplierInput = TypeOf<typeof createSupplierSchema>;
export type UpdateSupplierInput = TypeOf<typeof updateSupplierSchema>;
export type ReadSupplierInput = TypeOf<typeof getSupplierSchema>;
export type DeleteSupplierInput = TypeOf<typeof deleteSupplierSchema>;