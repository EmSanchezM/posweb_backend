import { object, string, TypeOf, z } from "zod";
import { invalidType, required } from './errorMessages';

enum Gender { Male, Female };

const payload = {
    body: object({
        identidad: string(required('Identidad es requerida'))
        .trim(),

        name: string(required('Nombre es requerido'))
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim(),

        lastName: string(required('Apellido es requerido')).min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim(),

        username: string(required('Nombre de usuario es requerido'))
        .min(2, { message: 'Debe tener 2 o más caracteres de largo'})
        .trim(),

        rtn: string()
            .min(14, { message: 'Debe tener 14 o más caracteres de largo'})
            .trim(),

        gender: string().trim(),

        rol: string(required('Rol de usuario es requerido')).trim(),
        
        birth: string(),

        email: string(required('Email es requerido'))
        .trim()
        .email('No es un email valido'),

        password: string(required('Password es requerida')).min(6, 'Contraseña debe tener un mínimo de 6 caracteres'),

        passwordConfirm: string(required('Password es requerida')).min(6, 'Contraseña de confirmación debe tener un mínimo de 6 caracteres'),

        phone1: string(required('Telefono es requerido')).trim(),

        phone2: string().trim(),

        location: string().trim(),

        country: string().trim(),

        city: string().trim(),

        workLocation: string().trim(),

    }).refine((data) => data.password === data.passwordConfirm, {
        message: 'Password do not match',
        path: ['passwordConfirm']
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

        username: string(invalidType('Username must be a string'))
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

        phone1: string().optional(),

        phone2: string().optional(),

        location: string().optional(),

        country: string().optional(),

        city: string().optional(),

        website: string().optional(),

        facebook: string().optional(),

        twitter: string().optional(),

        linkedin: string().optional(),

        workLocation: string().optional()
    })
};

const loginPayload = {
    body: object({
        username: string(required('Nombre de usuario es requerido')).trim(),
        password: string(required('Password es requerido'))
    })
};

const params = {
    params: object({
        userId: string(required('User ID es requerido')),
    }),
};

export const createUserSchema = object({
    ...payload
});

export const getUserSchema = object({
    ...params 
});

export const updateUserSchema = object({
    ...updatePayload,
    ...params
});

export const deleteUserSchema = object({
    ...params 
});

export const loginSchema = object({
    ...loginPayload
});

export const updateProfileSchema = object({
    ...updatePayload
})

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.passwordConfirm'>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type ReadUserInput = TypeOf<typeof getUserSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
export type LoginUserInput = TypeOf<typeof loginSchema>; 
export type ProfileUserInput = TypeOf<typeof updateProfileSchema>;